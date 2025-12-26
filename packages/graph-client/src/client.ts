import 'isomorphic-fetch';
import { Client, Middleware, MiddlewareOptions, Context } from '@microsoft/microsoft-graph-client';

// Throttling Middleware
class ThrottlingMiddleware implements Middleware {
    private nextMiddleware: Middleware | undefined;

    async execute(context: Context): Promise<void> {
        const maxRetries = 3;
        let retryCount = 0;

        while (retryCount <= maxRetries) {
            try {
                if (this.nextMiddleware) {
                    await this.nextMiddleware.execute(context);
                } else {
                    // If no next middleware, perform the request (this is usually handled by HTTP middleware in Graph Client, but for custom...)
                    // Actually Graph Client's Middleware chain handles the fetch.
                    // We just need to catch errors.
                    // However, Custom Middleware in Graph SDK is tricky. 
                    // Let's use the explicit `response` check if we can, BUT 
                    // standard SDK already has RetryHandler. We want *custom* behavior if needed.
                    // For simplicity, let's rely on the SDK's built-in RetryHandler but configure it strictly.
                    // Re-implementing a simple fetch wrapper might be safer for "Total Observability".
                    // But let's try to stick to the SDK pattern.
                    return;
                }
                return;
            } catch (error: any) {
                // Graph SDK throws on 429?
                if (error?.statusCode === 429) {
                    const retryAfter = error?.headers?.get?.('Retry-After') || Math.pow(2, retryCount + 1);
                    const waitMs = Number(retryAfter) * 1000;
                    console.warn(`[GraphClient] Throttled. Waiting ${waitMs}ms. Retry ${retryCount + 1}/${maxRetries}`);

                    await new Promise(resolve => setTimeout(resolve, waitMs));
                    retryCount++;
                    continue;
                }
                throw error;
            }
        }
    }

    setNext(next: Middleware): void {
        this.nextMiddleware = next;
    }
}

export class GraphClient {
    private client: Client;
    public metrics: { calls: number; throttles: number } = { calls: 0, throttles: 0 };
    private onMetric?: (metric: 'call' | 'throttle') => void;

    constructor(accessToken: string, onMetric?: (metric: 'call' | 'throttle') => void) {
        this.onMetric = onMetric;
        this.client = Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            },
            // Insert custom middleware if we wanted to overload
            // For now, we wrap the request method to capture metrics
        });
    }

    /* 
     * Configurable Fetch Wrapper related to "THROTTLING.md"
     * We wrap the SDK's api() calls to add observability and consistent error handling.
     */
    async getEvents(start: Date, end: Date) {
        const startStr = start.toISOString();
        const endStr = end.toISOString();

        return this.request(
            `/me/calendarView?startDateTime=${startStr}&endDateTime=${endStr}&$select=id,subject,start,end,organizer,attendees,responseStatus,recurrence`
        );
    }

    async getUser() {
        return this.request('/me');
    }

    private async request(endpoint: string, method: string = 'GET', body?: any) {
        this.metrics.calls++;
        this.onMetric?.('call');
        try {
            // TODO: Implement sophisticated retry here if SDK default fails us.
            // SDK handles basic 429, but typically we want to log it.
            const req = this.client.api(endpoint);
            if (method === 'POST' || method === 'PUT') {
                return await req.post(body);
            }
            return await req.get();
        } catch (err: any) {
            if (err.statusCode === 429) {
                this.metrics.throttles++;
                this.onMetric?.('throttle');
            }
            throw err;
        }
    }
}
