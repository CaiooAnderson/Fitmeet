FROM node:22

WORKDIR /app

COPY package*.json .

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]