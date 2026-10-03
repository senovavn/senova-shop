# Đưa senovagifts.com lên Cloudflare

Website hiện tại là bản prototype v3 (thư mục `site/`), một trang HTML tĩnh, không cần build. Cloudflare tự triển khai lại mỗi khi có commit mới trên nhánh `main` của `senovavn/senova-shop`.

Thời gian: khoảng 20 phút thao tác + chờ đổi nameserver (thường vài phút đến vài giờ, tối đa 24–48 giờ).

## Bước 1. Đưa tên miền về Cloudflare
1. Đăng nhập https://dash.cloudflare.com bằng tài khoản của SENOVA (nên dùng `senovavn@gmail.com` để tách khỏi tài khoản khác).
2. **Add a domain** (hoặc *Add a site*) → nhập `senovagifts.com` → chọn gói **Free**.
3. Cloudflare quét bản ghi DNS cũ. Nếu tên miền đang có email (MX) thì giữ nguyên các bản ghi đó. Xóa các bản ghi A/CNAME cũ của `@` và `www` nếu đang trỏ sang hosting cũ.
4. Cloudflare cho 2 nameserver, dạng `xxx.ns.cloudflare.com`.
5. Vào trang quản lý tên miền ở nhà đăng ký (nơi đã mua `senovagifts.com`) → mục **Nameserver / DNS** → đổi sang 2 nameserver đó → lưu. Nếu đang bật **DNSSEC** ở nhà đăng ký thì tắt trước khi đổi.
6. Quay lại Cloudflare, bấm **Check nameservers**. Khi trạng thái là **Active** thì sang bước 3. Bước 2 có thể làm trong lúc chờ.

## Bước 2. Tạo dự án Pages nối với GitHub
1. Cloudflare → **Workers & Pages** → **Create** → tab **Pages** → **Connect to Git** (*Import an existing Git repository*).
2. Chọn **GitHub** → cài **Cloudflare Pages** GitHub App cho tài khoản `senovavn` → cho phép repo `senova-shop`.
3. Cấu hình:

   | Mục | Giá trị |
   |---|---|
   | Project name | `senova-shop` |
   | Production branch | `main` |
   | Framework preset | None |
   | Build command | *(để trống)* |
   | Build output directory | `site` |

4. **Save and Deploy**. Sau khoảng 1 phút có địa chỉ `https://senova-shop.pages.dev`. Mở thử.

## Bước 3. Gắn tên miền
1. Trong dự án `senova-shop` → **Custom domains** → **Set up a custom domain** → `senovagifts.com` → **Activate domain**. Cloudflare tự tạo bản ghi DNS và cấp chứng chỉ HTTPS.
2. Làm lại với `www.senovagifts.com`.
3. Chuyển `www` về tên miền chính: **Rules** → **Redirect Rules** → *Create rule* → template **Redirect from WWW to Root** → `https://senovagifts.com`, mã 301.
4. **SSL/TLS** → **Overview** → chế độ **Full (strict)**. **SSL/TLS → Edge Certificates** → bật **Always Use HTTPS**.

## Bước 4. Kiểm tra
- `https://senovagifts.com` mở được, có ổ khóa HTTPS.
- `http://senovagifts.com` và `https://www.senovagifts.com` tự chuyển về `https://senovagifts.com`.
- Trên điện thoại: thanh điều hướng dưới, nút "Tìm quà" nổi giữa.
- Bảng quản trị ảnh (SourceLiq) chỉ hiện khi mở `https://senovagifts.com/?owner`.

## Cập nhật website về sau
Sửa `site/index.html` → commit → push lên `main`. Cloudflare tự deploy trong khoảng 1 phút. Mỗi nhánh/PR khác `main` có link xem trước riêng (`<nhánh>.senova-shop.pages.dev`), không ảnh hưởng trang thật.

Quay về bản cũ: dự án `senova-shop` → **Deployments** → chọn bản trước → **Rollback**.

## Lưu ý trước khi bán thật
Bản này là **prototype có dữ liệu demo**: giá, tồn kho, đánh giá, voucher là mẫu; thanh toán và vận chuyển đều mô phỏng; đơn hàng và tài khoản chỉ lưu trong trình duyệt của khách. Thanh "Prototype website SENOVA · dữ liệu demo" được giữ lại để khách không nhầm là đơn thật. Website bán thật là ứng dụng Next.js trong `apps/storefront`, làm theo `docs/storefront/BUILD_PLAN.md` (Sprint 0 → 6); khi xong, trỏ cùng tên miền sang ứng dụng đó. Thủ tục pháp lý TMĐT xem `docs/storefront/INTEGRATIONS.md`.
