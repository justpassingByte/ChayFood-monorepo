#!/usr/bin/env bash
# ==============================================================================
# Script tự động Backup Database PostgreSQL ChayFood
# ==============================================================================

set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="chayfood_backup_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

echo "📦 Đang tiến hành backup PostgreSQL database [chayfood_db]..."

docker exec -t chayfood-postgres pg_dump -U chayfood -d chayfood_db | gzip > "${BACKUP_DIR}/${FILENAME}"

echo "✅ Backup hoàn tất! File lưu tại: ${BACKUP_DIR}/${FILENAME}"
