FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci 
COPY . .

FROM base AS dev
ENV NODE_ENV=development
RUN npm install -g @nestjs/cli
EXPOSE 3000
CMD ["npx","nest","start","--watch"]

FROM base AS build
ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist          ./dist
COPY --from=build /app/node_modules  ./node_modules
EXPOSE 3000
CMD ["node","dist/main"]

