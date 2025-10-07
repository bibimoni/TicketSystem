
## Description

[Nest](https://github.com/nestjs/nest)
The backend of this project will be using MongoDB for database. NestJS for backend. To handle database easier, i decided to use prisma, which is the tool to handle database easier.

## Requirements

* Node
* Docker (recommended)
* (Your trust on me)

## Project setup

**On the first step, please make sure the .env file is configured**

### With Docker
```bash
$ cp .env.example .env 
$ npx prisma generate
$ docker compose up -d
```
### Without Docker
```bash
$ cp .env.example .env
$ npx prisma generate
$ npm install ci
$ npm run start:dev
```
If you want to sync schema.prisma, run
```bash
$ npm run db:sync
```
If you want to update changes after changing content in the prisma file, use
```bash
$ npx prisma db push
```






