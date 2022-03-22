import { findOneElement } from './../lib/db-operations';
import { SUBSCRIPTIONS_EVENT } from './../config/constants';
import { PubSub } from 'apollo-server-express';
import { IStock } from './../interfaces/stock.interface';
import { COLLECTIONS, ACTIVE_VALUES_FILTER } from '../config/constants';
import ResolversOperationsService from './resolvers-operations.service';
import { manageStockUpdate } from '../lib/db-operations';

class ShopFilmsService extends ResolversOperationsService {
  collection = COLLECTIONS.SHOP_FILM;
  constructor(root: object, variables: object, context: object) {
    super(root, variables, context);
  }

  async items(active: string = ACTIVE_VALUES_FILTER.ACTIVE, platform: string = '') {
    let filter: object = { active: {$ne: false}}; 
    if(active === ACTIVE_VALUES_FILTER.ALL){
      filter = {};
    }else if(active === ACTIVE_VALUES_FILTER.INACTIVE){
      filter = { active: false }; 
    }
    if (platform !== '' && platform !== undefined) {
      filter = {...filter, ...{platform_id: platform}};
    }
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(
      this.collection,
      'peliculas en cartelera',
      page,
      itemsPage, 
      filter
    );
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      shopFilms: result.items,
    };
  }

  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      shopFilm: result.item,
    };
  }

  async updateStock(updateList: Array<IStock>, pubsub: PubSub) {
    try {
      updateList.map(async (item: IStock) => {
        const itemsDetails = await findOneElement(
          this.getDb(), this.collection,
          {id: item.id}
        );
        await manageStockUpdate(
          this.getDb(),
          this.collection,
          {id: item.id},
          {stock: item.increment}
        );
        pubsub.publish(SUBSCRIPTIONS_EVENT.UPDATE_STOCK_FILM, 
          { selectFilmStockUpdate: itemsDetails});
      });
      return true;
    } catch(e) {
      console.log(e);
      return false;
    }
  }
}

export default ShopFilmsService;
