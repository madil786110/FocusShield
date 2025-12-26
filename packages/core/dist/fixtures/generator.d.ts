import { CalendarEvent } from '../types';
interface FixtureOptions {
    weekStart: Date;
    seed?: string;
}
export declare const generateWeek: (type: "LIGHT" | "BUSY" | "FRAGMENTED", options: FixtureOptions) => CalendarEvent[];
export {};
//# sourceMappingURL=generator.d.ts.map