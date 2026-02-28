import { CallHandler } from "../handler/call-handler";
import { processRecordsFromQueue } from "../data-processing/record-processor";

const dummyCsvPayload = `id,callStartTime,callEndTime,fromNumber,toNumber,callType,region
cdr_001,2026-01-21T14:30:00.000Z,2026-01-21T14:35:30.000Z,+14155551234,+442071234567,voice,us-west
cdr_002,2026-01-21T14:31:15.000Z,2026-01-21T14:33:45.000Z,+442071234567,+14155551234,voice,eu-west
cdr_003,2026-01-21T14:32:00.000Z,2026-01-21T14:47:30.000Z,+14155559876,+447911123456,video,us-west
cdr_004,2026-01-21T15:00:00.000Z,2026-01-21T15:10:00.000Z,+447911123456,+14155559876,voice,eu-west
cdr_005,2026-01-21T15:05:00.000Z,2026-01-21T15:20:00.000Z,+14155551234,+447911123456,video,us-west
cdr_006,2026-01-21T15:15:00.000Z,2026-01-21T15:25:00.000Z,+442071234567,+14155559876,voice,eu-west
cdr_007,2026-01-21T15:20:00.000Z,2026-01-21T15:35:00.000Z,+447911123456,+442071234567,video,us-west
cdr_008,2026-01-21T15:30:00.000Z,2026-01-21T15:45:00.000Z,+14155559876,+447911123456,voice,eu-west
cdr_009,2026-01-21T15:40:00.000Z,2026-01-21T15:55:00.000Z,+14155551234,+447911123456,video,us-west
cdr_010,2026-01-21T16:00:00.000Z,2026-01-21T16:15:00.000Z,+447911123456,+14155559876,voice,eu-west`;

jest.mock('postgres', () => {
  // The mock sql function, which can be called as a tagged template
  const mockSql = (...args: any[]) => Promise.resolve({ count: 0, command: 'INSERT', fields: [], rows: [] });
  // Also allow mockSql to be called as a function (for sql(records))
  Object.assign(mockSql, {
    // If you use sql(records) in your code, this should return something usable in the template
    // You can return a dummy value or just the input
    // For most cases, returning the input is fine
    // If you need more, adjust as needed
    [Symbol.for('postgres')]: true
  });
  return () => mockSql;
});

describe("Happy Path Test", () => {
    it("CallHandler.handleBatch should return {ok: true} for a valid 10-line CSV payload in under 500ms", async () => {
        const handler = new CallHandler();
        const start = Date.now();
        const response = await handler.handleBatch(dummyCsvPayload);
        const duration = Date.now() - start;
        expect(response).toEqual({ ok: true });
        expect(duration).toBeLessThan(500);
    });

    it("processRecordsFromQueue should process the records from the queue without errors", async () => {
        await processRecordsFromQueue(); // Start processing records from the queue
    });

});

