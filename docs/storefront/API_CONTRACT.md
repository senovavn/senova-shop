# Storefront API (SourceLiq) — hợp đồng cho website

Base: `https://api.sourceliq.vn/v1/storefront` · tenant theo header `X-Storefront-Host: senovagifts.com` (server suy ra `org_id`).
Bản OpenAPI khởi điểm: `openapi/storefront.yaml`. Khi backend chưa có, chạy mock MSW từ `fixtures/storefront/products.json`.

Quy ước: tiền là số nguyên VND; thời gian ISO 8601 UTC; lỗi dạng `{code, message, field?}`; mọi POST ghi dữ liệu nhận `Idempotency-Key`.

| Nhóm | Endpoint | Ghi chú |
|---|---|---|
| Config | `GET /config` | Theme, marquee, utilities (thứ tự, bật/tắt, badge), dịp sắp tới, ngưỡng freeship, chính sách |
| Nội dung | `GET /banners`, `GET /stories`, `GET /collections/{slug}` | Do chủ shop quản lý trong SourceLiq |
| Catalog | `GET /products?cat&coll&q&price_min&price_max&badge&in_stock&sort&cursor`, `GET /products/{slug}`, `GET /products/{slug}/related`, `GET /products/{slug}/bundle` | Giá + tồn trả theo biến thể (`sku`) |
| Tìm kiếm | `GET /search/suggest?q=` | Không dấu, tối đa 5 |
| Finder | `GET /finder?rec&occ&budget` | Trả `count` + danh sách |
| Tồn kho | `GET /inventory?skus=` | Gọi từ client để luôn mới |
| Giỏ | `POST /carts`, `GET /carts/{id}`, `POST /carts/{id}/items`, `PATCH /carts/{id}/items/{line}`, `DELETE ...` | Dòng giỏ gồm `sku`, `qty`, `engrave?` |
| Checkout | `POST /checkout/start` (reservation 15'), `PUT /checkout/{id}/contact`, `PUT .../address`, `GET .../shipping-options`, `PUT .../shipping`, `PUT .../gift`, `PUT .../payment`, `POST .../vouchers`, `DELETE .../vouchers/{code}`, `POST .../quote` | `quote` là nguồn sự thật cho tổng tiền |
| Đơn | `POST /orders` → `{code, access_token}`, `GET /orders/{code}?t=`, `GET /orders/{code}/events` (SSE) | `access_token` cho khách vãng lai xem đơn |
| Thanh toán | `POST /orders/{code}/payments {method}` → `{redirect_url? , qr_payload?, expires_at}` | Xác nhận chỉ qua webhook ở backend |
| Tra cứu | `POST /orders/lookup {code, phone}` | Rate limit |
| Khách hàng | `POST /auth/register`, `POST /auth/login`, `POST /auth/otp/request`, `POST /auth/otp/verify`, `POST /auth/oauth/{zalo|google}`, `POST /auth/logout`, `GET/PATCH /me`, `DELETE /me` | Cookie httpOnly |
| Tài khoản | `GET /me/orders`, `GET/PUT /me/addresses`, `GET/POST/DELETE /me/wishlist`, `GET/POST /me/vouchers`, `GET /me/context` | `context` sinh thẻ "Dành cho bạn" |
| Địa giới | `GET /geo/provinces`, `GET /geo/provinces/{code}/wards` | 34 tỉnh/thành, 2 cấp |
| Chat | `POST /chat/sessions`, `POST /chat/sessions/{id}/messages` (SSE), `POST /chat/sessions/{id}/handoff` | Trả `reply`, `product_ids[]`, `actions[]` |
| Sự kiện | `POST /events` (batch) | view_item, add_to_cart, begin_checkout, add_shipping_info, add_payment_info, purchase, utility_tapped, story_viewed, voucher_saved |

Webhook từ SourceLiq tới website (revalidate cache): `product.updated`, `price.updated`, `banner.updated`, `config.updated` — ký HMAC, endpoint `POST /api/revalidate`.
