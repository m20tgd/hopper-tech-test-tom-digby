import { format } from "date-fns";
import { lookupOperator, OperatorInfo } from "../api-mocks/operator-lookup";

export async function getOperatorInfo(phoneNumber: string, date: string): Promise<OperatorInfo> {

    // Format date as required by the API
    const callDateString = format(new Date(date), 'yy-MM-dd'); 

    // Call lookupOperator API to get operator information. Retry on failure until successful.
    let operatorInfo: OperatorInfo;
    while (true) {
        try {
            operatorInfo = await lookupOperator(phoneNumber, callDateString);
            break; // Exit loop if successful
        } catch (error) {
            // Wait before retrying to avoid overwhelming the service
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    return operatorInfo;
    
}