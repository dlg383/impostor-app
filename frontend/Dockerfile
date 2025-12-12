FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Cambia la API_URL para que el navegador llame al mismo dominio (sin localhost)
RUN sed -i "s|API_URL: 'http://localhost:3000'|API_URL: ''|g" src/app/environments/environment.ts

RUN npm run build -- --configuration production

FROM nginx:alpine

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]