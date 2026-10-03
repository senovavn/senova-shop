# SENOVA Storefront — hướng dẫn cho Claude Code

Website bán hàng của SENOVA (phụ kiện & quà tặng, "Little Things, Better Days."). Đây là **kênh Website** của tài khoản SENOVA trên SourceLiq: mọi dữ liệu sản phẩm, giá, tồn kho, khuyến mãi, đơn, khách hàng, chat đều đọc/ghi qua **Storefront API của SourceLiq**. Website không có database nghiệp vụ riêng.

Nguồn sự thật, theo thứ tự:
1. `docs/storefront/SPEC_UX.md` — màn hình, hành vi, tiêu chí chấp nhận.
2. `docs/storefront/prototype/senova-website.html` — prototype v3 đã duyệt (mở bằng trình duyệt; xem bố cục, chuyển động, wording).
3. `docs/storefront/ARCHITECTURE.md`, `docs/storefront/API_CONTRACT.md`, `docs/storefront/INTEGRATIONS.md`.
4. `docs/storefront/BUILD_PLAN.md` — sprint và tiến độ.
5. Quy tắc chung của monorepo trong `CLAUDE.md` gốc (nếu có) vẫn áp dụng.

## Stack
- Next.js (App Router, bản Active LTS đã vá mới nhất), TypeScript strict, React Server Components.
- Tailwind CSS sinh từ `packages/tokens/senova.json`; không hard-code màu, bán kính, font ngoài token.
- Font: Bricolage Grotesque (tiêu đề) + Be Vietnam Pro (nội dung, giá) qua `next/font/google`, subset `vietnamese` + `latin`.
- Data: client sinh từ `openapi/storefront.yaml`; TanStack Query cho tương tác client; Server Actions cho mutation.
- Ảnh: `next/image` qua CDN của SourceLiq media; fixture SVG trong `fixtures/storefront/images` chỉ dùng cho dev/demo.
- Test: Vitest + Testing Library; Playwright cho e2e (desktop 1440, tablet 820, phone 390); axe cho a11y; Lighthouse CI.
- PWA: manifest + service worker cache shell và trang đã xem; không queue thanh toán offline.

## Lệnh
```bash
pnpm --filter storefront dev          # dev server, mặc định chạy với SourceLiq mock (MSW) nếu STOREFRONT_API_MODE=mock
pnpm --filter storefront test
pnpm --filter storefront e2e          # Playwright 3 kích thước màn hình
pnpm --filter storefront lighthouse
pnpm contracts:gen                    # sinh lại client từ openapi
```

## Quy tắc không được vi phạm
1. **Giá, tồn kho, phí ship, giảm giá, tổng tiền tính ở server SourceLiq.** Client chỉ hiển thị; tổng ở bước xác nhận phải lấy từ API `POST /checkout/quote`, không cộng ở trình duyệt.
2. **Không lưu dữ liệu thẻ.** Thẻ, ví, VietQR đi qua cổng thanh toán; website chỉ nhận redirect/webhook đã xác thực chữ ký ở backend.
3. **Đơn hàng idempotent:** mọi `POST /orders` gửi `Idempotency-Key`; bấm "Đặt hàng" hai lần không tạo hai đơn.
4. **Tồn kho dùng chung đa kênh** (Website, Shopee, TikTok Shop, Fanpage, Zalo): giữ hàng (reservation) khi vào bước thanh toán, có TTL; hết hàng thì báo rõ, không bán âm.
5. **Bảo mật & quyền riêng tư:** mật khẩu chỉ ở backend (hash), phiên bằng cookie httpOnly + SameSite; xin đồng ý khi thu thập dữ liệu và marketing; có xóa tài khoản trong trang tài khoản.
6. **Ảnh sản phẩm:** chỉ dùng ảnh của shop hoặc ảnh được nhà cung cấp cấp quyền. Không tải ảnh từ Shopee/TikTok/website khác.
7. **Chat AI** chỉ trả lời từ dữ liệu catalog/chính sách lấy qua tool của SourceLiq; không bịa giá, chính sách; luôn có đường chuyển sang nhân viên.
8. **Không dark pattern:** đồng hồ flash sale phải khớp thời gian kết thúc thật; "chỉ còn X món" phải là tồn kho thật; không tick sẵn ô đồng ý marketing ngoài lựa chọn khách đã chọn trước đó.
9. **Hiệu năng:** LCP < 2,5 s và CLS < 0,1 trên 4G (trang chủ, danh mục, sản phẩm); JS client trang sản phẩm < 170 KB gzip.
10. **A11y:** WCAG 2.2 AA; mọi tương tác dùng được bằng bàn phím; tôn trọng `prefers-reduced-motion`.
11. **SEO:** SSR/ISR cho trang chủ, danh mục, sản phẩm; JSON-LD Product/Offer/AggregateRating (chỉ khi có đánh giá thật), BreadcrumbList; sitemap, canonical, Open Graph.
12. **Đo lường:** phát sự kiện thương mại chuẩn (view_item, add_to_cart, begin_checkout, add_shipping_info, add_payment_info, purchase) về SourceLiq; không gửi PII sang công cụ bên thứ ba.

## Quy ước
- Code, commit tiếng Anh; chuỗi UI tiếng Việt qua `src/i18n/messages/vi.json` (khung `en.json`), gọi bằng `t()` trong `src/i18n/t.ts`.
- Tiền hiển thị `149.000₫`; số dùng tabular; múi giờ `Asia/Ho_Chi_Minh`.
- Địa chỉ Việt Nam 2 cấp: Tỉnh/Thành phố → Phường/Xã (danh mục lấy từ API, không hard-code).
- Component đặt trong `src/components/<khu>/`; mỗi component có story/test khi có logic.
- Hiệu ứng chỉ dùng transform/opacity; thời lượng theo token `motion`.

## Làm việc
- Mỗi sprint dùng lệnh `/storefront-sprint <số>`; lập kế hoạch, chờ duyệt rồi mới code.
- Trước khi báo xong: `test`, `e2e`, `lighthouse` xanh; chạy `/storefront-guardrails`.
- Khi thiếu thông tin tích hợp (merchant, API key, tài khoản vận chuyển): dùng mock theo `INTEGRATIONS.md`, ghi rõ trong PR, không tự bịa thông số.

## Ghi chú triển khai (Sprint 0)
- Token: sửa `packages/tokens/senova.json` rồi `pnpm tokens:gen` → `src/styles/tokens.css` (`@theme` của Tailwind 4) + `src/components/brand/brand-svg.ts`. Không sửa tay file sinh ra; CI kiểm tra lệch.
- API: `src/api/client.ts` (openapi-fetch). `STOREFRONT_API_MODE=mock` hoặc thiếu `STOREFRONT_API_BASE` → trả lời từ handler MSW trong `src/mocks/` qua `getResponse`, không vá `fetch` toàn cục. Ảnh mock phục vụ ở `/mock-media/*` (chỉ chế độ mock).
- Next 16: `params`/`searchParams`/`cookies()` là async; `next/image` dùng `loading="eager"` + `fetchPriority="high"` thay cho `priority` (đã bỏ).
- Header không đổi chiều cao khi cuộn (tránh CLS); hiệu ứng "co lại" làm bằng `transform` trên logo.

## Next.js 16
@AGENTS.md
