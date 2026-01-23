FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["sh", "-c", "npx wait-port postgres:5432 && npm run migration:run && npm run start:dev"]