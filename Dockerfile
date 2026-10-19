#* Multi-stage build 4 aşamadan oluşur:

#? 1. deps: build için gereken tüm bağımlıklar (dev dahil)
#? 2. build: Prisma Client üretimi + TypeScript kodu build alınması (dist/)
#? 3. prod-deps: Sadece production bağımlılıklarının alınması
#? 4. runner: Uygulamanın çalıştığı final Image

ARG NODE_VERSION=24-alpine

#? 1) deps

FROM node:${NODE_VERSION} AS deps

WORKDIR /app

#* Önce sadece paket dosyaları kopyalanır; bağımlılıklar değişmedikçe bu katman cache'ten gelir

COPY package.json package-lock.json ./ 

RUN npm ci

#? 2) build

FROM node:${NODE_VERSION} AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

#* prisma.config.ts için geçici değer; generate veritabanına bağlanmaz

ENV DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder"

RUN npx prisma generate

RUN npm run build

#? 3) prod-deps

FROM node:${NODE_VERSION} AS prod-deps

WORKDIR /app

COPY package.json package-lock.json ./

#* --ignore-scripts: "prepare: husky" çalışmasın (husky dev bağımlılığı, burada kurulu değil)
#* --omit=optional: @prisma/client'ın peer'i olan prisma CLI + typescript prod'a girmesin (~250MB)

RUN npm ci --omit=dev --omit=optional --ignore-scripts && npm cache clean --force

#? 4) runner

FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules

COPY --from=build --chown=node:node /app/dist ./dist

COPY --chown=node:node package.json ./

#* Güvenlik için root olmayan kullanıcıyla çalıştır

USER node

EXPOSE 4200

CMD [ "node", "dist/src/main.js" ]
