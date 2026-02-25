import Papa from 'papaparse';
import { CallRecord } from './call-record.i';
import { Queue } from './queue';

type Response = {
    ok: boolean;
    error?: string;
};

export class CallHandler {

    /**
     * Handle a batch of call records
     *
     * @param payload The raw batch of CDRs in CSV format.
     */
    public async handleBatch(payload: string): Promise<Response> {

        // If payload is empty, return an error
        if (!payload || payload.trim() === "") {
            return { ok: false, error: "Payload is empty" };
        }

        // Parse the CSV payload to JSON array
        const { data, errors } = Papa.parse(payload.trim(), {
            header: true,
            skipEmptyLines: true,
        });

        // If there are parsing errors, return an error response
        if (errors.length > 0) {
            return { ok: false, error: JSON.stringify(errors) };
        }

        // Add the records to the queue for processing
        const error = await Queue.enqueue(data as CallRecord[]);
        if (error) {
            return { ok: false, error: error.message };
        }

        // Acknowledge receipt of the batch
        return { ok: true };
    }

}