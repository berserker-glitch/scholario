# Scholario Technical Context

## Technology Stack

### Frontend
- **React**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Chakra UI**: Component library for consistent design
- **React Query**: Data fetching and state management
- **React Table**: Table management and interaction
- **React Virtual**: Virtualization for performance with large lists

### Backend
- **Electron**: Desktop application framework
- **Node.js**: JavaScript runtime
- **SQLite**: Embedded database
- **better-sqlite3**: SQLite library for Node.js
- **Drizzle ORM**: SQL query builder and ORM
- **Effect TS**: Functional programming library for error handling

### Build Tools
- **Vite**: Fast bundler and development server
- **Electron Builder**: Electron app packaging
- **TypeScript**: Type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting

### Testing
- **Vitest**: Test runner
- **Cypress**: End-to-end testing

### Exports & Reports
- **XLSX**: Excel file generation
- **CSV**: CSV file generation

## Development Environment

### Prerequisites
- Node.js
- npm/yarn
- Git

### Setup
1. Clone repository
2. Install dependencies with `npm install`
3. Run development server with `npm run dev`

### Build Process
1. Compile TypeScript with `tsc`
2. Bundle application with Vite
3. Package with Electron Builder

### Project Structure
```
scholario/
├── app/               # React frontend
│   ├── components/    # UI components
│   │   ├── common/    # Shared components
│   │   └── students/  # Student-specific components
├── db/                # Database schema and migrations
├── dist-electron/     # Compiled Electron files
├── logs/              # Application logs
├── main/              # Electron main process
│   └── services/      # Main process services
├── public/            # Static assets
├── services/          # Renderer process services
│   └── repositories/  # Data access layer
└── src/               # Core application code
    ├── assets/        # Application assets
    ├── hooks/         # React hooks
    └── types/         # TypeScript type definitions
```

## Key Technical Implementations

### Native Module Loading
The application uses a dynamic native module loading system to handle differences between development and production environments:
```javascript
export function loadNativeModule(moduleName) {
  try {
    // Try standard require first
    return require(moduleName);
  } catch (err) {
    console.log(`Failed to load ${moduleName} with standard require, trying alternative paths`);
    
    try {
      // Try from node_modules
      const path = require('path');
      const modulePath = path.join(process.cwd(), 'node_modules', moduleName);
      return require(modulePath);
    } catch (err2) {
      console.error(`Failed to load ${moduleName} from node_modules:`, err2.message);
      
      // Additional fallback mechanisms can be implemented here
      return null;
    }
  }
}
```

### Preload Script Configuration
The application uses a preload script to expose the IPC API to the renderer process:
```javascript
// CommonJS preload script (preload.js)
const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC API to the renderer process
contextBridge.exposeInMainWorld('api', {
  student: {
    createStudent: (data) => ipcRenderer.invoke('student:createStudent', data),
    listStudents: (filter) => ipcRenderer.invoke('student:listStudents', filter),
    // ... other student methods
  },
  // ... other APIs
});
```

### Database Connection Strategy
The application implements multiple strategies for database connection:
1. Primary connection path using local SQLite file
2. Fallback to in-memory SQLite if file-based DB fails
3. Mock data system when database is inaccessible

### Error Handling
The application uses a combination of:
- Effect.ts for functional error handling
- Try/catch blocks for async operations
- Error boundaries for component rendering errors
- Toast notifications for user feedback
- Fallback UI for error states

## Development Workflows

### Adding a New Feature
1. Create new component(s) in appropriate directory
2. Update types if needed
3. Add new service methods if required
4. Implement UI components
5. Test the feature
6. Update documentation

### Database Schema Changes
1. Update schema definition in `db/schema.ts`
2. Update corresponding TypeScript types
3. Update affected repositories
4. Update UI to accommodate schema changes
5. Test changes thoroughly

### Debugging
1. Use Electron DevTools for frontend debugging
2. Check logs in `logs/` directory
3. Use `console.log` for quick checks
4. Error messages in UI for user-facing issues

## Performance Considerations

1. **Virtualization**: Used for large lists to maintain performance
2. **Pagination**: Implemented for large data sets
3. **Optimistic Updates**: Used for better user experience
4. **Indexing**: Database tables properly indexed for query performance
5. **Lazy Loading**: Components and routes loaded as needed
6. **Mock Data**: Fallback system for when database is unavailable

## Security Considerations

1. **Authentication**: Simple access code system
2. **Data Storage**: Local SQLite database
3. **Backup**: Support for database backups
4. **Audit Logging**: Track important operations

## Deployment

### Windows
- Packaged as Windows executable (.exe)
- Installed locally on educational center computers
- No internet connectivity required

### Updates
- Manual update process via new installer
- Data migration handled by the application 

## Technical Conventions

- **Code Structure**: Following a modular architecture with clear separation of concerns
- **Component Pattern**: Using functional components with React hooks
- **State Management**: Using React Query for server state and React context for UI state
- **Effect Handling**: Using Effect.ts for handling side effects and error management
- **Database Schema**: Using Drizzle ORM with SQLite
  - Database column names use `snake_case` in both schema definitions and SQL statements
  - JavaScript/TypeScript properties use `camelCase`
  - Drizzle ORM handles the mapping between these conventions
- **Testing**: Using Jest for unit tests and Testing Library for component tests
- **Styling**: Using Chakra UI for component styling with theme customization
- **Build Process**: Using Vite for development and Electron Builder for production 