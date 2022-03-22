import GMR from "graphql-merge-resolvers";
import resolversPlatformType from "./platform";
import resolversProximamenteType from "./proximamente";
import resolversShopFilmType from "./shop-films";
import typeStripeResolvers from "./stripe";

const typeResolvers = GMR.merge([
  resolversShopFilmType,
  resolversPlatformType,
  //stripe
  typeStripeResolvers,
  resolversProximamenteType
]);

export default typeResolvers;
