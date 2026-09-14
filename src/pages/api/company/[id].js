import {companyPage} from '../../../lib/company-data.js';
import {json} from '../../../lib/request.js';
export async function GET({params}) {
  try {
    const data = await companyPage(params.id);
    return json(data || {error: 'Not found'}, data ? 200 : 404);
  } catch {
    return json({error: 'Service unavailable. Please try again or contact investor relations.'}, 503);
  }
}
