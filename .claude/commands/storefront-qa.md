---
description: Chạy QA luồng mua sắm end-to-end trên 3 kích thước màn hình
---
Chạy và báo cáo trên 1440×900, 820×1180, 390×844:
1. Trang chủ: banner, 10 tiện ích (mở từng ActionSheet và bấm hành động chính), story (Mua ngay), "Dành cho bạn", lưu voucher.
2. Tìm "ly giữ nhiệt" → trang sản phẩm → đổi màu → thêm giỏ (ảnh bay vào giỏ) → khắc chữ ở sản phẩm khắc được.
3. Giỏ: tăng/giảm, xóa + hoàn tác, upsell để đủ freeship.
4. Checkout 4 bước: lỗi nhập liệu, giao tặng, hỏa tốc (HCM) và tiêu chuẩn (tỉnh khác), gói quà theo dịp, mã voucher đã lưu tự áp, VietQR → xác nhận (mock webhook) → timeline.
5. Đăng ký tài khoản nhận đơn vãng lai; mua lại từ tài khoản.
6. Chat: "quà 20/10 cho mẹ dưới 300k", "phí ship", "đơn của tôi", chuyển nhân viên.
7. Lighthouse + axe cho /, /c/qua-tang, /p/<slug>, /checkout.
Báo cáo bảng pass/fail, ảnh lỗi, đề xuất sửa.
