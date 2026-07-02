# API Authentication

## Overview
The **API Authentication** document defines how the Next.js frontend securely identifies itself to the **Zoho Catalyst** backend. Given the sensitivity of police intelligence, the API utilizes a strict, stateless, token-based authentication mechanism.

---

## 1. Authentication Provider: Zoho Catalyst Auth

We do not build custom authentication tables or password hashing algorithms. We exclusively use **Catalyst Authentication**. 
This provides out-of-the-box support for:
- Secure User Registration
- Password Resets
- Multi-Factor Authentication (MFA)
- Session Management

## 2. The JWT Flow

### 2.1. Login
1. User enters credentials on the Next.js `/login` page.
2. Frontend calls the Catalyst Auth endpoint.
3. If successful, Catalyst returns a **JSON Web Token (JWT)**.
4. The frontend stores this JWT securely in an `HttpOnly` cookie (preferred for web) or local storage (if wrapping in a mobile app).

### 2.2. API Requests
For every subsequent API request (e.g., asking CrimeGPT a question), the frontend must attach the JWT to the `Authorization` header.

```http
GET /server/crimegpt-chat-service/history HTTP/1.1
Host: crimegpt-project.catalystserverless.in
Authorization: Bearer <CATALYST_JWT_TOKEN>
```

## 3. Backend Verification (Catalyst Functions)

Every **Catalyst Function** that exposes a protected route must implement a middleware check before executing any business logic.

```javascript
// Express Middleware Example for Catalyst Function
const verifyCatalystToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing Token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Utilize Catalyst SDK to verify the token signature and expiration
    const catalystApp = catalyst.initialize(req);
    const userDetails = await catalystApp.userManagement().getCurrentProjectUser(token);
    
    // Inject user details into the request object for downstream RBAC checks
    req.user = userDetails; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or Expired Token' });
  }
};
```

## 4. Security Enhancements

- **Short-Lived Tokens:** JWTs should expire after a short duration (e.g., 1 hour).
- **Refresh Tokens:** Implement a silent refresh mechanism on the frontend to seamlessly request a new JWT before the current one expires, ensuring officers are not logged out mid-investigation.
- **Strict CORS:** The Catalyst API Gateway must be configured to accept requests *only* from the exact domain where the Next.js frontend is hosted (e.g., `https://crimegpt.ksp.gov.in`).
