import { Client } from '@elastic/elasticsearch';
import Mock from '@elastic/elasticsearch-mock';
import { EnrichedCallRecord } from '../data-processing/call-record.i';

const mock = new Mock();
mock.add({
  method: 'POST',
  path: '/_bulk'
}, () => {
  // Return a dummy successful response
  return { errors: false, items: [] };
});

const client = new Client({
  node: 'http://localhost:9200', 
  Connection: mock.getConnection()
});

export default class ElasticSearchDB {

    public static async indexCallRecords(records: EnrichedCallRecord[]): Promise<void> {

        const body = records.flatMap(doc => [{ index: { _index: 'call-records' } }, doc]);

        try {
            const bulkResponse = await client.bulk({ refresh: true, body });
            if (bulkResponse.errors) {
                console.error('Errors occurred during ElasticSearch bulk indexing:', bulkResponse.errors);
            }

        } catch (error) {
            console.error('Error indexing call records into ElasticSearch:', error);
        }
    }

}