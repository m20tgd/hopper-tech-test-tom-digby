import postgres from 'postgres';
import { EnrichedCallRecord } from '../data-processing/call-record.i';

const sql = postgres({transform: {
    column: {
      to: postgres.fromCamel,   // JS camelCase -> DB snake_case
      from: postgres.toCamel    // DB snake_case -> JS camelCase
    }
  }
});

export default class PostgresDB {

    public static async insertCallRecords(records: EnrichedCallRecord[]): Promise<postgres.RowList<postgres.Row[]> | null> {

        try {
            const result = await sql`
                INSERT INTO call_records ${ sql(records) }
                RETURNING *
            `;
            return result;
        }
        catch(error) {
            console.error("Error inserting call records into Postgres:", error);
            return null;
        }
    }

}