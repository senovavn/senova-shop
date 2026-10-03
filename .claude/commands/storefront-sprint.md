---
description: Lập kế hoạch và thực hiện một sprint của SENOVA Storefront
argument-hint: <số sprint>
---
Thực hiện Sprint $ARGUMENTS của SENOVA Storefront.

1. Đọc @apps/storefront/CLAUDE.md, mục Sprint $ARGUMENTS trong @docs/storefront/BUILD_PLAN.md, các phần liên quan trong SPEC_UX, ARCHITECTURE, API_CONTRACT. Mở `docs/storefront/prototype/senova-website.html` để đối chiếu giao diện và hành vi.
2. Viết kế hoạch: component/route sẽ tạo, endpoint dùng (mock hay thật), test sẽ viết, rủi ro, câu hỏi mở. Dừng lại chờ duyệt.
3. Sau khi duyệt: nhánh `storefront/sprint-$ARGUMENTS-<tên>`, commit nhỏ kèm test.
4. Chạy `pnpm --filter storefront test && pnpm --filter storefront e2e && pnpm --filter storefront lighthouse`, rồi `/storefront-guardrails`.
5. Báo cáo từng Exit criteria: đạt/chưa, bằng chứng (tên test, ảnh chụp 1440/820/390, điểm Lighthouse).
6. Cập nhật bảng Tiến độ trong BUILD_PLAN.
