# Kiến trúc SENOVA Storefront

## 1. Vị trí trong hệ thống

```
Khách hàng ──► apps/storefront (Next.js, senovagifts.com) ──► SourceLiq Storefront API (tenant = SENOVA)
                                                         ├─ catalog, pricing, promotions
                                                         ├─ inventory (dùng chung Shopee/TikTok/Fanpage/Zalo)
                                                         ├─ cart, checkout, orders, payments
                                                         ├─ customers, auth, consents
                                                         ├─ shipping quotes & tracking
                                                         ├─ chat (AI gateway + inbox CSKH)
                                                         └─ events (analytics, learning)
Chủ shop ──► SourceLiq web/app (đã có) ──► quản lý sản phẩm, ảnh, giá, khuyến mãi, đơn, chat
```

- Storefront là **ứng dụng không trạng thái nghiệp vụ**: chỉ có session (cookie) và cache.
- Multi-tenant ngay từ đầu: tenant xác định theo domain → `org_id`; theme lấy từ `packages/tokens/<tenant>.json`. SENOVA là tenant đầu tiên; sau này VEPIO hoặc seller khác dùng lại cùng app với theme khác.
- Trong monorepo SourceLiq: `apps/storefront`; backend thêm module `storefront` (public API, rate limit, CORS) đứng trước các module `catalog`, `inventory`, `order`, `finance`, `ai`, `channel` đã có.

## 2. Trang & route

| Route | Render | Ghi chú |
|---|---|---|
| `/` | ISR 60s + phần cá nhân hóa client | Super-app home: lời chào, đếm ngày tới dịp, banner, lưới 10 tiện ích, story, "Dành cho bạn", kho voucher, tìm quà 3 chạm, đang hot, flash deal, bộ sưu tập |
| `/c/[slug]`, `/collection/[slug]`, `/search` | ISR / SSR (search) | Bộ lọc, sắp xếp, phân trang/cuộn vô hạn |
| `/p/[slug]` | ISR 60s, revalidate theo webhook | Gallery, biến thể, khắc chữ, ETA theo tỉnh, mua kèm, đánh giá, hỏi đáp, JSON-LD |
| `/cart` (drawer + trang) | client | Freeship progress, upsell, hoàn tác xóa |
| `/checkout` | SSR có auth/guest | 4 bước: Thông tin → Vận chuyển & quà → Thanh toán → Xác nhận |
| `/order/[code]` | SSR, bảo vệ bằng token đơn | Thanh toán (VietQR/ví), theo dõi hành trình |
| `/track` | SSR | Tra cứu bằng mã đơn + SĐT |
| `/account/*` | SSR auth | Đơn hàng, yêu thích, địa chỉ, voucher đã lưu, hồ sơ, xóa tài khoản |
| `/policy/*` | SSG | Giao hàng, đổi trả, bảo mật, điều khoản |

## 3. Thành phần UI chính (từ prototype v3)

- `SuperHeader`: lời chào theo giờ, `NextOccasion` (20/10, 20/11, Noel, 14/2, 8/3 — cấu hình được trong SourceLiq), chọn tỉnh giao hàng.
- `BannerCarousel`: tự chạy 5s, dừng khi hover/focus, có điều khiển bàn phím.
- `UtilityGrid` (10 ô): event, flash, voucher, freeship, engrave, express, wrap, finder, track, chat. Mỗi ô mở `ActionSheet` (bottom sheet trên điện thoại, sheet giữa trên desktop) với hành động theo ngữ cảnh. Cấu hình ô (bật/tắt, thứ tự, nhãn, badge) lấy từ API `GET /storefront/config`.
- `ContextCards`: thẻ "Dành cho bạn" sinh từ trạng thái khách (giỏ, đơn chờ thanh toán, đơn đang giao, yêu thích, voucher chưa lưu, chưa đăng ký) — logic ở API `GET /me/context` để dùng chung với app/Zalo sau này.
- `Stories`: dữ liệu từ `GET /storefront/stories`; viewer toàn màn hình, tiến độ 5s, nút Mua ngay/+ Giỏ.
- `VoucherWallet`: lưu mã vào tài khoản (khách vãng lai lưu cookie); checkout tự đề xuất mã tốt nhất hợp lệ từ server.
- `ProductCard`, `QuickView`, `FlyToCart`, `CartDrawer`, `CheckoutStepper`, `CarrierPicker`, `PaymentPicker`, `VietQRPanel`, `OrderTimeline`, `ChatWidget`, `Confetti`.

## 4. Luồng đặt hàng

1. Thêm giỏ → `POST /carts/{id}/items` (server kiểm tra tồn).
2. Vào checkout → `POST /checkout/start` tạo reservation (TTL 15 phút).
3. Bước 1 → `PUT /checkout/{id}/address`; bước 2 → `GET /checkout/{id}/shipping-options` (báo giá thật từ hãng) + `PUT .../shipping` + `PUT .../gift`.
4. Bước 3 → `PUT .../payment`; voucher `POST .../vouchers`.
5. Bước 4 → `POST /checkout/{id}/quote` hiển thị tổng; `POST /orders` (Idempotency-Key).
6. Thanh toán online → `POST /orders/{code}/payments` trả URL/QR; xác nhận bằng webhook ở backend; trang đơn nhận cập nhật qua SSE/polling.
7. Vận chuyển: SourceLiq tạo vận đơn sau khi đơn được xác nhận; trạng thái về qua webhook hãng → `shipment.updated` → trang theo dõi.

## 5. Chat tư vấn

- `ChatWidget` → `POST /chat/sessions` / `POST /chat/sessions/{id}/messages` (SSE stream).
- Backend dùng AI gateway của SourceLiq với tool: `search_products`, `get_product`, `get_policy`, `get_order_status` (cần xác thực SĐT/đơn), `add_to_cart` (trả về hành động để client thực hiện). Câu trả lời trả kèm `product_ids` để render thẻ sản phẩm.
- Chuyển nhân viên: tạo hội thoại trong hộp thư CSKH SourceLiq (cùng nơi với Shopee/TikTok/Zalo OA/Messenger), giữ nguyên lịch sử.
- PII được che trước khi gửi model; không gửi PII sang nhà cung cấp model xử lý tại Trung Quốc (theo quy tắc AI gateway).

## 6. Hiệu năng & hạ tầng
- Deploy: Vercel hoặc container Node sau CDN; ảnh qua CDN có resize (AVIF/WebP).
- Cache: ISR cho trang công khai; revalidate theo webhook `product.updated`, `price.updated`, `inventory.updated` (tồn kho hiển thị client-side để không cần rebuild).
- Quan sát: Web Vitals, lỗi client (Sentry hoặc tương đương), log server có request id.
