import 'isomorphic-fetch';
export declare class GraphClient {
    private client;
    metrics: {
        calls: number;
        throttles: number;
    };
    private onMetric?;
    constructor(accessToken: string, onMetric?: (metric: 'call' | 'throttle') => void);
    getEvents(start: Date, end: Date): Promise<any>;
    getUser(): Promise<any>;
    private request;
}
//# sourceMappingURL=client.d.ts.map