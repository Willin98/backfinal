import { COLLECTIONS } from './../../config/constants';
import { findElements } from './../../lib/db-operations';
import { IResolvers } from 'graphql-tools';
import FilmService from '../../services/film.service';
import PlatformService from '../../services/platform.service';

const resolversProximamenteType: IResolvers = {
  Proximamente: {
    filmId: (parent) => parent.film_id,
    film: async (parent, __, { db }) => {
      const result = await new FilmService({}, { id: parent.film_id }, {db}).details();
      return result.film;
    },
  },
};

export default resolversProximamenteType;
