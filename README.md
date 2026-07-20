# FORGE-PATH

**AI-Powered Financial Operations & Solvency Management Platform for Manufacturing SMEs**

[![CI/CD Pipeline](https://github.com/apex-finance/forge-path/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/apex-finance/forge-path/actions)
[![Next.js](https://img.shields.io/badge/Next.js-v16.2-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.139-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![NVIDIA NIM](https://img.shields.io/badge/NVIDIA_NIM-Gemma_4-76B900?logo=nvidia)](https://build.nvidia.com)
[![NeonDB](https://img.shields.io/badge/NeonDB-Serverless_PostgreSQL-00E599?logo=postgresql)](https://neon.tech)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🚀 System Architecture

```
                                  +---------------------------------------+
                                  |         FORGE-PATH Web Client         |
                                  |   (Next.js 16 + React 19 + Tailwind)  |
                                  +-------------------+-------------------+
                                                      |
                                                      | HTTPS / REST
                                                      v
                                  +-------------------+-------------------+
                                  |      FastAPI Backend Gateway (v1)     |
                                  |    (Uvicorn + Pydantic + Security)    |
                                  +---------+-----------------+-----------+
                                            |                 |
                   +------------------------+                 +------------------------+
                   |                                                                   |
                   v                                                                   v
+------------------+-------------------+                             +-----------------+-----------------+
|      Neon Serverless PostgreSQL      |                             |        NVIDIA NIM AI Service       |
|    (Transactions, Audits, AR/AP)     |                             |  (Gemma 4 Virtual CFO Copilot)  |
+--------------------------------------+                             +-----------------------------------+
```

---

## ⚡ Core Platform Capabilities

1. **Financial Intake & Document Intelligence (`/documents`)**:
   - Drag-and-drop ingestion of scanned PDF invoices, XLSX maintenance bills, and CSV bank statements into NeonDB transaction tables.
   - Intelligent OCR layout parser with confidence threshold validation & quarantine queue.

2. **Executive Financial Operations Dashboard (`/dashboard`)**:
   - Split-screen desk featuring 8 core telemetry KPIs (*Cash Available, Outstanding Receivables, Outstanding Payables, Liquidity Score, Cash Burn Rate, Monthly Revenue, Monthly Expenses, Forecast Accuracy*).

3. **Cash Flow Forecasting & Intelligence (`/forecast`)**:
   - Timeseries cash projection model with target horizon selector tabs (**7d**, **30d**, **90d**, **365d**) and interactive stress scenario sandbox.

4. **Liquidity Command Center (`/liquidity`)**:
   - Solvency buffer telemetry, acid-test quick ratio monitoring, and cash gap risk prediction warnings.

5. **Collections Operations Center (`/collections`)**:
   - AR aging buckets (0-30d, 31-60d, 61-90d, 90d+ overdue), multi-stage escalation workflow (L1 Email → L2 Demand SMS → L3 Phone Call → L4 Legal Notice), and Brevo/Twilio dispatch controls.

6. **Treasury Operations Center (`/treasury`)**:
   - Vendor payout queue with early payment discount capture (*2/10 net 30*), multi-bank account sweep controls, and dual-signature wire release approvals.

7. **AI Financial Copilot (`/copilot`)**:
   - Conversational Virtual CFO powered by Gemma 4 & NVIDIA NIM with real-time financial context telemetry and document context attachments.

8. **Admin Console & System Monitoring (`/admin`)**:
   - Real-time API access logs, worker queue health, service probes, and security audit trail.

---

## 🛠️ Tech Stack

- **Frontend Core**: Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons, Sonner.
- **Backend Core**: FastAPI 0.139, Python 3.11, Uvicorn, Pydantic v2, SQLAlchemy 2.0.
- **Databases & Cache**: Neon Serverless PostgreSQL, ClickHouse Telemetry, Redis 7.
- **AI & ML**: NVIDIA NIM Inference Microservices, Google Gemma 2B/4 model.
- **Outreach & Communications**: Brevo Email API, Twilio SMS API.
- **DevOps & Containerization**: Docker Multi-stage builds, Docker Compose, GitHub Actions.

---

## 💻 Quickstart Setup Guide

### 1. Local Development (Node.js & Python)

```bash
# Clone Repository
git clone https://github.com/apex-finance/forge-path.git
cd SME-FINANCE-SOLUTION

# 1. Install & Run Next.js Frontend
cd forge-path-ui
npm install
npm run dev
# App will run at http://localhost:3000

# 2. Run FastAPI Backend (Separate Terminal)
cd ../python_pipeline/backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt fastapi uvicorn pydantic pydantic-settings sqlalchemy
uvicorn app.main:app --reload --port 8000
# API Docs will be available at http://localhost:8000/docs
```

### 2. Run Complete Stack via Docker Compose

```bash
docker-compose --env-file .env.docker up --build
```

---

## 🔑 Demo Account & Sample Financial Data

### Demo Users
- **CFO Executive**: `Alexander Miller` (`finance@apex.com` / `password123`)
- **Company**: `Apex Manufacturing Inc.` (`company_id`: `apex-manufacturing-uuid`)

### Sample Financial Telemetry
- **Available Liquid Cash**: `$342,000` (68 Days Runway)
- **Outstanding AR Balance**: `$284,500` (12 Active Customer Invoices)
- **Outstanding AP Balance**: `$118,400` (8 Supplier Bills Queued)
- **Liquidity Score**: `84/100 (Optimal)`
- **Daily Operating Burn Rate**: `$5,000/day`
- **Quick Ratio (Acid-Test)**: `1.8x`
- **High-Risk Overdue Account**: `Apex Steel Works ($47,500 overdue 45 days)`

---

## 🌐 API Reference

### Health & Monitoring
- `GET /health`: Root system health check.
- `GET /api/v1/health`: Detailed component telemetry (NeonDB, ClickHouse, NVIDIA NIM, Brevo, Twilio).

### Operations Endpoints
- `GET /api/v1/auth/profile`: Authenticated user & company profile.
- `GET /api/v1/documents`: List ingested financial documents.
- `GET /api/v1/cashflow/forecast?horizon=30d`: Predictive cash flow forecast metrics.
- `GET /api/v1/liquidity/metrics`: Solvency ratios & liquidity score.
- `GET /api/v1/collections/invoices`: Accounts receivable delinquency queue.
- `GET /api/v1/treasury/summary`: Bank accounts & payout queue telemetry.
- `POST /api/v1/copilot/chat`: Virtual CFO conversational query endpoint.

---

## 📄 License

Distributed under the MIT License. Copyright © 2026 Apex Manufacturing Inc. / FORGE-PATH.
