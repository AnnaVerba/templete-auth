FROM node:18-alpine as dist

WORKDIR /usr/src/app

COPY . .

RUN yarn
RUN yarn build api-gateway

RUN ls /usr/src/app/ -la

USER node


FROM node:18-alpine as builder

WORKDIR /usr/src/app


COPY --chown=node:node --from=dist /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=dist /usr/src/app/dist /usr/src/app/dist/
COPY --from=dist /usr/src/app/libs /usr/src/app/libs
COPY --from=dist /usr/src/app/.sequelizerc /usr/src/app/.sequelizerc
COPY --from=dist /usr/src/app/migrations /usr/src/app/migrations
COPY --from=dist /usr/src/app/apps/api-gateway/tsconfig.build.json /usr/src/app/dist/apps/api-gateway/
COPY --from=dist /usr/src/app/apps/api-gateway/tsconfig.json /usr/src/app/dist/apps/api-gateway/
COPY --from=dist /usr/src/app/apps/api-gateway/package.json /usr/src/app/dist/apps/api-gateway/

RUN yarn --cwd dist/apps/api-gateway

FROM node:18-alpine as production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/ /usr/src/app/

EXPOSE 8000

CMD ["node", "dist/apps/api-gateway/main.js"]
