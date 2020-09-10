* Quan trọng:
Vì khi chạy hệ thống sẽ tự tiến hành tạo các bảng và trường dữ liệu nên hãy tạo db mới để test,
vì có thể sẽ gây mất dự liệu nếu trỏ vào db cũ.


Yêu cầu máy đã có node,yarn, nodemon, pm2
Trong bản này đang dùng version node 10 nên khuyên dùng node10 để đỡ xung đột
Vào thư mục configs/env.js cập nhật lại các thông tin db


Gõ các lệnh sau:

yarn // cài đặt các thư viện
yarn start // khởi động server

 Kiểm tra bằng postman hoặc vào trình duyệt gõ 
http://localhost:3001/users


Hướng dẫn dùng module alias

- Vào file package.json chỉnh sửa phần _moduleAliases theo cũ pháp mẫu (Chỗ này để khi run nó sẽ hiểu cách viết rút gọn)
- Cập nhật file jsconfig.json (Cái này để thằng Visual code nó hiểu) thiếu cái này vẫn chạy đc nhưng k có gợi ý.
- Sau khi thêm các thông tin trên thay vì dùng require("../controllers/userController") có thể dùng require("@controllers/userController"), việc copy đoạn code này  qua file khác cũng sẽ chạy luôn mà không cần sửa lại đường dẫn. Rất ổn khi làm project có nhiều file trong folder.


Hướng dẫn deploy trên windows server


Hướng dẫn deploy trên server linux



