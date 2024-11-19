#!/bin/sh

# mkcert 설치 확인 및 설치
install_mkcert() {
  if ! command -v mkcert >/dev/null 2>&1; then
    echo "mkcert가 설치되어 있지 않습니다. 설치를 시작합니다."

    case "$(uname)" in
      Linux*)
        echo "리눅스 환경에서 mkcert 설치 중..."
        apt update
        apt install -y libnss3-tools
        curl -L https://dl.filippo.io/mkcert/latest?for=linux/amd64 -o mkcert
        chmod +x mkcert
        mv mkcert /usr/local/bin/
        ;;
      Darwin*)
        echo "맥OS 환경에서 mkcert 설치 중..."
        brew install mkcert
        brew install nss # Firefox를 사용하는 경우 필요
        ;;
      *)
        echo "지원하지 않는 운영 체제입니다."
        exit 1
        ;;
    esac
  else
    echo "mkcert가 이미 설치되어 있습니다."
  fi
}

# 로컬 CA 설치
install_local_ca() {
  echo "로컬 CA 설치 중..."
  mkcert -install
}

# SSL 인증서 발급 및 이동
generate_and_move_ssl_certificates() {
  local domains="localhost fiturring.kro.kr" # 필요한 도메인 추가

  echo "SSL 인증서 발급 중... 도메인: $domains"
  mkcert $domains

  # 인증서 파일 이름 변경 및 이동
  mv "localhost+1.pem" "fullchain.pem"
  mv "localhost+1-key.pem" "privkey.pem"

  echo "인증서 파일이 ${ssl_dir}에 fullchain.pem 및 privkey.pem으로 저장되었습니다."
}

# 스크립트 실행
install_mkcert
install_local_ca
generate_and_move_ssl_certificates

echo "SSL 인증서 발급 및 이동이 완료되었습니다."