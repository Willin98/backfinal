import { COLLECTIONS } from "./../config/constants";
import ResolversOperationsService from "./resolvers-operations.service";

class FilmService extends ResolversOperationsService {
  collection = COLLECTIONS.FILMS;
  constructor(root: object, variables: object, context: object) {
    super(root, variables, context);
  }

  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      film: result.item,
    };
  }
}

export default FilmService;
