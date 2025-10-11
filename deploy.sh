#!/bin/bash
# NHN Cloud Ubuntu 서버 배포 스크립트

set -e  # 에러 발생 시 스크립트 중단

echo "🚀 Contest 프론트엔드 배포 시작..."

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
    echo "❌ package.json을 찾을 수 없습니다. 프로젝트 루트 디렉토리에서 실행해주세요."
    exit 1
fi

# Node.js 버전 확인
echo "📋 Node.js 버전 확인..."
node --version
npm --version

# 의존성 설치
echo "📦 의존성 설치 중..."
npm i

# 린트 검사 (경고만 표시, 오류 무시)
echo "🔍 코드 품질 검사 중..."
npm run lint || echo "⚠️  린트 경고가 있지만 배포를 계속합니다."

# 프로덕션 빌드
echo "🏗️  프로덕션 빌드 실행 중..."
npm run build

# 빌드 결과 확인
if [ -d "dist" ]; then
    echo "✅ 빌드 성공!"
    echo "📁 빌드 결과:"
    ls -la dist/
    
    # 빌드 파일 크기 확인
    echo "📊 빌드 파일 크기:"
    du -sh dist/*
    
    # 총 빌드 크기
    echo "📈 총 빌드 크기: $(du -sh dist | cut -f1)"
else
    echo "❌ 빌드 실패!"
    exit 1
fi

# Nginx 설정 파일 생성
echo "🔧 Nginx 설정 파일 생성 중..."
cat > contest.gbeai.net.conf << 'EOF'
# HTTPS 서버 블록
server {
    listen 443 ssl;
    server_name contest.gbeai.net;
    root /var/www/contest.gbeai.net;
    index index.html;
    
    # SSL 인증서 경로 (Certbot이 관리)
    ssl_certificate /etc/letsencrypt/live/contest.gbeai.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/contest.gbeai.net/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # SPA 라우팅을 위한 설정
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 정적 파일 캐싱
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1M;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 압축
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}

# HTTP → HTTPS 리다이렉트 서버 블록
server {
    listen 80;
    server_name contest.gbeai.net;
    
    location / {
        return 301 https://$host$request_uri;
    }
}
EOF

echo "✅ Nginx 설정 파일 생성 완료: contest.gbeai.net.conf"

# 배포 디렉토리 생성 및 파일 복사
echo "📁 배포 디렉토리 설정 중..."
if [ -d "/var/www/contest.gbeai.net" ]; then
    echo "🗑️  기존 배포 파일 백업 중..."
    sudo mv /var/www/contest.gbeai.net /var/www/contest.gbeai.net.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
fi

echo "📂 새 배포 디렉토리 생성 중..."
sudo mkdir -p /var/www/contest.gbeai.net

echo "📋 빌드 파일 복사 중..."
sudo cp -r dist/* /var/www/contest.gbeai.net/

echo "🔐 파일 권한 설정 중..."
sudo chown -R www-data:www-data /var/www/contest.gbeai.net
sudo chmod -R 755 /var/www/contest.gbeai.net

# Nginx 설정 파일 적용
echo "🔧 Nginx 설정 파일 적용 중..."
sudo cp contest.gbeai.net.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/contest.gbeai.net.conf /etc/nginx/sites-enabled/

# Nginx 설정 문법 검사
echo "🔍 Nginx 설정 문법 검사 중..."
if sudo nginx -t; then
    echo "✅ Nginx 설정 문법 검사 통과"
else
    echo "❌ Nginx 설정에 오류가 있습니다. 수동으로 확인해주세요."
    exit 1
fi

# SSL 인증서 확인 및 설정
echo "🔐 SSL 인증서 확인 중..."
if [ -f "/etc/letsencrypt/live/contest.gbeai.net/fullchain.pem" ]; then
    echo "✅ SSL 인증서가 이미 존재합니다."
else
    echo "📜 SSL 인증서가 없습니다. Let's Encrypt로 생성을 시도합니다..."
    
    # Certbot 설치 확인
    if ! command -v certbot &> /dev/null; then
        echo "📥 Certbot 설치 중..."
        sudo apt update
        sudo apt install -y certbot python3-certbot-nginx
    fi
    
    # 방화벽 설정 확인
    echo "🔥 방화벽 설정 확인 중..."
    sudo ufw allow 80 2>/dev/null || true
    sudo ufw allow 443 2>/dev/null || true
    
    # SSL 인증서 생성 시도
    echo "🔐 SSL 인증서 생성 중..."
    if sudo certbot --nginx -d contest.gbeai.net --non-interactive --agree-tos --email gbeai@sc.gyo6.net; then
        echo "✅ SSL 인증서 생성 성공!"
    else
        echo "⚠️  SSL 인증서 자동 생성에 실패했습니다."
        echo "   수동으로 다음 명령어를 실행해주세요:"
        echo "   sudo certbot --nginx -d contest.gbeai.net"
    fi
fi

# Nginx 재시작
echo "🔄 Nginx 서비스 재시작 중..."
if sudo systemctl restart nginx; then
    echo "✅ Nginx 재시작 성공"
else
    echo "❌ Nginx 재시작 실패. 수동으로 확인해주세요."
    exit 1
fi

echo ""
echo "🎉 배포 완료!"
echo ""
echo "📋 설정 완료 사항:"
echo "✅ 프론트엔드 빌드 및 배포"
echo "✅ Nginx 설정 적용"
echo "✅ SSL 인증서 설정"
echo "✅ HTTP → HTTPS 리다이렉트 설정"
echo "✅ SPA 라우팅 설정"
echo ""
echo "🌐 접속 가능한 주소:"
echo "   https://contest.gbeai.net"
echo ""
echo "💡 참고사항:"
echo "   - SSL 인증서는 90일마다 자동 갱신됩니다"
echo "   - 정적 파일은 1개월간 캐싱됩니다"
echo "   - Gzip 압축이 활성화되어 있습니다"
echo ""
