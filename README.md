# Scholario

Scholario is an offline-first desktop application for educational center administration. It provides comprehensive tools for managing students, subjects, groups, subscriptions, and payments.

## Features

- **Student Management**: Track student information, status, and enrollment history
- **Subject & Group Management**: Organize educational offerings and class groups
- **Subscription Tracking**: Monitor student subscriptions by month
- **Payment Processing**: Record and track student payments
- **Offline-First**: Works entirely offline with local data storage
- **Backup & Restore**: Automated and manual database backup functionality
- **Data Export**: Export data to CSV/XLSX formats
- **PDF Generation**: Create attendance sheets and reports as PDFs

## Tech Stack

- **Frontend**: React, TypeScript, Chakra UI (with dark/light mode)
- **Platform**: Electron (Windows-only)
- **State Management**: Effect-TS for functional I/O operations
- **Database**: SQLite 3 via better-sqlite3, with Drizzle ORM
- **Logging**: Pino for structured logging
- **Testing**: Vitest for unit tests, Cypress for E2E tests

## Development

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/scholario.git
   cd scholario
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Project Structure

- `/app`: React front-end components
- `/main`: Electron main process code
- `/db`: Database schema and operations
- `/services`: Effect-TS services and repositories
- `/logs`: Application logs

### Building for Production

Build the Windows installer:

```
npm run build
```

This will generate a Windows installer in the `/release` directory.

## Database

The application uses SQLite with Drizzle ORM for data management. The database includes these main entities:

- Students
- Subjects
- Groups
- Enrollments (junction between Students and Groups)
- Subscriptions
- Payments
- Settings
- Backups

## License

MIT
