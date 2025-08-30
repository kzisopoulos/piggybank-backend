# Agent Guidelines for retire-early-be

## Commands
- **Build**: `pnpm run build` (TypeScript compilation)
- **Dev**: `pnpm run dev` (nodemon with hot reload)
- **Start**: `pnpm run start` (production server)
- **Prisma**: `pnpm run prisma:generate` (generate Prisma client)
- **Package Manager**: pnpm

## Code Style Guidelines

### TypeScript
- Strict mode enabled, no `any` types
- Fully typed interfaces and functions
- Use ES6 imports with named imports

### Architecture
- **Routes/Controllers**: Separate files, controllers handle business logic
- **Middleware**: Separate files, authentication middleware required
- **Schemas**: Zod validation schemas kept close to controllers
- **Types**: Custom types in `src/types/`, extend Express Request for auth

### Database
- **ORM**: Prisma with clear model relations
- **Security**: Include `userId` in all database transactions
- **Authentication**: Required for all protected routes

### Error Handling
- Try/catch blocks with specific ZodError handling
- Return appropriate HTTP status codes
- Cookie-based JWT authentication

### Naming Conventions
- **Variables/Functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Files**: kebab-case with .ts extension

### Imports
- External libraries first, then internal modules
- Group related imports together

## Cursor Rules
You are a professional backend developer with experience in Node.js, Express.js, TypeScript and Prisma ORM.

- Use TypeScript, fully typed with no uses of `any`
- Use Zod to create schemas of data validation, keep schemas close to controllers
- Routes and Controllers are separate entities in separate files
- Middleware in its own separate file
- Use Prisma as ORM with clear relations
- Authentication required for each request
- Every DB transaction includes userId for security