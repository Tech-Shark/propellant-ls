# Frontend Security Best Practices

This document outlines important security practices for the Propellant frontend application. Please follow these guidelines when developing and maintaining the codebase.

## Cross-Site Scripting (XSS) Prevention

### HTML Sanitization

- Always use the `sanitizeHTML()` function from `SafetyUtils.ts` when displaying dynamic HTML content
- Never use `dangerouslySetInnerHTML` without sanitization
- Example:

  ```tsx
  import { sanitizeHTML } from "@/utils/SafetyUtils";

  // Safe usage:
  <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(htmlContent) }} />;
  ```

### Content Security Policy (CSP)

- Avoid inline scripts and styles
- Use nonce-based or hash-based CSP for unavoidable inline scripts
- Consider implementing Trusted Types to prevent DOM-based XSS

## CORS and API Communication

- Never set CORS headers from the client-side (this is the server's responsibility)
- Use `axiosInstance` for all API requests to ensure consistent handling
- See `CORS-CONFIGURATION.md` for proper backend CORS setup

## Authentication & Authorization

- Store authentication tokens securely (using HttpOnly cookies when possible)
- Implement proper token validation and expiration
- Follow the principle of least privilege for user roles and permissions
- Clear sensitive data on logout

## Form Security

- Always validate and sanitize user inputs on both client and server
- Use appropriate input types for form fields
- Implement CSRF protection for forms that modify data

## Error Handling

- Use the `ErrorBoundary` component for catching and gracefully handling errors
- Use `showFriendlyError()` from `SafetyUtils.ts` to display user-friendly error messages
- Never expose sensitive information in error messages to users
- Log errors appropriately without including sensitive data

## Mobile Considerations

- Test security features on mobile browsers
- Use the `isMobileDevice()` utility to provide specific guidance for mobile users
- Be aware of different security models in various mobile browsers

## Sensitive Data Handling

- Never log sensitive data (passwords, tokens, etc.)
- Use the `safeLog()` function from `SafetyUtils.ts` when logging potentially sensitive information
- Clear sensitive data from memory when no longer needed

## Dependencies & Updates

- Keep all dependencies updated to address security vulnerabilities
- Regularly audit dependencies with `npm audit` or similar tools
- Only use trusted dependencies from official sources

## Testing

- Include security-focused test cases
- Test for XSS vulnerabilities, especially in components that render dynamic content
- Test authentication flows thoroughly
- Implement automated security testing as part of CI/CD pipeline

## Incident Response

If you discover a security vulnerability:

1. Document the issue without exposing exploit details
2. Contact the security team immediately at security@propellanthr.com
3. Do not discuss the vulnerability on public channels or issue trackers
4. Follow the security incident response protocol

Remember that security is everyone's responsibility. If you're unsure about a security practice, ask for guidance rather than implementing a potentially insecure solution.

Last updated: November 2023
