# 🔐 Authentication Guide – BakBak App

This doc explains how authentication works in BakBak using JWTs (access + refresh tokens).

---

## 🧩 Token Structure

- **Access Token**

  - Short-lived (5–15 mins)
  - Sent in `Authorization: Bearer <token>` header
  - Stored in memory (not in localStorage or cookies)

- **Refresh Token**
  - Long-lived (e.g. 7 days)
  - Stored in `HttpOnly + Secure + SameSite=Lax` cookie
  - Used to silently fetch a new access token

---

## 🔁 Flow Summary

### 1. Login

- Frontend sends credentials to `/login`
- Backend returns:
  - `accessToken` in JSON
  - `refreshToken` in an HTTP-only cookie

### 2. Using APIs

- `accessToken` is attached to all protected API calls via headers

### 3. Token Expiry Handling

- On `401 Unauthorized`, frontend automatically:
  - Calls `/refresh` endpoint (cookie is auto-sent)
  - Gets new access token
  - Retries the original request

### 4. Logout

- Frontend calls `/logout`
- Backend clears refresh token cookie + invalidates token

---

## ✅ Best Practices

- Never expose refresh token to JavaScript
- Use HTTP-only cookies for refresh tokens
- Rotate refresh tokens if possible
- Clear tokens on logout or auth failure
- Protect all `/refresh` and `/logout` endpoints with CSRF checks if needed

---

## 🧪 Dev Tips

- Access token can be stored in state (e.g. React context)
- Use Axios/Fetch interceptor to handle 401s and refresh automatically
- On app load: try to silently refresh before showing login

---

## 🚨 Security

- Refresh token must never be accessible via JS
- Set cookie flags: `HttpOnly`, `Secure`, `SameSite=Lax`
- Consider adding IP/device/session-based checks for refresh tokens
