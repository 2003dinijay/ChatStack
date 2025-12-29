FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

# RUN npm run build
RUN npm run build && ls -R dist

EXPOSE 3333

# CMD ["npm", "run", "start:prod"]
CMD npx prisma db push && node dist/src/main.js