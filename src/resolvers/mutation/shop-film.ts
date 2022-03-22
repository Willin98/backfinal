import { IResolvers } from "graphql-tools";
import ShopFilmsService from "../../services/shop-film.service";

const resolversShopFilmMutation: IResolvers = {
  Mutation: {
    updateStock(_, { update }, { db, pubsub }) {
      return new ShopFilmsService(_, {}, { db }).updateStock(update, pubsub);
    },
  },
};

export default resolversShopFilmMutation;
