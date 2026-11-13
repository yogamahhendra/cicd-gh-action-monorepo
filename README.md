# 🚀 Monorepo CI/CD Starter (React Router v7 + Laravel)

A modern full-stack monorepo featuring **React Router v7** (SSR/SPA) on the frontend and **Laravel 12 API** on the backend, fully wired with an automated **GitHub Actions CI/CD pipeline** with smart path-based change detection.

---

## 📁 Repository Structure

```text
cicd-gh-action-monorepo/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Unified Monorepo CI/CD workflow (NetBird & SSH)
├── be/                        # Backend: Laravel 12 API
│   ├── app/
│   │   ├── Http/Controllers/ # TaskController.php (CRUD API)
│   │   └── Models/            # Task.php
│   ├── routes/
│   │   ├── api.php            # /api/tasks resource routes
│   │   └── web.php
│   ├── tests/
│   │   └── Feature/           # Feature tests (Pest & SQLite in-memory)
│   ├── composer.json
│   └── phpunit.xml
├── fe/                        # Frontend: React Router v7
│   ├── app/
│   │   ├── routes/            # Routes (home.tsx with Task Tracker UI)
│   │   └── routes.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
├── README.md
└── SECURITY.md
```

---

## ⚡ Key Highlights & CI/CD Pipeline

The GitHub Actions workflow in [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) implements production-grade monorepo best practices:

- **Path Filtering (`dorny/paths-filter`):**
  - Changes in `be/**` trigger only the **Backend CI** job.
  - Changes in `fe/**` trigger only the **Frontend CI** job.
  - Changes affecting both (or workflow file edits) run both jobs in parallel, saving runner minutes and speeding up PR checks.
- **Backend CI Job (Laravel):**
  - **PHP 8.3** environment setup with SQLite & necessary extensions.
  - Caching for Composer dependencies (`vendor/`).
  - Code style validation with **Laravel Pint** (`vendor/bin/pint --test`).
  - Automated testing via **Pest PHP** using **SQLite in-memory** database (zero external DB service overhead).
- **Frontend CI Job (React Router v7):**
  - **Node.js 22** environment setup.
  - Caching for npm packages (`package-lock.json`).
  - Strict TypeScript typechecking (`npm run typecheck`).
  - Production build verification (`npm run build`).

---

## 🛠️ Getting Started (Local Development)

### Prerequisites
- **PHP** >= 8.3 & **Composer**
- **Node.js** >= 20 & **npm**

---

### 1. Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd be

# Install PHP dependencies
composer install

# Environment configuration
cp .env.example .env
php artisan key:generate

# Run migrations (default uses SQLite database)
php artisan migrate

# Start backend server
php artisan serve
```
Backend will be running at `http://localhost:8000`.

---

### 2. Frontend Setup (React Router v7)

```bash
# Navigate to frontend directory
cd fe

# Install Node dependencies
npm install

# Environment configuration
cp .env.example .env

# Start dev server
npm run dev
```
Frontend will be running at `http://localhost:5173`.

---

## 🧪 Running Tests & Checks Locally

### Backend Tests & Linting
```bash
cd be

# Run Pest test suite
php artisan test

# Check code formatting with Laravel Pint
./vendor/bin/pint --test

# Auto-fix code formatting with Laravel Pint
./vendor/bin/pint
```

### Frontend Typecheck & Build
```bash
cd fe

# Run TypeScript check
npm run typecheck

# Run production build
npm run build
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
