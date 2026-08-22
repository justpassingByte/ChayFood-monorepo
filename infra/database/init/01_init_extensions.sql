-- Script khởi tạo PostgreSQL Extensions cho dự án ChayFood
-- Tự động chạy khi Docker PostgreSQL khởi động lần đầu (thông qua /docker-entrypoint-initdb.d)

-- Extension sinh UUID ngẫu nhiên tốc độ cao
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extension hỗ trợ tìm kiếm toàn văn bản (Full-text Search & Trigram Matching)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Extension hỗ trợ tìm kiếm tiếng Việt không dấu (Accent-insensitive Search)
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Extension hỗ trợ kiểm tra Case-Insensitive text
CREATE EXTENSION IF NOT EXISTS "citext";
