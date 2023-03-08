FROM node:18-alpine as dist

WORKDIR /usr/src/app

COPY . .

RUN yarn
RUN yarn build delivery

USER node


FROM node:18-alpine as builder

WORKDIR /usr/src/app


COPY --chown=node:node --from=dist /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=dist /usr/src/app/dist /usr/src/app/dist/
COPY --from=dist /usr/src/app/libs /usr/src/app/libs
COPY --from=dist /usr/src/app/.sequelizerc /usr/src/app/.sequelizerc
COPY --from=dist /usr/src/app/migrations /usr/src/app/migrations
COPY --from=dist /usr/src/app/apps/delivery/tsconfig.build.json /usr/src/app/dist/apps/delivery/
COPY --from=dist /usr/src/app/apps/delivery/tsconfig.json /usr/src/app/dist/apps/delivery/
COPY --from=dist /usr/src/app/apps/delivery/package.json /usr/src/app/dist/apps/delivery/

RUN yarn --cwd dist/apps/delivery

FROM node:18-alpine as production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/ /usr/src/app/

EXPOSE 3001

CMD ["node", "dist/apps/delivery/main.js"]
