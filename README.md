# FORGE-PATH: AI Financial Operating System & CFO Command Center

FORGE-PATH is a next-generation AI Financial Operating System built specifically for Manufacturing SMEs (CNC Machining, Fabrication, Laser Cutting, Welding, Industrial Manufacturing). It combines deterministic financial engines with Gemma 4 (NVIDIA NIM) reasoning to provide real-time cash flow forecasting, liquidity analytics, collections automation, and treasury payment scheduling.

---

## 🛠️ Architecture & Modules Overview

### 📋 Module 0 – Financial Data Intake & Standardization Engine
- **Purpose**: Ingests unstructured documents (Invoices, Receipts, Purchase Orders, Bank Statements, Ledgers) and standardizes them into structured JSON.
- **Pipeline**: Converts formats (PDF/DOCX to Markdown, Excel to CSV), runs Puter.js OCR for images, parses text using Gemma, validates mathematical consistency, checks duplicates, and writes to database tables or routes invalid files to a quarantine drawer.

### 📈 Module 1 – Forecast Intelligence Engine
- **Purpose**: Computes deterministic cash flow projections and detects trajectory trends.
- **Features**: Processes live receivables and committed payables to calculate inflow/outflow metrics, identifies runway anomalies (unexpected overhead increases), and generates confidence boundaries.

### 💧 Module 2 – Liquidity Intelligence Engine
- **Purpose**: Calculates real-time cash runway limits and stress-tests operating capital.
- **Features**: Generates a dynamic Liquidity Score (0–100), computes average daily cash burn rates, and evaluates business resilience under simulated scenarios (e.g., 20% revenue drop, sudden raw material cost hikes).

### 📞 Module 3 – Collection Intelligence Engine
- **Purpose**: Optimizes accounts receivable collection workflows.
- **Features**: Priority-ranks unpaid invoices based on customer payment history, generates personalized follow-up templates via Gemma (customized by channel and tone), dispatches notifications (via Twilio SMS/WhatsApp and Brevo Email), and logs delivery trails.

### 💳 Module 4 – Treasury & Payment Intelligence Engine
- **Purpose**: Maximizes payment efficiency while preserving operating cash reserves.
- **Features**: Implements a multi-criteria optimization engine to prioritize vendor bills, captures early-payment discounts, avoids late penalties, and dynamically defers payouts if cash reserves fall below the minimum safety buffer.

### 🤖 Module 5 – AI Financial Copilot
- **Purpose**: Orchestrates all underlying engines to act as a virtual CFO.
- **Features**: Uses a **Query Router** to map user questions to specific modules, a **Context Builder** to pull structured metric aggregates, and an **AI Gateway** to generate business insights via Gemma 4. Contains a regex-based **Response Validator** to reject and block hallucinated numbers.

---

## 🚀 Getting Started

### 1. Prerequisites & Environment
Ensure you have Node.js 18+ and Python 3.12+ installed. Set up your credentials in the backend `.env` file:
```env
NVIDIA_API_KEY=your_key
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
BREVO_API_KEY=your_key
DATABASE_URL=your_postgres_uri
```

### 2. Running the Backend
Initialize the virtual environment, install requirements, and boot the Flask API server:
```bash
cd python_pipeline/backend
..\venv\Scripts\activate
pip install -r requirements.txt
python -m flask --app app.main run --port 8000 --debug
```

### 3. Running the Frontend
Boot the responsive Next.js development server on port 3000:
```bash
cd forge-path-ui
npm install
npm run dev
```

### 4. Running Tests
- **Frontend Tests**: `npm test`
- **Backend Tests (pytest)**:
```bash
$env:PYTHONPATH="app"
pytest -v
```
Currently passes **73/73 tests** covering all parsing, forecasting, collections, treasury, and copilot modules.
