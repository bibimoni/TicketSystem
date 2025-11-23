FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci 
COPY . .

# -------------------------
# DEV STAGE
# -------------------------
FROM base AS dev
ENV NODE_ENV=development
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# -------------------------
# BUILD STAGE
# -------------------------
FROM base AS build
ENV NODE_ENV=production

RUN npx prisma generate
RUN npm run build

RUN mkdir -p dist/mail/templates \
  && cp -R src/mail/templates/* dist/mail/templates/

# -------------------------
# PROD STAGE
# -------------------------
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/generated ./generated

EXPOSE 3000
CMD ["node","dist/main"]
