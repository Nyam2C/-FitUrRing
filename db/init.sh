#!/bin/sh

# 환경 변수 대체
sed -e "s/\${DB_USER}/$DB_USER/g" \
    -e "s/\${DB_PASSWORD}/$DB_PASSWORD/g" \
    -e "s/\${DB_NAME}/$DB_NAME/g" \
    /docker-entrypoint-initdb.d/init.js.template > /docker-entrypoint-initdb.d/init.js

# MongoDB 초기화 스크립트 실행 권한 설정
chmod +x /docker-entrypoint-initdb.d/init.js