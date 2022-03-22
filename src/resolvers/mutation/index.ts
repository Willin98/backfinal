import GMR from 'graphql-merge-resolvers';
import resolversComidaMutation from './comida';
import resolversMailMutation from './email';
import resolversGenreMutation from './genre';
import resolversShopFilmMutation from './shop-film';
import mutationStripeResolvers from './stripe';
import resolversUserMutation from './user';

const mutationResolvers = GMR.merge([
    resolversUserMutation,
    resolversGenreMutation,
    resolversMailMutation,
    mutationStripeResolvers,
    resolversShopFilmMutation,
    resolversComidaMutation
]);

export default mutationResolvers;