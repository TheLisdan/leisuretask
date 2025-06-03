# LeisureTask

A web application for tracking and managing tasks and leisure time.

## Description

LeisureTask is a fullstack application developed using a modern technology stack. It helps users effectively manage their tasks and maintain a balance between work and leisure time.

## Technologies

### Frontend

- React
- TypeScript
- Vite
- Chakra UI
- tRPC (for type-safe API)
- React Query

### Backend

- Node.js
- Express
- TypeScript
- Prisma (ORM)
- PostgreSQL
- tRPC
- Zod (validation)

## Installation and Setup

### Prerequisites

- Node.js (v18+)
- pnpm
- Docker and Docker Compose
- PostgreSQL

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/LeisureTask.git
cd LeisureTask
```

2. Install dependencies:

```bash
pnpm install
```

3. Create configuration files:

   - Copy `.env.example` to `.env` in the root directory
   - Fill in the required environment variables

4. Start the database:

```bash
docker-compose up -d db
```

5. Apply migrations:

```bash
pnpm prisma migrate dev
```

6. Start the application:

```bash
pnpm dev
```

### Docker Environment

To run the entire application in Docker:

```bash
pnpm dcu
```

## Environment Variables

Create the following environment files:

### `.env`

```plaintext
HOST_ENV=local
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/leisuretask
JWT_SECRET=your-jwt-secret
PASSWORD_SALT=your-password-salt
BREVO_API_KEY=your-brevo-api-key
```

## Testing

Run tests:

```bash
pnpm test
```

## Project Structure

```
LeisureTask/
├── backend/          # Server-side code
│   ├── src/
│   └── tests/
├── webapp/           # Client-side code
│   ├── src/
│   └── tests/
└── shared/          # Shared code
```

## Features

- Task Management
- Time Tracking
- Work/Leisure Balance
- Email Notifications
- User Authentication
- File Upload Support
- Responsive Design

## API Documentation

The API is built using tRPC, providing type-safe API endpoints. Key features include:

- Authentication
- Task Management
- Timer Control
- File Upload
- User Management

## Contributing

1. Fork the project
2. Create a feature branch
3. Submit a pull request

## License

MIT

## Author

Lisdan

---

For any questions or issues, please use the Issues section.
