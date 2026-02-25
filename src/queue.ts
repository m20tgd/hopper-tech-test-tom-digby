import { Level } from 'level';
import { CallRecord } from './call-record.i';

export class Queue {

    private static queue: Level<string, CallRecord[]>;

    public static get Queue(): Level<string, CallRecord[]> {
        if (!this.queue) {
            this.queue = new Level<string, CallRecord[]>('./queue-db', { valueEncoding: 'json' });
        }
        return this.queue;
    }

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

}