import { EnrichedCallRecord } from "./call-record.i";
import { getOperatorInfo } from "./get-country-and-operator";
import { Queue } from "./queue";


/**
 * Processes call records from the queue, 
 * enriches them with operator and country information, 
 * calculates call duration and estimated cost, 
 * and logs the enriched records.
 */
export async function processRecordsFromQueue() {

    for await (const records of Queue.iterateQueue()) {
        
        // Iterate over and process each record in the batch
        for (const record of records) {

            // Get country and operator information for both the "to" and "from" numbers
            const { country: toCountry, operator: toOperator } = await getOperatorInfo(record.toNumber, record.callStartTime);
            const { country: fromCountry, operator: fromOperator, estimatedCostPerMinute } = await getOperatorInfo(record.fromNumber, record.callStartTime);

            // Calculate call duration in seconds
            const callStart = new Date(record.callStartTime).getTime();
            const callEnd = new Date(record.callEndTime).getTime();
            const duration = Math.round((callEnd - callStart) / 1000);

            // Calculate estimated cost
            const estimatedCost = (duration / 60) * estimatedCostPerMinute;

            // Create an enriched call record with all the additional information
            const enrichedRecord: EnrichedCallRecord = {
                ...record,
                toCountry,
                toOperator,
                fromCountry,
                fromOperator,
                duration,
                estimatedCost
            };

            console.log("Enriched Call Record:", enrichedRecord);

        }
        
        

    }

}