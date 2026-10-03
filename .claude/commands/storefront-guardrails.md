---
description: Rà soát vi phạm quy tắc của storefront
---
Rà soát thay đổi trên nhánh hiện tại theo 12 quy tắc trong @apps/storefront/CLAUDE.md. Kiểm tra cụ thể:
- Tính tổng tiền, phí ship, giảm giá ở client; dùng giá từ cache cũ ở bước xác nhận.
- `POST /orders` hoặc thanh toán thiếu Idempotency-Key.
- Bất kỳ trường số thẻ/CVV nào trong website; secret hoặc API key ở client/bundle.
- Màu, font, radius hard-code ngoài token; hiệu ứng không có nhánh reduced-motion; animation width/height/top gây layout shift.
- Ảnh không có kích thước (gây CLS), thiếu alt; nút chỉ có icon thiếu aria-label.
- Đồng hồ flash sale hoặc "chỉ còn X" không lấy từ dữ liệu thật; ô marketing tick sẵn.
- Gửi PII sang công cụ đo lường bên thứ ba; chat gửi PII chưa che.
- Thiếu JSON-LD/canonical ở trang công khai; trang sản phẩm render client-only.
Báo cáo bảng: file:dòng, quy tắc, mức độ, cách sửa.
