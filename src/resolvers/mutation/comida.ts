import { IResolvers } from 'graphql-tools';
import ComidasService from '../../services/comidas.service';

const resolversComidaMutation: IResolvers = {
    Mutation: {
        addComida(_, {comida}, context) {
            //añadimos la llamada al servicio
            return new ComidasService(_, {comida}, context).insert();
        },
        updateComida(_, {comida}, context) {
            return new ComidasService(_,{comida}, context).modify();
        },
        deleteComida(_, {id}, context) {
            return new ComidasService(_,{id}, context).delete();
        },
        blockComida(_, {comida}, context) {
            return new ComidasService(_,{comida}, context).block();
        }
    }
};

export default resolversComidaMutation;