# Journal App Server

Backend server for the Journal Mobile Application.

## Overview

This server provides REST API endpoints for the Journal mobile app, including user authentication, journal entry management, and search functionality.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   ```
   NODE_ENV=production
   PORT=3000
   DB_DIALECT=postgres
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

3. Start the server:
   ```
   npm start
   ```

## API Endpoints

- Auth: `/api/users/login`, `/api/users/register`
- Journal: `/api/journal`

For complete API documentation, visit `/api-docs` when the server is running. 