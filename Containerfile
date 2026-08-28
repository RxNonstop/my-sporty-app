FROM node:20-bookworm

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

ENV BROWSER=none

CMD ["npm", "run", "web", "--", "--host", "lan"]