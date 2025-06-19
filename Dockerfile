FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV COUCHDB_USER=admin
ENV COUCHDB_PASSWORD=admin

CMD ["node", "server.js"]
