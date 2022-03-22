import { IResolvers } from "graphql-tools";
import ProximamentesService from "../../services/proximamente.service";


const resolversProximamenteQuery: IResolvers = {
  Query: {
    async proximamentes(_, variables, context) {
      console.log('holaa',variables);
      return new ProximamentesService(
        _,
        variables,
        context
      ).items();
    },
    async proximamenteDetails(_, { id }, context){
      console.log('holaa',id);
      return new ProximamentesService(
        _,
        { 
          id,
        },
        context
      ).details();
    }
  },
};

export default resolversProximamenteQuery;
