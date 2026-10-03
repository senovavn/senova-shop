# SPEC UX — SENOVA Storefront (theo prototype v3)

Mở `prototype/senova-website.html` để xem. Mọi số liệu trong prototype (giá, tồn, đánh giá, phí ship, voucher) là demo; bản thật lấy từ API.

## Nguyên tắc thiết kế
- Bộ nhận diện SENOVA: Plum `#5A2A4F` dẫn dắt, Sunbeam `#FFC23D` làm điểm nhấn, nền ấm `#FBF7F2`; tiêu đề Bricolage Grotesque, nội dung Be Vietnam Pro.
- Cảm giác super-app (tham chiếu Zalo, Trip.com): lưới tiện ích icon gradient, mỗi ô mở hành động theo ngữ cảnh; thẻ "Dành cho bạn" đổi theo hành vi khách.
- Chuyển động mượt, ngắn (150–450 ms), chỉ transform/opacity; tắt khi `prefers-reduced-motion`.
- 3 kích thước: phone < 640 (bottom nav 5 nút, nút "Tìm quà" nổi giữa; tiện ích đặt trên banner), tablet 640–1023, desktop ≥ 1024.

## Trang chủ
| Khối | Hành vi | Tiêu chí chấp nhận |
|---|---|---|
| Super header | Lời chào theo giờ + tên khách (nếu đăng nhập); "Còn N ngày tới [dịp]"; nút "Giao tới: [tỉnh]" | Dịp lấy từ config, tự chuyển sau khi qua ngày |
| Banner | 4 slide, tự chạy 5s, chấm điều hướng | Dừng khi hover/focus; điều khiển bằng bàn phím |
| Lưới 10 tiện ích | Mỗi ô có icon gradient + nhãn + badge tùy chọn; mở ActionSheet | Mỗi sheet có ít nhất 1 hành động chính dùng được ngay |
| Story | 5 nhóm; viewer toàn màn hình; 5s/khung; chạm trái/phải; Mua ngay/+ Giỏ | Đánh dấu đã xem; Esc đóng; không tự phát âm thanh |
| Dành cho bạn | Thẻ: giỏ còn hàng, đơn chờ thanh toán, đơn đang giao, dịp sắp tới, món đã thích, voucher chưa lưu, chưa đăng ký | Mỗi thẻ có 1 nút hành động; tối đa 6 thẻ, ưu tiên theo thứ tự trên |
| Kho voucher | Vé có răng cưa; Lưu mã → Dùng ngay | Mã đã lưu được đề xuất ở checkout nếu hợp lệ |
| Tìm quà 3 chạm | Tặng ai / Dịp gì / Ngân sách, đếm số món phù hợp | Đếm khớp kết quả trang gợi ý |
| Đang hot | Băng chuyền xếp hạng 1–8 theo lượt bán 7 ngày | Số thứ tự là thứ hạng thật |
| Flash deal | Đếm ngược tới giờ kết thúc thật; thanh % suất đã bán | Ẩn khi không có chương trình |

## ActionSheet theo tiện ích
- **Quà [dịp]**: nhắc hạn đặt để kịp giao + danh sách gợi ý + nút xem tất cả.
- **Flash sale**: danh sách món giảm + Mua ngay.
- **Kho voucher**: vé + Lưu/Dùng ngay.
- **Freeship**: thanh tiến độ, còn thiếu bao nhiêu, gợi ý món vừa đủ.
- **Khắc tên**: các sản phẩm khắc được + Khắc ngay.
- **Hỏa tốc 2h**: chọn tỉnh, báo khu vực có/không hỗ trợ.
- **Gói quà**: ảnh hộp quà + chọn dịp (đai), giữ đến checkout.
- **Tìm quà**: finder rút gọn.
- **Theo dõi đơn**: đơn gần đây + Theo dõi; không có đơn → tra cứu.
- **Chat**: mở ChatWidget.

## Danh mục & tìm kiếm
- Gợi ý khi gõ (5 kết quả + xem tất cả), tìm không dấu.
- Bộ lọc: danh mục, giá, nhãn, còn hàng; sắp xếp: bán chạy, đánh giá, giảm nhiều, giá ↑↓. Bộ lọc mở toàn màn hình trên phone.
- Thẻ sản phẩm: ảnh 2 lớp (rê chuột đổi ảnh), nhãn, yêu thích, Thêm vào giỏ + Xem nhanh (desktop).

## Trang sản phẩm
- Gallery 3+ ảnh: thumbnail (desktop), vuốt + chấm (phone), phóng to theo con trỏ.
- Biến thể màu (hết hàng bị khóa), khắc chữ (tối đa 8 ký tự, xem trước), số lượng ≤ tồn.
- ETA theo tỉnh, khối "Vì sao đáng tặng", nút hỏi chat, tab Mô tả/Thông số/Đánh giá/Hỏi đáp, "Thường được mua cùng" (thêm cả bộ), sản phẩm liên quan, thanh mua dính trên phone.

## Giỏ & thanh toán
- Drawer giỏ: freeship progress, upsell món nhỏ, xóa có hoàn tác, ảnh "bay vào giỏ".
- Checkout 4 bước với stepper; tóm tắt đơn dính bên phải (desktop).
  1. Người đặt, địa chỉ (Tỉnh → Phường/Xã → số nhà), tùy chọn giao tặng người khác. Kiểm tra SĐT VN.
  2. Đơn vị vận chuyển (báo giá thật; hỏa tốc chỉ bật theo khu vực), gói quà theo dịp, ẩn giá, lời nhắn ≤ 160 ký tự.
  3. COD, VietQR, ZaloPay, MoMo, VNPay, thẻ quốc tế.
  4. Xem lại, sửa từng phần, Đặt hàng (hiện tổng tiền trên nút).
- Mã giảm giá: chip mã đã lưu; báo rõ khi chưa đủ điều kiện.

## Sau đặt hàng
- Hiệu ứng chúc mừng (tắt khi reduced motion).
- VietQR: mã, số tiền, nội dung chuyển khoản, đếm ngược hết hạn; tự cập nhật khi webhook xác nhận.
- Theo dõi: thanh hành trình + 6 mốc (Đã đặt, Đã xác nhận, Đang đóng gói, Đã giao cho ĐVVC + mã vận đơn, Đang giao, Thành công).
- Gợi ý tạo tài khoản để nhận đơn về tài khoản.

## Tài khoản
- Đăng ký email/SĐT + mật khẩu (≥ 8 ký tự), đồng ý điều khoản (bắt buộc), nhận ưu đãi (tùy chọn); OTP quên mật khẩu; Zalo/Google OAuth.
- Đơn hàng (theo dõi, mua lại), yêu thích, địa chỉ, voucher đã lưu, hồ sơ, xóa tài khoản.

## Chat
- Nút nổi, lời mời sau 4s (một lần mỗi phiên), gợi ý nhanh cuộn ngang, thẻ sản phẩm trong tin nhắn có "+ Giỏ", chỉ báo đang gõ, chuyển nhân viên.
