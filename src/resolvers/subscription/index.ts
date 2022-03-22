import GMR from 'graphql-merge-resolvers';
import resolversShopFilmSubscription from "./shop-film";

const subscriptionResolvers = GMR.merge([
    resolversShopFilmSubscription
]);

export default subscriptionResolvers;