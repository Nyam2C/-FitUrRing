# Step 1: Build the React application
FROM node:20.18.0-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build

# Step 2: Serve the React application with Nginx
FROM nginx:alpine AS run

RUN apk add --no-cache gettext

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx/*.conf.template /etc/nginx/templates/
COPY nginx/locations.conf /etc/nginx/locations.conf
COPY nginx/env.sh /etc/nginx/env.sh

EXPOSE 80 443
