```markdown
# daden-movie-web Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the `daden-movie-web` JavaScript codebase. You'll learn about file naming, import/export styles, commit message patterns, and how to write and run tests. This guide is designed to help you contribute code that matches the project's established style and workflows.

## Coding Conventions

### File Naming
- **Pattern:** PascalCase  
  Example:  
  ```
  MovieList.js
  MovieDetail.js
  ```

### Import Style
- **Mixed:** Both default and named imports are used.  
  Examples:  
  ```js
  import React from 'react';
  import { fetchMovies } from './MovieService';
  ```

### Export Style
- **Named Exports:**  
  Example:  
  ```js
  // MovieService.js
  export function fetchMovies() { ... }
  export function getMovieById(id) { ... }
  ```

### Commit Message Patterns
- **Type:** Mixed (feature, fix, etc.)
- **Prefixes:** Commonly uses `fix`  
  Example:  
  ```
  fix: correct movie detail rendering
  ```

- **Average Length:** 28 characters

## Workflows

### Code Contribution
**Trigger:** When adding new features or fixing bugs  
**Command:** `/contribute`

1. Create a new branch for your feature or fix.
2. Follow the file naming convention (PascalCase).
3. Use named exports for new modules.
4. Write or update tests as needed (see Testing Patterns).
5. Use a descriptive commit message, prefixed with `fix` if applicable.
6. Submit a pull request for review.

### Importing and Exporting Modules
**Trigger:** When creating or updating modules  
**Command:** `/module-usage`

1. Use PascalCase for file names.
2. Export functions or components using named exports:
   ```js
   export function MyComponent() { ... }
   ```
3. Import using either default or named imports as appropriate:
   ```js
   import { MyComponent } from './MyComponent';
   ```

## Testing Patterns

- **Framework:** Unknown (not specified in codebase)
- **File Pattern:** Test files are named using the `*.test.*` pattern.
  Example:
  ```
  MovieList.test.js
  ```
- **Test Location:** Tests are typically placed alongside the files they test or in a dedicated test directory.
- **Writing Tests:** Follow the `*.test.js` naming and ensure coverage for new or modified functionality.

## Commands
| Command         | Purpose                                         |
|-----------------|-------------------------------------------------|
| /contribute     | Start a new code contribution workflow          |
| /module-usage   | Reference module import/export conventions      |
```