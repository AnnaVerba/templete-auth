FROM node:18-alpine as dist

WORKDIR /usr/src/app

COPY . .

RUN yarn
RUN yarn build auth

RUN ls /usr/src/app/ -la

USER node


FROM node:18-alpine as builder

WORKDIR /usr/src/app


COPY --chown=node:node --from=dist /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=dist /usr/src/app/dist /usr/src/app/dist/
COPY --from=dist /usr/src/app/libs /usr/src/app/libs
COPY --from=dist /usr/src/app/.sequelizerc /usr/src/app/.sequelizerc
COPY --from=dist /usr/src/app/migrations /usr/src/app/migrations
COPY --from=dist /usr/src/app/apps/auth/tsconfig.build.json /usr/src/app/dist/apps/auth/
COPY --from=dist /usr/src/app/apps/auth/tsconfig.json /usr/src/app/dist/apps/auth/
COPY --from=dist /usr/src/app/apps/auth/package.json /usr/src/app/dist/apps/auth/

RUN ls /usr/src/app/node_modules -al

RUN yarn --cwd dist/apps/auth

FROM node:18-alpine as production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/ /usr/src/app/

RUN ls /usr/src/app/node_modules -al

EXPOSE 3002


CMD ["sh", "-c", "npx sequelize-cli db:migrate && node dist/apps/auth/main.js"]
