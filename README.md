# Guaq AI - Agency Automation Platform

**Version:** 2.0.0-agency
**Infrastructure:** Docker Compose (Postgres, Dify, N8N, MinIO, Redis)

---

## 🏗️ Architecture & Load Distribution

To scale this to an agency level, we distribute the workload across three pillars: **n8n** (Automation), **Dify** (Cognitive Engine), and a **Dedicated Backend** (Data Access).

### 1. The Automation Layer (n8n)
*   **Role:** The "Switchboard" and "Scheduler".
*   **Responsibility:**
    *   **WhatsApp Ingress/Egress:** Listens to Webhooks from WhatsApp Cloud API.
    *   **Logging:** Inserts raw messages into Postgres `whatsapp_log`.
    *   **Routing:** Decides if a message needs AI (sends to Dify) or Human (alerts Broker).
    *   **CRM Sync:** Pushes qualified leads from Postgres to Salesforce/HubSpot.
*   **Load Capacity:** Handles high throughput for *async* tasks.
*   **Limitation:** Do NOT use n8n to serve API requests for the frontend dashboard (too slow/high latency).

### 2. The Cognitive Layer (Dify + Local Ollama)
*   **Role:** The "Brain".
*   **Responsibility:**
    *   **RAG:** Ingests property PDF brochures from Postgres (pgvector) to answer queries.
    *   **Hybrid AI Routing:**
        *   **Llama 3.2 (Local Ollama):** Handles 80% of volume. Simple queries ("Price?", "Location?", "Greeting"). Fast & Zero Cost.
        *   **Gemini 1.5/2.5 Pro:** Handles 20% of volume. Complex tasks (Negotiation, Compliance Review, Image Analysis).
    *   **Conversation State:** Manages memory of the chat.

### 3. The Dedicated Backend (Next.js / Node.js / Python)
*   **Role:** The "Dashboard API".
*   **Responsibility:**
    *   **Data Aggregation:** Queries `whatsapp_log` to build the "Leads Pipeline" view (GROUP BY phone, ORDER BY timestamp).
    *   **Auth & Multi-Tenancy:** Validates users against the `clients` table.
    *   **MinIO Proxy:** Generates pre-signed URLs for secure image uploads.
    *   **Analytics:** Computes aggregate stats (Response Time, Conversion Rate) via complex SQL queries on `whatsapp_log`.
*   **Why Needed?:** You cannot securely or efficiently query SQL directly from React. n8n is too slow for real-time dashboard data fetching (filtering/sorting 1000+ rows).

---

## 🚀 Migration Path: From Demo to Production

### Phase 1: The "Mock" (Current)
*   **Frontend:** React SPA.
*   **AI:** Direct Client-Side calls to Gemini API.
*   **Data:** Local State (Mock Data).

### Phase 2: The "Hybrid" (Agency Pilot)
1.  **Deploy Backend API:** Create a lightweight Next.js API that connects to the `postgres` container.
2.  **Connect Auth:** Log in using credentials from `clients` table.
3.  **Switch Chat:** Frontend calls `POST /api/chat` -> Backend -> **Dify API**.
4.  **Switch RAG:** Upload PDFs to MinIO -> Index via Dify Knowledge Base.

### Phase 3: The "Optimization" (Cost Reduction)
1.  **Local LLM:** Configure Dify to use **Ollama** provider running **Llama 3.2** on the host machine.
2.  **Traffic Rules:** Use Dify "Model Switcher" node:
    *   IF intent == "Simple FAQ" -> Use Llama 3.2 (0.1s latency, $0 cost).
    *   IF intent == "Draft Contract" -> Use Gemini Pro.

---

## 🛠️ Developer Implementation Guide

### 1. Database Schema
Use the existing schema in `public` schema of `postgres` database.

**Table: `clients`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `client_id` | INT (PK) | Unique ID for the agency client. |
| `whatsapp_id` | VARCHAR | **Tenant ID**. Used by n8n to identify which client received a message. |
| `dify_api_key` | VARCHAR | API Key for the specific Dify App assigned to this client. |
| `dashboard_config` | JSONB | Stores the UI settings (`AppSettings` interface). |

**Table: `whatsapp_log`**
| Column | Type | Description |
| :--- | :--- | :--- |
| `log_id` | INT (PK) | Auto-increment. |
| `client_id` | INT (FK) | Links to `clients`. |
| `phone` | VARCHAR | The lead's phone number. |
| `direction` | ENUM | 'IN' (User) or 'OUT' (AI/Agent). |
| `message_content`| TEXT | Body of the message. |

### 2. API Endpoints (Required in Backend Service)

| Route | Method | Logic |
| :--- | :--- | :--- |
| `/api/auth/login` | POST | Check credentials against `clients`. Return JWT. |
| `/api/leads` | GET | `SELECT * FROM whatsapp_log` (Aggregated by Phone). |
| `/api/chat` | POST | Proxy to `Dify API` (`/v1/chat-messages`). |
| `/api/inventory` | GET/POST | CRUD on `properties` table + MinIO Uploads. |

### 3. Environment Variables
```env
# Infrastructure
POSTGRES_URL="postgresql://admin:admin@postgres:5432/postgres"
REDIS_URL="redis://redis:6379"
MINIO_ENDPOINT="http://minio:9000"
MINIO_ACCESS_KEY="guaqai"
MINIO_SECRET_KEY="GuaqAI@2025"

# AI
DIFY_API_URL="http://dify-api:5001"
# OLLAMA_URL="http://host.docker.internal:11434" (For future local inference)
```
