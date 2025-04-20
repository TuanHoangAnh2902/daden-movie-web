# Daden Movie Web

Ứng dụng web xem phim trực tuyến được xây dựng với React, Redux Toolkit, và Ant Design, đã được tối ưu hóa để cải thiện hiệu suất.

## Các tối ưu hóa đã thực hiện

### 1. Tối ưu tải dữ liệu

- ✅ Caching API với Redux Toolkit Query
- ✅ Memoization cho các hàm phức tạp
- ✅ Debounce cho các tìm kiếm

### 2. Tối ưu hiển thị

- ✅ Lazy loading cho hình ảnh
- ✅ Skeleton loading khi đang tải dữ liệu
- ✅ React.lazy và Suspense cho code splitting

### 3. Tối ưu build

- ✅ Nén với GZIP và Brotli
- ✅ Tối ưu hóa hình ảnh
- ✅ Phân chia chunk cho code splitting
- ✅ Tối ưu CSS với PostCSS

### 4. Tăng độ ổn định

- ✅ ErrorBoundary cho xử lý lỗi
- ✅ Prefetching dữ liệu quan trọng
- ✅ Progressive Web App (PWA) với Service Worker

## Khởi động dự án

```bash
# Cài đặt các gói phụ thuộc
npm install

# Khởi động server phát triển
npm run dev

# Build cho môi trường production
npm run build

# Phân tích kích thước bundle
ANALYZE=true npm run build

# Chạy bản build
npm run preview
```

## Cấu trúc dự án

```
src/
  ├── assets/         # Tài nguyên (hình ảnh, svg, ...)
  ├── components/     # Components UI tái sử dụng
  ├── config/         # Cấu hình (firebase, ...)
  ├── constants/      # Hằng số và dữ liệu tĩnh
  ├── features/       # Logic nghiệp vụ theo tính năng
  ├── hooks/          # Custom React Hooks
  ├── layouts/        # Bố cục trang
  ├── pages/          # Các trang của ứng dụng
  ├── redux/          # Cấu hình Redux store
  ├── routes/         # Định nghĩa routes
  ├── services/       # APIs và services
  ├── styles/         # Global styles và variables
  ├── themes/         # Cấu hình theme
  ├── utils/          # Tiện ích và helper functions
  ├── App.jsx         # Component gốc
  └── main.jsx        # Entry point
```

## Hướng dẫn triển khai

### Build cho Production

1. Chạy lệnh build: `npm run build`
2. Thư mục `dist` sẽ chứa phiên bản tối ưu cho production
3. Có thể triển khai thư mục này lên bất kỳ dịch vụ hosting nào (Vercel, Netlify, Firebase, ...)

### Progressive Web App (PWA)

- Ứng dụng đã được cấu hình để hoạt động như PWA
- Service Worker sẽ cache tài nguyên tĩnh
- Người dùng có thể cài đặt ứng dụng trên thiết bị di động

## Phân tích hiệu suất

Để phân tích kích thước bundle và hiệu suất:

```bash
ANALYZE=true npm run build
```

## Contributors

- Hoàng Ngọc Anh Tuấn
