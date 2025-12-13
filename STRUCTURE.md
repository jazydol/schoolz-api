# Project Structure

This document describes the folder structure of the Schoolz API application.

## Overview

```
src/
├── common/                 # Shared/common code used across modules
│   ├── decorators/         # Custom decorators (Roles, CurrentUser, etc.)
│   ├── filters/           # Exception filters
│   ├── guards/            # Authentication & authorization guards
│   ├── interceptors/      # Response interceptors
│   ├── pipes/             # Validation pipes
│   └── utils/             # Utility functions and helpers
│
├── config/                # Configuration files
│   ├── app.config.ts      # Application configuration
│   └── database.config.ts # Database configuration
│
├── database/              # Database connection and setup
│   └── database.module.ts
│
├── modules/               # Feature modules (domain-driven)
│   ├── users/             # User management module
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── enums/         # User-related enums
│   │   ├── schemas/       # Mongoose schemas
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── auth/              # Authentication module (JWT, etc.)
│   ├── schools/           # School management module
│   ├── classes/           # Class management module
│   ├── students/          # Student management module
│   ├── teachers/          # Teacher management module
│   └── parents/           # Parent management module
│
├── types/                 # TypeScript type definitions
│   └── express.d.ts       # Express type extensions
│
├── app.module.ts          # Root application module
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
└── main.ts                # Application entry point
```

## Module Structure

Each feature module follows this structure:

```
modules/[feature]/
├── dto/                   # Data Transfer Objects for validation
├── enums/                 # Feature-specific enums
├── schemas/               # Mongoose schemas/models
├── [feature].controller.ts
├── [feature].service.ts
└── [feature].module.ts
```

## Common Folder

The `common/` folder contains shared code that can be used across all modules:

- **decorators/**: Custom decorators like `@Roles()`, `@CurrentUser()`
- **guards/**: Authentication and authorization guards
- **filters/**: Exception filters for error handling
- **interceptors/**: Response transformation interceptors
- **pipes/**: Validation and transformation pipes
- **utils/**: Utility functions and helpers

## Configuration

Configuration files in `config/` use NestJS's `registerAs` pattern for type-safe configuration.

## Best Practices

1. **Feature-based modules**: Each domain feature has its own module
2. **Shared code in common/**: Reusable code goes in the common folder
3. **DTOs for validation**: Use DTOs with class-validator for input validation
4. **Schemas for models**: Mongoose schemas define data models
5. **Guards for security**: Use guards for authentication and authorization
6. **Type safety**: Use TypeScript types and interfaces

