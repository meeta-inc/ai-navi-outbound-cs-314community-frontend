#!/bin/bash

# SSL 인증서 생성 스크립트
mkdir -p .cert

# 자체 서명 인증서 생성
openssl req -x509 -newkey rsa:4096 -keyout .cert/key.pem -out .cert/cert.pem -days 365 -nodes -subj "/CN=localhost"

echo "SSL 인증서가 생성되었습니다."
echo "vite.config.ts에서 HTTPS 설정을 활성화하세요."