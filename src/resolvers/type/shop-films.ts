import { COLLECTIONS } from './../../config/constants';
import { findElements } from './../../lib/db-operations';
import { IResolvers } from 'graphql-tools';
import FilmService from '../../services/film.service';
import PlatformService from '../../services/platform.service';

const resolversShopFilmType: IResolvers = {
  ShopFilm: {
    filmId: (parent) => parent.film_id,
    platformId: (parent) => parent.platform_id,
    film: async (parent, __, { db }) => {
      const result = await new FilmService({}, { id: parent.film_id }, {db}).details();
      return result.film;
    },
    platform: async (parent, __, { db }) => {
        const result = await new PlatformService({}, { id: parent.platform_id }, {db}).details();
        return result.platform;
      },
      relationalFilms: async(parent, __, { db }) => {
        return findElements(
          db,
          COLLECTIONS.SHOP_FILM,
          {
            $and: [
              { film_id: parent.film_id },
              { id: {$ne: parent.id} }
            ]
          }
        );
      }
  },
};

export default resolversShopFilmType;
