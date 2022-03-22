import { COLLECTIONS } from "../config/constants";
import { IContextData } from "../interfaces/context-data.interface";
import { asignDocumentId, findOneElement } from "../lib/db-operations";
import ResolversOperationsService from "./resolvers-operations.service";

class ComidasService extends ResolversOperationsService {
  collection = COLLECTIONS.COMIDAS;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(this.collection, "comidas", page, itemsPage);
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      comidas: result.items,
    };
  }

  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      comida: result.item,
    };
  }

  async insert() {
    const comida = this.getVariables().comida;
    //Comprobar que comida no es null
    if (!this.checkData(comida?.name || "")) {
      return {
        status: false,
        message: "El combo no se ha especificado correctamente",
        genre: null,
      };
    }
    //Comprobar que no existe
    if (await this.checkInDatabase(comida?.name || "")) {
      return {
        status: false,
        message: "El combo existe en la base de datos",
        genre: null,
      };
    }
    //Comprobar el ultimo usuario registrado para asignar ID
    comida!.id = await asignDocumentId(this.getDb(), this.collection, {
      key: "id",
      order: -1,
    });
    
    const result = await this.add(this.collection, comida || {}, "comida");
    //Guardar el documento (registro) en la coleccion
    return {
      status: result.status,
      message: result.message,
      comida: result.item,
    };
  }

  async modify() {
    const comida = this.getVariables().comida;
    if (comida === null) {
      return {
        status: false,
        message: "Combo no definido, procura definirlo",
        comida: null,
      };
    }
    const filter = { id: comida?.id };
    const result = await this.update(
      this.collection,
      filter,
      comida || {},
      "comida"
    );
    return {
      status: result.status,
      message: result.message,
      comida: result.item,
    };
  }

  async delete() {
    const id = this.getVariables().id;
    if (!this.checkData(String(id) || "")) {
      return {
        status: false,
        message: "El id del combo no se ha especificado correctamente",
        comida: null,
      };
    }
    const result = await this.del(this.collection, { id }, "comida");
    return { status: result.status, message: result.message };
  }

  async block (){
    const id = this.getVariables().id;
    if (!this.checkData(String(id) || "")) {
      return {
        status: false,
        message: "El id del combo no se ha especificado correctamente",
        comida: null,
      };
    }
    const result = await this.update(this.collection, { id }, {active: false}, "comida");
    return { status: result.status, 
      message: (result.message) ? 'Bloqueado correctamente' : 'No se pudo bloquear correctamente' };
  }

  private checkData(value: string) {
    return value === "" || value === undefined ? false : true;
  }

  private async checkInDatabase(value: string) {
    return await findOneElement(this.getDb(), COLLECTIONS.COMIDAS, {
      name: value,
    });
  }
}

export default ComidasService;
