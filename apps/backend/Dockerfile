FROM node:18-alpine
WORKDIR /app
COPY apps/backend/package.json ./
RUN npm install
COPY apps/backend/ .
EXPOSE 3001
CMD ["node", "src/index.js"]
