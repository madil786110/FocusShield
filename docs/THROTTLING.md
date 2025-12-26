# Throttling & Resilience

FocusShield is designed to be a "good citizen" of the Microsoft Graph ecosystem. We strictly adhere to rate limits and implement robust backoff strategies.

## Policy Overview
1. **Respect `Retry-After`**: If Graph returns a `429 Too Many Requests`, we check the `Retry-After` header and strictly wait that duration (plus a small buffer) before retrying.
2. **Exponential Backoff**: For other transient errors (5xx), we use exponential backoff with jitter.
   - `delay = min(cap, base * 2^attempt + jitter)`
3. **Budgeting**: We limit the number of retries per request (default: 3) to prevent infinite loops.

## Caching Strategy
To reduce API load, we implement aggressive caching:
- **Scope**: Calendar Views are cached by `userId` + `weekStart`.
- **TTL**: Cache is valid for 15 minutes (configurable).
- **Storage**: In-memory (LRU) for V1; Redis/DB for V2.

## Simulation
We verify our resilience by simulating `429` responses in our integration tests.
- **Scenario**: Mock server returns 429 with `Retry-After: 1`.
- **Expectation**: Client waits ~1s, then retries.
- **Metrics**: We track `graph_throttles_total` to monitor real-world throttling rates.
