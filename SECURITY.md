# 🔒 Security Policy

We take the security of this project seriously. This document outlines the supported versions, vulnerability reporting process, and baseline security measures implemented across both the frontend and backend applications.

---

## 🛡️ Supported Versions

Only the latest active versions of each service receive security updates:

| Component | Version / Framework | Supported |
| :--- | :--- | :--- |
| **Backend** | Laravel 12.x / PHP 8.3+ | :white_check_mark: |
| **Frontend** | React Router v7 / Node.js 22+ | :white_check_mark: |
| **Older Versions** | < Current main branch | :x: |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability within this repository, **please DO NOT open a public GitHub issue**. Instead, follow responsible disclosure:

1. **Email Notification:**  
   Send details of the vulnerability to the repository maintainer or open a private [GitHub Security Advisory](https://github.com).
2. **Details to Include:**
   - Type of vulnerability (e.g., SQLi, XSS, CSRF, remote code execution).
   - Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
   - Affected component (`be/` backend or `fe/` frontend).
   - Potential impact if exploited.
3. **Response Timeline:**
   - You will receive an initial response acknowledging receipt within **48 hours**.
   - A triage status and timeline for a patch will be shared as soon as verified.

---

## 🔐 Security Best Practices in this Repository

- **Environment Secrets:** Sensitive credentials and API keys are excluded from git version control via `.gitignore`. Never commit `.env` files.
- **CI/CD Isolation:** Automated workflows run tests using ephemeral in-memory SQLite databases and sandboxed runner containers.
- **Input Validation:** All backend endpoints validate payloads using Laravel Form Request / Validator classes.
- **CORS Protection:** Configured via Laravel CORS middleware to restrict unauthorized origins in production.
- **Dependencies:** Dependencies are regularly audited using `npm audit` and `composer audit`.
