# Wayo — AI-Powered Financial Fraud Investigation System

**Wayo** is an enterprise-grade financial fraud detection and investigation system. It combines real-time machine learning (XGBoost/LightGBM) for anomaly scoring with an LLM-powered reasoning engine (RAG) that automatically generates human-readable explanations on why specific transactions were flagged as high-risk.

---

## 🏗️ Architecture Overview

The system follows an event-driven microservices architecture:

1. **Ingestion & In-Flight Scoring**: Transactions stream via **Apache Kafka** into the **ML Scoring Service**, which evaluates risk metrics using XGBoost and historical features from the **Feature Store**.
2. **LLM Investigation Engine**: High-risk flags ($>80\%$ probability) trigger the **LLM Explanation Service**. Using **RAG** over historical user behavior stored in MongoDB, the engine generates actionable explanations (e.g., *"Amount is $7\times$ higher than average"*).
3. **Clients**:
   - **Next.js Web Dashboard**: Used by fraud analysts to review automated investigation reports and action accounts.
   - **React Native Mobile App**: Provides push notifications and quick action verification for end-users and admins.

---

## 📁 Repository Structure

```text
wayo/
├── clients/
│   ├── web/                     # Next.js Dashboard (Fraud Investigator UI)
│   └── mobile/                  # React Native / Expo App
├── api-gateway/                 # Nginx API Gateway & Reverse Proxy
├── identity-provider/           # Keycloak Configurations
├── service-registry/            # HashiCorp Consul
├── service-coordination/        # Apache ZooKeeper
├── message-broker/              # Apache Kafka Pipeline
├── databases/
│   ├── database-a/              # PostgreSQL (Transactions & Profiles)
│   └── database-b/              # MongoDB (Investigation Audit Logs & LLM Reports)
└── microservices/               # FastAPI Backend Microservices
    ├── fraud-detection/
    │   ├── ml-scoring-service/  # XGBoost / LightGBM Scoring Engine
    │   └── feature-store/       # Real-Time Behavioral Feature Pipeline
    └── llm-investigator/
        ├── explanation-service/ # LLM Reasoning Engine ("Why Flagged?")
        └── rag-pipeline/        # RAG Pipeline over Historical User Behavior
```

---

## 🛠️ Technology Stack

| Layer | Component | Technology |
| :--- | :--- | :--- |
| **Frontend** | Web Dashboard | Next.js, React, TailwindCSS |
| | Mobile App | React Native (Expo) |
| **Backend** | Microservices Engine | Python 3.11+, FastAPI, Uvicorn |
| **Machine Learning**| Risk Scoring | XGBoost, LightGBM, Scikit-Learn |
| **AI / LLM** | Explainability & RAG | OpenAI / Local LLM, LangChain / LlamaIndex |
| **Databases** | Relational DB | PostgreSQL |
| | Document Store | MongoDB |
| **Streaming** | Message Broker | Apache Kafka |
| **Infrastructure** | API Gateway | Nginx |
| | Identity Provider | Keycloak |
| | Coordination | Apache ZooKeeper |

---

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose installed
- Node.js (v18+) for local web development
- Python 3.11+ for local service development

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/wayo.git
   cd wayo
   ```

2. Create an `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=password
   POSTGRES_DB=wayo_db
   MONGO_INITDB_DATABASE=wayo_investigations
   ```

### Running with Docker Compose

Start the complete microservices stack:

```bash
docker-compose up --build -d
```

Check the running containers:

```bash
docker-compose ps
```

---

## 🌐 Port Mapping & Services

| Service | Endpoint / Port | Description |
| :--- | :--- | :--- |
| **API Gateway** | `http://localhost:80` | Nginx reverse proxy |
| **Web Dashboard** | `http://localhost:3000` | Next.js Investigator Portal |
| **Identity Provider** | `http://localhost:8080` | Keycloak Auth Server |
| **Consul Registry** | `http://localhost:8500` | Service Discovery UI |
| **ML Scoring API** | `http://localhost:8000/docs` | FastAPI Swagger Docs |
| **PostgreSQL** | `localhost:5432` | Main Database |
| **MongoDB** | `localhost:27017` | Audit Logs & AI Reports |

---

## 🧪 Testing the ML & LLM Pipeline

You can send a test transaction payload to the ML Scoring Endpoint:

```bash
curl -X POST "http://localhost/api/v1/score" \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "usr_98123",
       "amount": 4200.00,
       "merchant": "Unrecognized Tech Vendor",
       "location": "Lagos, NG",
       "device_id": "dev_new_882"
     }'
```

**Sample Output:**
```json
{
  "transaction_id": "tx_001928",
  "fraud_probability": 0.94,
  "flagged": true,
  "llm_investigation": {
    "summary": "High risk transaction flagged.",
    "reasons": [
      "Transaction amount is 7x higher than user's normal average ($600.00).",
      "Login location changed suddenly from Accra, GH to Lagos, NG.",
      "New device detected (dev_new_882).",
      "Multiple transactions attempted within 2 minutes."
    ]
  }
}
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.