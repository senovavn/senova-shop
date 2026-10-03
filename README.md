# SENOVA Shop

Website bán hàng của SENOVA: phụ kiện & quà tặng, "Little Things, Better Days."

- **Đang chạy:** https://senovagifts.com — prototype v3 (`site/`), trang tĩnh trên Cloudflare Pages.
- **Đang xây:** ứng dụng Next.js trong `apps/storefront`, dùng Storefront API của SourceLiq.

## Cấu trúc
| Đường dẫn | Mục đích |
|---|---|
| `site/` | Website đang chạy (prototype v3 đã sửa lỗi), deploy thẳng lên Cloudflare Pages, không cần build |
| `docs/DEPLOY_CLOUDFLARE.md` | Hướng dẫn tên miền, Cloudflare Pages, HTTPS |
| `apps/storefront/CLAUDE.md` | Stack, lệnh, 12 quy tắc không được vi phạm |
| `docs/storefront/SPEC_UX.md` | Màn hình, hành vi, tiêu chí chấp nhận |
| `docs/storefront/ARCHITECTURE.md` | Vị trí trong SourceLiq, route, component, luồng đặt hàng, chat |
| `docs/storefront/API_CONTRACT.md` + `openapi/storefront.yaml` | Hợp đồng Storefront API |
| `docs/storefront/INTEGRATIONS.md` | Thanh toán, vận chuyển, đăng nhập, OTP, pháp lý |
| `docs/storefront/BUILD_PLAN.md` | 7 sprint, exit criteria |
| `docs/storefront/prototype/` | Prototype v3 gốc (tham chiếu, không sửa) |
| `packages/tokens/senova.json` | Design tokens |
| `fixtures/storefront/` | 24 sản phẩm demo + 207 ảnh SVG minh họa + logo |
| `.claude/` | Lệnh `/storefront-*` và agent rà soát cho Claude Code |

## Xem website trên máy
```bash
python3 -m http.server 8788 --directory site
```
Mở http://localhost:8788. Thêm `?owner` để hiện bảng tải ảnh thật (`http://localhost:8788/?owner`).

## Ứng dụng Next.js (`apps/storefront`)
Cần Node 22+ và pnpm 9.
```bash
pnpm install
cp apps/storefront/.env.example apps/storefront/.env.local   # mặc định chạy mock từ fixtures
pnpm --filter storefront dev                                 # http://localhost:3000
pnpm --filter storefront test                                # unit (Vitest)
pnpm --filter storefront e2e                                 # Playwright 1440/820/390
pnpm --filter storefront lighthouse                          # Lighthouse CI
pnpm tokens:gen && pnpm contracts:gen                        # sinh lại token CSS và client OpenAPI
```
Tiến độ sprint: `docs/storefront/BUILD_PLAN.md`. Sprint tiếp theo: `/storefront-sprint 1`.

## Thay đổi so với prototype gốc (`site/index.html`)
- Bỏ mã giảm giá thì mã không tự áp lại.
- Bộ "Tìm quà" trong bảng tiện ích cập nhật đúng chính nó (trước bị trùng id với bộ trên trang chủ).
- Chữ khắc chỉ gắn cho đúng sản phẩm đang xem, không lan sang món khắc được khác.
- Đổi số lượng trong giỏ ở trang thanh toán không làm đóng giỏ.
- Mã FREESHIP chỉ miễn phí giao tiêu chuẩn, không áp cho hỏa tốc 2 giờ.
- Tồn kho đã trừ sau khi đặt hàng được giữ khi tải lại trang.
- Chat nhắc đủ 3 sản phẩm khắc được (dây chuyền, ví thẻ, khung ảnh gỗ).
- Theo SPEC_UX: banner dừng khi rê chuột/focus và điều khiển bằng phím mũi tên; story đóng bằng Esc, chuyển bằng ←/→; Esc đóng giỏ/modal/sheet/chat; "Dành cho bạn" tối đa 6 thẻ; lời mời chat chỉ hiện một lần mỗi phiên.
- Bảng quản trị ảnh chỉ hiện với `?owner`; thêm meta mô tả, Open Graph, canonical, robots.txt, sitemap, header bảo mật (`site/_headers`).
