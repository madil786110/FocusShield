# About FocusShield 🛡️

**FocusShield** is a privacy-first, AI-powered calendar assistant designed to reclaim your time. It connects to your Microsoft 365 calendar, analyzes your meeting load and fragmentation, and proactively suggests "Focus Blocks" to ensure you have time for deep work.


## 🚀 Features

### 🔒 Privacy First
-   **Local-First Architecture**: Your calendar data is stored in a local SQLite database (`focusshield.db`).
-   **PII Hashing**: Sensitive information like Event IDs and Organizer emails are hashed *before* storage using SHA-256. Meeting subjects and bodies are never stored permanently.

### 📊 Insightful Dashboard
-   **Meeting Load**: Visualize how many hours you spend in meetings per week.
-   **Fragmentation Score**: Understand how broken up your day is. A high score means you're constantly context-switching.
-   **Focus Potential**: See how many hours of deep work you *could* have if you optimized your schedule.

### 🧠 Recommendations Engine
-   **Smart Analysis**: The engine scans your schedule for gaps of 90+ minutes (configurable).
-   **Proposals**: It generates "Focus Block" proposals that you can review.
-   **Conflict Awareness**: It avoids scheduling over existing meetings (Read-Only in MVP).

### ⚡ Performance & Observability
-   **Resilient Graph Client**: Handles Microsoft Graph API throttling (429 errors) with automatic backoff.
-   **Observability Stack**: Includes a pre-configured Docker Compose setup for **Prometheus** and **Grafana** to monitor API usage and rate limits.

---

## 🛠️ Architecture

FocusShield is a monorepo built with **TurboRepo**:

-   **`apps/web`**: Next.js 14 application (Frontend + API Routes).
-   **`packages/core`**: Core business logic, algorithms (`findFocusBlocks`), and privacy utilities.
-   **`packages/storage`**: SQLite persistence layer using Kysely.
-   **`packages/graph-client`**: robust Microsoft Graph SDK wrapper with observability hooks.

---

## 🏁 Getting Started

### Prerequisites
-   **Node.js** v18+
-   **Docker** (Optional, for Observability)

### 1. Installation

```bash
git clone https://github.com/yourusername/focusshield.git
cd focusshield
npm install
```

### 2. Running in Demo Mode (No Setup Required)
Want to see how it looks without connecting your real calendar?

```bash
npm run dev
```
👉 Open **[http://localhost:3000/dashboard?demo=true](http://localhost:3000/dashboard?demo=true)**

### 3. Running in Real Mode (Connect Your Calendar)
To fetch your actual Microsoft 365 data:

1.  **Create an Azure App Registration**:
    -   Go to [Azure Portal](https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/RegisteredApps).
    -   Register a new app (Multitenant + Personal accounts).
    -   Add Redirect URI: `http://localhost:3000`.
    -   Copy the **Client ID**.

2.  **Configure Environment**:
    Create `apps/web/.env.local`:
    ```env
    NEXT_PUBLIC_MSAL_CLIENT_ID=<your-client-id>
    FOCUSSHIELD_SALT=super_secret_salt_for_hashing
    ```

3.  **Run the App**:
    ```bash
    npm run dev
    ```
    👉 Open **[http://localhost:3000](http://localhost:3000)** and click "Sign in with Microsoft".

### 4. Running Observability (Prometheus + Grafana)
Monitor your API usage and check for throttling.

```bash
docker-compose up -d
```
-   **Prometheus**: [http://localhost:9090](http://localhost:9090)
-   **Grafana**: [http://localhost:3001](http://localhost:3001) (u: admin, p: admin)

---

## 🧪 Verification

You can verify the privacy and data integrity by inspecting the local database:

```bash
sqlite3 apps/web/focusshield.db
sqlite> SELECT * FROM event_meta LIMIT 5;
```
*Notice that `eventIdHash` and `organizerHash` are encrypted strings, protecting your privacy.*

---

## 🔮 Roadmap

-   [ ] **Write Capabilities**: "Apply" button to actually create events on your calendar.
-   [ ] **Smart Rescheduling**: Suggest moving low-priority meetings to open up larger blocks.
-   [ ] **Team Mode**: Aggregate (anonymized) stats for team health.
