# Project Manager

## Overview

A full-stack project management application built with React, Express, and PostgreSQL. The application allows users to create, manage, and track projects with different statuses (active, completed, on-hold, cancelled). It features user authentication through Replit's OIDC system, project CRUD operations, image uploads, and an admin dashboard for managing users and viewing analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Authentication**: Passport.js with OpenID Connect (Replit Auth)
- **Session Management**: Express sessions stored in PostgreSQL
- **API Design**: RESTful endpoints with proper HTTP status codes
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reloading with Vite middleware integration

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM for type-safe database operations
- **Connection**: Neon serverless PostgreSQL driver
- **Schema**: Shared TypeScript schema definitions between client and server
- **Migrations**: Drizzle Kit for database migrations

### Project Structure
- **Monorepo**: Single repository with client, server, and shared code
- **Client**: React application in `/client` directory
- **Server**: Express API in `/server` directory  
- **Shared**: Common types and schemas in `/shared` directory
- **Database**: Schema definitions and migrations

### Key Features
- **Project Management**: Full CRUD operations for projects with status tracking
- **User Authentication**: Secure OIDC authentication with session persistence
- **Admin Dashboard**: User management and analytics for admin users
- **Image Support**: Project image uploads and display
- **Search & Filtering**: Real-time project search and status filtering
- **Responsive Design**: Mobile-friendly interface with proper accessibility

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit Auth**: OIDC authentication provider

### Frontend Libraries
- **UI Components**: Radix UI primitives for accessible components
- **Icons**: Font Awesome for consistent iconography
- **Form Validation**: Zod for runtime type validation
- **Date Handling**: date-fns for date formatting and manipulation

### Backend Libraries
- **Database**: Drizzle ORM with Neon serverless driver
- **Authentication**: Passport.js with OpenID Client
- **Session Storage**: connect-pg-simple for PostgreSQL session store
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **Type Checking**: TypeScript with strict mode enabled
- **Linting**: ESLint configuration for code quality
- **Package Management**: npm with lockfile for dependency management