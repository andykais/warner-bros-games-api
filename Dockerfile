FROM node:10-alpine

ENV WORKDIR=/usr/src/app/

RUN mkdir -p $WORKDIR
WORKDIR $WORKDIR

COPY package.json package-lock.json $WORKDIR
RUN npm install
COPY . $WORKDIR

RUN npm run build

CMD ["npm","run","start:prod"]
