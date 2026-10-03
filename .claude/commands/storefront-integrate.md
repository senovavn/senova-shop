---
description: Tích hợp một cổng thanh toán, hãng vận chuyển hoặc dịch vụ đăng nhập
argument-hint: <vietqr|zalopay|momo|vnpay|ghn|ghtk|ahamove|zalo-login|google-login|zns>
---
Tích hợp `$ARGUMENTS` theo @docs/storefront/INTEGRATIONS.md.
- Đặt connector ở backend SourceLiq (module channel/finance/order), không ở website.
- Đọc tài liệu chính thức mới nhất (web search/fetch); trích tên endpoint, tham số, cách ký ngay trong mô tả PR kèm link. Không đoán.
- Chế độ MOCK → SANDBOX → LIVE; secret lấy từ secret manager theo org_id.
- Bắt buộc: xác thực chữ ký webhook/IPN, chống replay, xử lý callback trùng, truy vấn trạng thái khi mất callback, idempotency, log có request id (không log secret/PII).
- Test: thành công, thất bại, hết hạn, callback trùng, callback sai chữ ký.
- Thiếu credential: dừng ở MOCK, liệt kê những gì chủ shop cần cung cấp.
