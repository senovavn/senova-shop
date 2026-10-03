---
description: Dựng một trang/khối của storefront theo prototype và SPEC_UX
argument-hint: <tên khối, ví dụ UtilityGrid hoặc /p/[slug]>
---
Dựng `$ARGUMENTS`.
1. Tìm khối tương ứng trong prototype (HTML/CSS/JS) và trong SPEC_UX; liệt kê hành vi, trạng thái rỗng/lỗi/đang tải, tiêu chí chấp nhận.
2. Ánh xạ dữ liệu → endpoint trong API_CONTRACT; thiếu thì đề xuất bổ sung OpenAPI rồi `pnpm contracts:gen`.
3. Server Component mặc định; chỉ phần tương tác là Client Component. Không tính tiền ở client.
4. Token từ `packages/tokens/senova.json`; chuyển động theo token `motion`, có nhánh reduced-motion.
5. Viết test component + cập nhật e2e nếu thuộc luồng mua. Chụp ảnh 3 viewport để so với prototype.
