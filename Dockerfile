FROM node:12.13.0-alpine as build

COPY . /build

WORKDIR /build

RUN apk add --no-cache python build-base git \
    && npm ci && npm run build \
    && mkdir /work \
    && mkdir /work/src \
    && mv dist/ /work/ \
    && mv node_modules/ /work/ \
    && cp -r /work/dist/client /work/public/ \
    && mv src/server/ /work/src/server/ \
    && mv .sequelizerc /work/ \
    && mv scripts/ /work/scripts \
    && mv package.json /work/ \
    && mv package-lock.json /work/

FROM node:12.13.0-alpine

LABEL maintainer="syuchan1005<syuchan.dev@gmail.com>"
LABEL name="training-app"

ENV PORT=80
EXPOSE 80

COPY --from=build /work /work

WORKDIR /work

COPY docker-entrypoint.sh /work

RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["/work/docker-entrypoint.sh"]
