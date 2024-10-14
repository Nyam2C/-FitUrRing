FROM node:22.2.0-alpine
WORKDIR /workspace
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
EXPOSE 80