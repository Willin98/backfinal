import { IResolvers } from "graphql-tools";
import ShopFilmsService from "../../services/shop-film.service";

const resolversShopFilmQuery: IResolvers = {
  Query: {
    shopFilms(_, { page, itemsPage, active }, context) {
      return new ShopFilmsService(
        _,
        { pagination: { page, itemsPage } },
        context
      ).items(active);
    },
    shopFilmsPlatforms(_, { page, itemsPage, active, platform }, context) {
      return new ShopFilmsService(
        _,
        { pagination: { page, itemsPage } },
        context
      ).items(active, platform);
    },
    shopFilmDetails(_, { id }, context){
      return new ShopFilmsService(
        _,
        { 
          id,
        },
        context
      ).details();
    }
  },
};

export default resolversShopFilmQuery;
