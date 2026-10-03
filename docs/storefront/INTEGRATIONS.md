# Tích hợp: cần gì, ai cung cấp, làm theo thứ tự nào

Nguyên tắc: tích hợp nằm ở **backend SourceLiq** (connector chuẩn, secret theo `org_id`), website chỉ gọi Storefront API. Mỗi tích hợp có chế độ MOCK → SANDBOX → LIVE. Kiểm tra tài liệu chính thức mới nhất của từng nhà cung cấp trước khi code; không đoán tên tham số.

| Hạng mục | Lựa chọn | Chủ shop cần chuẩn bị | Ghi chú kỹ thuật |
|---|---|---|---|
| VietQR (chuyển khoản) | QR theo chuẩn VietQR/NAPAS + dịch vụ đọc giao dịch ngân hàng (open API của ngân hàng hoặc dịch vụ đối soát) | Tài khoản ngân hàng doanh nghiệp/hộ KD, đăng ký dịch vụ nhận biến động số dư | Nội dung chuyển khoản = mã đơn; tự khớp số tiền + mã; QR hết hạn 15'; đối soát trong module finance |
| Ví ZaloPay | Cổng ZaloPay merchant | Hồ sơ merchant, app_id, key | Ký HMAC, callback/IPN, truy vấn trạng thái |
| Ví MoMo | Cổng MoMo for Business | partnerCode, accessKey, secretKey | IPN có chữ ký; xử lý trùng callback |
| VNPay / ATM / thẻ | VNPay hoặc cổng thẻ khác | TMN code, hash secret | Thẻ quốc tế qua cổng; website không chạm số thẻ |
| COD | Qua đơn vị vận chuyển | Hợp đồng COD với hãng | Đối soát COD theo batch (module finance) |
| GHN, GHTK | API vận chuyển | Tài khoản shop, token, kho lấy hàng | Báo giá theo khối lượng/kích thước, tạo vận đơn, webhook trạng thái |
| SPX, Viettel Post | API (xác minh điều kiện mở cho shop độc lập) | Tài khoản doanh nghiệp | Nếu chưa có API: ẩn khỏi lựa chọn |
| Hỏa tốc 2h | Ahamove hoặc dịch vụ giao nội thành | Tài khoản doanh nghiệp | Chỉ bật khi địa chỉ thuộc vùng hỗ trợ |
| Đăng nhập Zalo | Zalo Login | Zalo App ID, Secret | OAuth PKCE |
| Đăng nhập Google | Google Identity | OAuth Client ID | |
| OTP | Zalo ZNS hoặc SMS brandname | Zalo OA đã xác thực + template ZNS / brandname | Rate limit, chống spam |
| Chat → nhân viên | Hộp thư CSKH SourceLiq + Zalo OA, Messenger | Zalo OA, Facebook Page | Một lịch sử hội thoại cho mọi kênh |
| Email giao dịch | Dịch vụ email (SES/Postmark/…) | Domain gửi đã xác thực SPF/DKIM | Xác nhận đơn, đặt lại mật khẩu |
| Phân tích | Sự kiện về SourceLiq; tùy chọn GA4/Meta Pixel qua consent | ID đo lường | Không gửi PII |

## Pháp lý cần rà soát trước khi chạy thật
- Thủ tục thông báo website thương mại điện tử bán hàng với Bộ Công Thương và thông tin bắt buộc trên website (chủ thể, địa chỉ, MST, chính sách) theo quy định TMĐT hiện hành.
- Luật Bảo vệ dữ liệu cá nhân: thông báo xử lý dữ liệu, đồng ý, quyền xóa; lưu trữ dữ liệu khách hàng.
- Hóa đơn điện tử cho đơn hàng theo loại hình doanh nghiệp/hộ kinh doanh.
- Ghi nhãn và xuất xứ hàng hóa khớp với thông tin trên trang sản phẩm.
