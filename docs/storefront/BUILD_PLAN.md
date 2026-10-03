# Kế hoạch triển khai SENOVA Storefront với Claude Code

Mục tiêu: từ prototype v3 lên website chạy thật tại `senovagifts.com`, dùng chung backend SourceLiq. 7 sprint, mỗi sprint 1–2 tuần.

Cách dùng: mở terminal ở gốc repo, chạy `claude`, gõ `/storefront-sprint 0`. Duyệt kế hoạch → cho làm → cuối sprint chạy `/storefront-qa` và `/storefront-guardrails`.

## Sprint 0 — Khung & mock (2–3 ngày)
**Giao:** `apps/storefront` (Next.js, TS strict, Tailwind từ `packages/tokens/senova.json`, font qua next/font), layout chung (marquee, header dính co lại khi cuộn, footer, bottom nav phone có nút Tìm quà nổi), MSW mock từ `fixtures/storefront/products.json` + ảnh SVG fixture, client sinh từ `openapi/storefront.yaml`, Playwright 3 viewport, Lighthouse CI.
**Exit:** `pnpm --filter storefront dev` chạy với mock; header/footer/bottom nav đúng prototype ở 1440/820/390; CI xanh.
```
/storefront-sprint 0
Đọc apps/storefront/CLAUDE.md và docs/storefront/*. Mở prototype để đối chiếu.
Dựng khung app, token, font, mock MSW từ fixtures, client OpenAPI. Lập kế hoạch trước, chờ duyệt.
```

## Sprint 1 — Trang chủ super-app & catalog (2 tuần)
**Giao:** SuperHeader, BannerCarousel, UtilityGrid + ActionSheet (10 tiện ích), Stories + viewer, ContextCards (mock `/me/context`), VoucherWallet, Finder, Đang hot (xếp hạng), Flash deal (đếm ngược theo `ends_at`), bộ sưu tập; trang danh mục/tìm kiếm/bộ lọc; trang sản phẩm (gallery, biến thể, khắc chữ, ETA, bundle, tabs, JSON-LD); QuickView; ISR.
**Exit:** Đối chiếu từng khối với SPEC_UX (bảng tiêu chí); Lighthouse mobile ≥ 90 Performance/SEO/A11y cho `/` và `/p/[slug]`.
```
/storefront-sprint 1
Bám SPEC_UX mục Trang chủ, ActionSheet, Danh mục, Trang sản phẩm. Component theo ARCHITECTURE mục 3.
Mọi hiệu ứng tôn trọng prefers-reduced-motion; không cộng tiền ở client.
```

## Sprint 2 — Giỏ hàng & checkout (2 tuần)
**Giao:** CartDrawer (freeship progress, upsell, hoàn tác), FlyToCart, Checkout 4 bước theo luồng ARCHITECTURE mục 4 với mock quote/shipping/payment, voucher, trang đơn + VietQR mock + timeline, tra cứu đơn, Idempotency-Key, reservation TTL hiển thị khi sắp hết.
**Exit:** e2e: khách vãng lai mua 2 món → hỏa tốc (HCM) → VietQR → đơn hiển thị; bấm Đặt hàng 2 lần chỉ 1 đơn; hết hàng giữa chừng báo lỗi rõ.
```
/storefront-sprint 2
Tổng tiền chỉ lấy từ POST /checkout/{id}/quote. Viết e2e Playwright cho luồng mua trước khi hoàn thiện UI.
```

## Sprint 3 — Tài khoản khách hàng (1,5 tuần)
**Giao:** đăng ký/đăng nhập (email/SĐT), OTP quên mật khẩu, Zalo/Google OAuth (mock trước), nhận đơn vãng lai về tài khoản, yêu thích, địa chỉ, voucher đã lưu, mua lại, hồ sơ, xóa tài khoản, quản lý đồng ý marketing; ContextCards thật từ `/me/context`.
**Exit:** e2e đăng ký → mua → đơn có trong tài khoản; xóa tài khoản hoạt động; cookie httpOnly, không lộ token ở client.

## Sprint 4 — Tích hợp thanh toán & vận chuyển thật (2 tuần, backend SourceLiq + website)
**Giao:** connector VietQR + đọc giao dịch, ZaloPay, MoMo, VNPay (SANDBOX); GHN, GHTK báo giá & vận đơn; Ahamove hỏa tốc; webhook có chữ ký, chống replay, xử lý trùng; cập nhật trạng thái đơn qua SSE.
**Exit:** sandbox mỗi cổng: thanh toán thành công/thất bại/hết hạn đều đúng trạng thái; vận đơn tạo được và trạng thái về trang theo dõi.
```
/storefront-integrate <tên cổng hoặc hãng>
Đọc docs/storefront/INTEGRATIONS.md. Không đoán tham số: đọc tài liệu chính thức; thiếu credential thì dừng ở MOCK và báo tôi.
```

## Sprint 5 — Chat tư vấn AI & nội dung (1,5 tuần)
**Giao:** ChatWidget (SSE), tool `search_products/get_product/get_policy/get_order_status/add_to_cart` ở AI gateway, thẻ sản phẩm trong chat, chuyển nhân viên sang hộp thư CSKH SourceLiq/Zalo OA/Messenger; quản lý banner, story, dịp, tiện ích từ SourceLiq; sự kiện thương mại.
**Exit:** bộ eval 30 câu hỏi tiếng Việt (tìm quà, phí ship, đổi trả, theo dõi đơn): không bịa giá/chính sách; handoff giữ lịch sử.

## Sprint 6 — SEO, PWA, hiệu năng, pháp lý & go-live (1 tuần)
**Giao:** sitemap, robots, canonical, OG, JSON-LD hoàn chỉnh; PWA; tối ưu ảnh/JS; trang chính sách; thông tin pháp lý bắt buộc ở footer; checklist pháp lý trong INTEGRATIONS; giám sát lỗi & Web Vitals; runbook.
**Exit:** Lighthouse mobile ≥ 90 mọi trang chính; axe 0 lỗi nghiêm trọng; e2e toàn bộ xanh trên staging; chủ shop duyệt nội dung chính sách.

## Tiến độ
| Sprint | Trạng thái | Ghi chú |
|---|---|---|
| 0 | Xong (chờ duyệt PR) | Next.js 16.3 + Tailwind 4 từ token; mock MSW `getResponse` (không vá fetch toàn cục); unit 17/17, e2e 14/14 ở 1440/820/390; Lighthouse desktop 98/100/96/100, mobile 96/100/96/100 (LCP mobile 2,8 s do ảnh SVG demo có blur, xử lý ở Sprint 1). Header giữ chiều cao cố định khi cuộn (chỉ đổ bóng + thu logo bằng transform) để CLS = 0. |
| 1 | Xong (chờ duyệt PR) | Trang chủ super-app (10 tiện ích + ActionSheet, banner, story, Dành cho bạn, voucher, tìm quà, hot, flash, bộ sưu tập), danh mục/bộ sưu tập/tìm kiếm/gợi ý quà + bộ lọc, trang sản phẩm (gallery, biến thể, khắc chữ, tồn kho trực tiếp, ETA, tab, mua kèm, JSON-LD), xem nhanh. Unit 34/34, e2e 81/81 (1440/820/390). Lighthouse mobile (throttling thật, trung vị 3 lần): / 97, /p 95–98, /c 95–96; A11y 100, SEO 100, CLS ≈ 0; LCP /p và /c ≈ 2,7 s (ảnh SVG demo). Giỏ hàng tạm lưu trên trình duyệt, Sprint 2 chuyển sang API. Chat tắt đến Sprint 5. |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |
