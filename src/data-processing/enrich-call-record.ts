import { CallRecord, EnrichedCallRecord } from "./call-record.i";
import { getOperatorInfo } from "./get-country-and-operator";

/**
 * Enriches a call record with additional information such as operator and country details,
 * calculates call duration and estimated cost.
 */
export const enrichCallRecord = async (record: CallRecord): Promise<EnrichedCallRecord> => {

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

    return enrichedRecord;

}