# Opsional: jalankan site via Docker di VPS
FROM nginx:1.27-alpine
COPY dist/ /usr/share/nginx/html/
COPY deploy/nginx.docker.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
