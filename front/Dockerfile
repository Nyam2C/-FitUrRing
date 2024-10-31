# Step 1: Build the React application
FROM node:22.2.0-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the React application with Nginx
FROM nginx:alpine AS run

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/nginx.conf
CMD /docker-entrypoint.d/20-envsubst-on-templates.sh && \
    nginx -g "daemon off;"
EXPOSE 80