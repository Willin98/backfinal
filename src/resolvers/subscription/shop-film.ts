import { withFilter } from "apollo-server-express";
import { IResolvers } from "graphql-tools";
import { SUBSCRIPTIONS_EVENT } from "../../config/constants";

const resolversShopFilmSubscription: IResolvers = {
  Subscription: {
    updateStockFilm: {
      subscribe: (_, __, { pubsub }) =>
        pubsub.asyncIterator(SUBSCRIPTIONS_EVENT.UPDATE_STOCK_FILM),
    },
    selectFilmStockUpdate: {
      subscribe: withFilter(
        (_, __, { pubsub }) =>
          pubsub.asyncIterator(SUBSCRIPTIONS_EVENT.UPDATE_STOCK_FILM),
        (payload, variables) => {
          return payload.selectFilmStockUpdate.id === variables.id;
        }
      ),
    },
  },
};

export default resolversShopFilmSubscription;
