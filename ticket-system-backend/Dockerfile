FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci 
COPY . .

FROM base AS dev
ENV NODE_ENV=development
# RUN npm install -g @nestjs/cli
EXPOSE 3000
# CMD ["npx","nest","start","--watch"]
CMD ["npm", "run", "start:dev"]

FROM base AS build
ENV NODE_ENV=production

RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS prod

WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/generated ./generated 

EXPOSE 3000
CMD ["node","dist/main"]

