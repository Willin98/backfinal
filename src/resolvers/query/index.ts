import GMR from 'graphql-merge-resolvers';
import resolversShopFilmsQuery from './shop-film';
import resolversGenreQuery from './genre';
import resolversUserQuery from './user';
import queryStripeResolvers from './stripe';
import resolversDashboardQuery from './dashboard';
import resolversComidaQuery from './comida';
import resolversProximamenteQuery from './proximamente';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversShopFilmsQuery,
    resolversGenreQuery,
    //stripe
    queryStripeResolvers,
    resolversDashboardQuery,
    resolversComidaQuery,
    resolversProximamenteQuery
]);

export default queryResolvers;