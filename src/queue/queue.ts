import { Level } from 'level';
import { CallRecord } from '../data-processing/call-record.i';

export class Queue {

    private static queue: Level<string, CallRecord[]>;

    public static get Queue(): Level<string, CallRecord[]> {
        if (!this.queue) {
            this.queue = new Level<string, CallRecord[]>('./queue-db', { valueEncoding: 'json' });
        }
        return this.queue;
    }

    /**
     * Enqueues an array of call records for processing.
     * 
     * @param record An array of call records to be enqueued for processing.
     * @returns A promise that resolves to void if the operation is successful, or an Error if it fails.
     */
    public static async enqueue(record: CallRecord[]): Promise<Error | void> {
        try {
            const id = `record_${Date.now()}_${Math.random().toString(36)}`;
            await this.Queue.put(id, record);
        }
        catch (error) {
            console.error("Error enqueuing record:", error);
            return error as Error;
        }
    }

    /**
     * Iterates over the queue and yields each array of call records.
     * 
     * @returns An async generator that yields arrays of call records.
     */
    public static async *iterateQueue(): AsyncGenerator<CallRecord[], void, unknown> {
        for await (const [id, value] of this.Queue.iterator()) {
            yield value;
            await this.deleteRecordFromQueue(id);
        }
    }

public static async deleteRecordFromQueue(id: string): Promise<void> {
        try {
            await this.Queue.del(id);
        }
        catch (error) {
            console.error("Error deleting record from queue:", error);
        }
    }

}