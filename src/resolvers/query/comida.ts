import { IResolvers } from "graphql-tools";
import ComidasService from "../../services/comidas.service";

const resolversComidaQuery: IResolvers = {
  Query: {
    async comidas(_, variables, { db }) {
      return new ComidasService(
        _,
        {
          pagination: variables,
        },
        { db }
      ).items();
    },
    async comida(_, { id }, { db }) {
      return new ComidasService(_, { id }, { db }).details();
    },
  },
};

export default resolversComidaQuery;
