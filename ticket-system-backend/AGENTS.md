# Agent Guidelines

This document provides guidelines for AI agents working in this repository.

## Build, Lint, and Test

- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Test:** `npm run test`
- **Run a single test:** `jest src/path/to/your.spec.ts`

## Code Style

- **Formatting:** This project uses Prettier with the following rules:
  - Single quotes are preferred: `'hello'`
  - Trailing commas in objects and arrays: `{ a: 1, }`
- **Imports:** Use ES6 module imports. Organize imports with NestJS conventions in mind (e.g., modules, services, controllers).
- **Types:** This is a TypeScript project. Use static types for all variables, function parameters, and return values.
- **Naming Conventions:**
  - Use PascalCase for classes and interfaces (e.g., `TicketService`, `CreateUserDto`).
  - Use camelCase for variables and functions (e.g., `user`, `getTickets`).
- **Error Handling:** Use NestJS built-in exception filters for handling errors. Throw standard exceptions like `NotFoundException` or `BadRequestException`.
- **Database:** Use Prisma for database interactions. Define your schema in `prisma/schema.prisma` and use `npx prisma generate` after changes.
- **DTOs:** Use Data Transfer Objects (DTOs) for API request and response bodies, with `class-validator` for validation.
