#!/usr/bin/env bash
# ==============================================================================
# Script khôi phục (Restore) Database PostgreSQL ChayFood từ file backup
# Sử dụng: ./restore.sh ./backups/chayfood_backup_20260820_xxxxxx.sql.gz
# ==============================================================================

set -e

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Lỗi: Vui lòng cung cấp đường dẫn file backup (.sql hoặc .sql.gz)"
  echo "👉 Ví dụ: ./restore.sh ./backups/chayfood_backup_20260820_xxxxxx.sql.gz"
  exit 1
fi

echo "🔄 Đang tiến hành khôi phục database từ [${BACKUP_FILE}]..."

if [[ "$BACKUP_FILE" == *.gz ]]; then
  gunzip -c "$BACKUP_FILE" | docker exec -i chayfood-postgres psql -U chayfood -d chayfood_db
else
  cat "$BACKUP_FILE" | docker exec -i chayfood-postgres psql -U chayfood -d chayfood_db
fi

echo "✅ Khôi phục cơ sở dữ liệu thành công!"
