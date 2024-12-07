# .env 파일 로드
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    cp .env.example .env
    echo -e "\e[31m.env파일이 설정되지 않아 기본 설정 파일을 토대로 새 .env 파일을 생성하였습니다. .env 파일 수정을 권장합니다\e[0m"
    export $(grep -v '^#' .env | xargs)
fi

cd ssl
find . -not -name 'init-letsencrypt.sh' -not -name 'setup_ssl.sh' -not -name '.' -not -name '..' -exec sudo rm -rf {} +
cd ..

echo "SERVER_NAME: $SERVER_NAME"

docker-compose down -v

if [ "$SERVER_NAME" = "localhost" ]; then
    cd ssl
    sudo ./setup_ssl.sh
    cd ..
else
    cd ssl
    sudo ./init-letsencrypt.sh -y
    cd ..
fi

sudo rm -rf db/data

sudo chmod -R 755 ssl
sudo chmod 644 ssl/fullchain.pem
sudo chmod 644 ssl/privkey.pem
docker-compose up -d --build