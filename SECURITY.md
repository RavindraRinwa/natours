# Security Policy for Natours Project

Thank you for helping to improve the security of the Natours project. We take security seriously and appreciate any efforts to responsibly disclose vulnerabilities.

---

## 🛡 Supported Versions

Only the latest version of the Natours project is currently supported and maintained.

| Version | Supported |
|---------|-----------|
| Latest  | ✅        |
| Older   | ❌        |

---

##  Reporting a Vulnerability

If you discover a security vulnerability in the Natours project:

1. **Do not open a public issue.**
2. **Please contact the maintainers directly:**

   - Email: `ravindrarinwa3@gmail.com`
   - GitHub DM (if email is unavailable)

3. Include as much information as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Any potential impact
   - Suggested fix (if any)

We aim to respond within **48 hours** and resolve valid reports as quickly as possible.

---

## Security Best Practices Used in This Project

### Backend (Node.js, Express, MongoDB)
- [x] **Helmet** for secure HTTP headers
- [x] **MongoDB injection protection** via `express-mongo-sanitize`
- [x] **XSS protection** via `xss-clean`
- [x] **Rate limiting** via `express-rate-limit`
- [x] **Environment variable safety** with `.env` files
- [x] **JWT-based auth** using httpOnly cookies
- [x] **Password hashing** using `bcrypt`
- [x] **Global error handling** for safe stack trace exposure

### Frontend (React or Server-rendered)
- [x] **Escape user input** in templates
- [x] **Form input validation**
- [x] **No frontend exposure of secrets**

### Deployment
- [x] **HTTPS enforced**
- [x] **CORS configured strictly**
- [x] **MongoDB IP whitelisting**
- [x] **Access tokens rotated**
- [x] **Production secrets not committed**

---

##  Responsible Disclosure Guidelines

- Be respectful and constructive in your report.
- Do not exploit vulnerabilities (e.g., exfiltrating data or disrupting services).
- Do not publicly disclose the issue before it is resolved.
- We will give you credit in our changelog (if desired).

---

##  Acknowledgments

We appreciate the security community and anyone contributing to keeping Natours safe and reliable.

---

**Last updated:** June 6, 2025  
**Maintainer:** Ravindra Rinwa
