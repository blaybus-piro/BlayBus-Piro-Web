# 가져올 이미지를 정의
FROM node:20

# 경로 설정하기
WORKDIR /app

# package.json과 package-lock.json을 워킹 디렉토리에 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# Vite 애플리케이션 빌드
RUN npm run build

# 3000번 포트 노출 (Vite의 경우 기본적으로 5173이지만, 빌드 후 정적 파일은 80 포트에서 제공)
EXPOSE 5173

# npm start 스크립트 실행
CMD ["npm", "run", "dev"]