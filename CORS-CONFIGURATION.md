# Cross-Origin Resource Sharing (CORS) Configuration

This document provides instructions for setting up proper CORS configuration for the Propellant HR backend server to work correctly with the frontend application.

## What is CORS?

Cross-Origin Resource Sharing (CORS) is a security mechanism built into browsers that restricts web applications from making requests to a domain different from the one that served the web application. This is a security feature to prevent malicious websites from making unauthorized requests to other domains on behalf of a user.

## Problem with Current Setup

The current configuration has the frontend incorrectly setting the `Access-Control-Allow-Origin` header in the request, which causes CORS preflight failures. This header should be set by the server in the response, not by the client in the request.

## Server-Side Configuration (For Backend Team)

### NestJS Backend Configuration

1. Update CORS configuration in the `main.ts` file:

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS properly
  app.enableCors({
    origin: [
      "http://localhost:3000", // Development
      "https://propellanthr.com", // Production
      "https://www.propellanthr.com", // Production with www
      // Add any other domains that need access
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true, // Important for sending cookies/auth headers
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Disposition"], // If you need to expose any headers
  });

  // Rest of your bootstrap code...
  await app.listen(3000);
}
bootstrap();
```

### Temporary Workaround Using a CORS Proxy

If immediate access is needed before backend changes can be deployed:

1. Set up a CORS proxy service like [cors-anywhere](https://github.com/Rob--W/cors-anywhere)
2. Update the frontend baseURL to use the proxy:

```typescript
const axiosInstance = axios.create({
  baseURL: "https://your-cors-proxy.com/https://propellanthr.fly.dev/api/v1",
  // ...rest of your config
});
```

## Frontend Changes (Already Implemented)

1. Remove the client-side `Access-Control-Allow-Origin` header:

```typescript
// REMOVED: This was causing issues
// axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
```

2. Keep `withCredentials: true` to ensure cookies and auth headers are sent:

```typescript
axiosInstance.defaults.withCredentials = true;
```

## Testing CORS Configuration

1. Use your browser's developer tools to check for CORS errors
2. Ensure preflight OPTIONS requests are being properly handled by the server
3. Test on different browsers, especially mobile browsers which may have stricter CORS policies

## Additional Security Recommendations

1. Use HTTPS for all communications
2. Set the `secure` flag on cookies when using HTTPS
3. Use the `SameSite` attribute on cookies (already implemented)
4. Implement proper CSP (Content Security Policy) headers

## Contact

If you encounter CORS issues, please contact the development team:

- Backend team lead: [email protected]
- DevOps: [email protected]

Last updated: September 21, 2025
