import { ACTIVE_VALUES_FILTER, COLLECTIONS } from '../config/constants';
import ResolversOperationsService from './resolvers-operations.service';

class ProximamentesService extends ResolversOperationsService {
  collection = COLLECTIONS.PROXIMAMENTE;
  constructor(root: object, variables: object, context: object) {
    super(root, variables, context);
  }

  async items() {
    /*let filter: object = { active: {$ne: false}}; 
    if(active === ACTIVE_VALUES_FILTER.ALL){
      filter = {};
    }else if(active === ACTIVE_VALUES_FILTER.INACTIVE){
      filter = { active: false }; 
    }*/
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(
      this.collection,
      'proximamente',
      page,
      itemsPage, 
    );
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      proximamentes: result.items,
    };
  }

  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      proximamente: result.item,
    };
  }
}

export default ProximamentesService;
