FROM node:14-alpine

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps
RUN npm build

# remove dev deps
RUN npm prune --production

FROM node:14-alpine

COPY --from=0 /app/node_modules ./node_modules
COPY --from=0 /app/public ./public
COPY --from=0 /app/utils ./utils
COPY --from=0 /app/server.js .
COPY --from=0 /app/server*.json .

EXPOSE 8090

CMD ["node", "server.js"]

