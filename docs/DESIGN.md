# FocusShield Design Document

## Goals
- Provide personal calendar analytics and focus time recommendations.
- Respect user privacy (no content storage).
- Handle Microsoft Graph throttling robustly.

## Architecture

```mermaid
graph TD
    User[User] --> Web[Next.js Web App]
    Web --> API[API Routes]
    API --> Auth[MSAL Auth]
    API --> Graph[Graph Client Package]
    Graph --> MSGraph[Microsoft Graph API]
    API --> Service[Core Logic Package]
    API --> DB[(SQLite Database)]
    
    subgraph Observability
        Prom[Prometheus] --> Metrics endpoint
        Graf[Grafana] --> Prom
    end
```

## Data Model
See `implementation_plan.md` for detailed schema.

## Resilience Strategy
- **Throttling**: Exponential backoff with jitter on 429 errors.
- **Failures**: Graceful degradation if Graph is down (show cached/stale stats).

## Algorithms
- **Fragmentation**: 15-min buckets to identify Swiss-cheese schedules.
- **Focus Blocks**: Greedy algorithm to find contiguous slots > 90m.
