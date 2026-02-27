import { EnrichedCallRecord } from "./call-record.i";
import { Queue } from "../queue/queue";
import PostgresDB from "../databases/postgres";
import ElasticSearchDB from "../databases/elasticsearch";
import { enrichCallRecord } from "./enrich-call-record";


/**
 * Processes call records from the queue, 
 * enriches records with additional information,
 * and stores them in both Postgres and ElasticSearch.
 */
export async function processRecordsFromQueue() {

    for await (const records of Queue.iterateQueue()) {

        const enrichedRecords: EnrichedCallRecord[] = [];
        
        // Iterate over and process each record in the batch
        for (const record of records) {

            const enrichedRecord = await enrichCallRecord(record);
            enrichedRecords.push(enrichedRecord);

        }

        // Add enriched records to Postgres
        const postgresResult = await PostgresDB.insertCallRecords(enrichedRecords);
        if (postgresResult === null) {
            console.error("Failed to insert enriched call records into Postgres. Skipping ElasticSearch indexing for this batch.");
            continue; // Skip ElasticSearch indexing if Postgres insertion fails
        }

        // Index enriched records into ElasticSearch
        await ElasticSearchDB.indexCallRecords(enrichedRecords);

    }

}