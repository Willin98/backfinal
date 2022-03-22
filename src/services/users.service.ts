import { ACTIVE_VALUES_FILTER } from './../config/constants';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from "../config/constants";
import { IContextData } from "../interfaces/context-data.interface";
import { IUser } from "../interfaces/user.interface";
import { asignDocumentId, findOneElement } from "../lib/db-operations";
import ResolversOperationsService from "./resolvers-operations.service";
import bcrypt from "bcrypt";
import JWT from "../lib/jwt";
import MailService from "./mail.service";

class UsersService extends ResolversOperationsService {
  private collection = COLLECTIONS.USERS;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }
  //Lista de usuarios
  async items(active: string = ACTIVE_VALUES_FILTER.ACTIVE) {
    let filter: object = { active: {$ne: false}}; 
    if(active === ACTIVE_VALUES_FILTER.ALL){
      filter = {};
    }else if(active === ACTIVE_VALUES_FILTER.INACTIVE){
      filter = { active: false}; 
    }
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(
      this.collection,
      "usuarios",
      page,
      itemsPage, 
      filter
    );
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      users: result.items,
    };
  }
  //Autenticarnos
  async auth() {
    let info = new JWT().verify(this.getContext().token!);
    if (info === MESSAGES.TOKEN_VERICATION_FAILED) {
      return {
        status: false,
        message: info,
        user: null,
      };
    }
    return {
      status: true,
      message: "Usuario autenticado correctamente mediante el token",
      user: Object.values(info)[0],
    };
  }
  //Iniciar Sesion
  async login() {
    try {
      const variables = this.getVariables().user;
      const user: IUser = (await findOneElement(this.getDb(), this.collection, {
        email: variables?.email,
      })) as unknown as IUser;
      if (user === null) {
        return {
          status: false,
          message: "Usuario no existe",
          token: null,
        };
      }

      const passwordCheck = bcrypt.compareSync(
        variables?.password || "",
        user.password || ""
      );

      if (passwordCheck !== null) {
        delete user.password;
        delete user.birthday;
        delete user.registerDate;
      }
      return {
        status: passwordCheck,
        message: !passwordCheck
          ? "Password y usuario no correctos"
          : "El usuario se logueo correctamente",
        token: !passwordCheck ? null : new JWT().sing({ user }, EXPIRETIME.H24),
        user: !passwordCheck ? null : user,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: "Error al cargar el usuario",
        token: null,
      };
    }
  }
  //Registrar un usuario
  async register() {
    const user = this.getVariables().user;
    //Comprobar que user no es null
    if (user === null) {
      return {
        status: false,
        message: "Usuario no definido, procura definirlo",
        user: null,
      };
    }
    if (
      user?.password === null ||
      user?.password === undefined ||
      user?.password === ""
    ) {
      return {
        status: false,
        message: "Usuario sin password correcto",
        user: null,
      };
    }
    //Comprobar que el usuario no existe
    const userCheck = await findOneElement(this.getDb(), this.collection, {
      email: user?.email,
    });

    if (userCheck !== null) {
      return {
        status: false,
        message: `El email ${user?.email} ya se encuentra registrado`,
        user: null,
      };
    }

    //Comprobar el ultimo usuario registrado para asignar ID
    user!.id = await asignDocumentId(this.getDb(), this.collection, {
      key: "registerDate",
      order: -1,
    });

    //Asignar la fecha en formato ISO en la propiedad registerDate
    user!.registerDate = new Date().toISOString();

    //Encriptar password
    user!.password = bcrypt.hashSync(user!.password || "", 10);

    const result = await this.add(this.collection, user || {}, "usuario");
    //Guardar el documento (registro) en la coleccion
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }
  //Modificar un usuario
  async modify() {
    const user = this.getVariables().user;
    if (user === null) {
      return {
        status: false,
        message: "Usuario no definido, procura definirlo",
        user: null,
      };
    }
    const filter = { id: user?.id };
    const result = await this.update(
      this.collection,
      filter,
      user || {},
      "usuario"
    );
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }
  //Borrar el usuario
  async delete() {
    const id = this.getVariables().id;
    if (id === undefined || id === "") {
      return {
        status: false,
        message:
          "Identificador del usuario no definido, procura definirlo para eliminarlo",
        user: null,
      };
    }
    const result = await this.del(this.collection, { id }, "usuario");
    return {
      status: result.status,
      message: result.message,
    };
  }
  //Bloquear el usuario
  async unblock(unblock: boolean, admin: boolean) {
    const id = this.getVariables().id;
    const user = this.getVariables().user;
    if (!this.checkData(String(id) || "")) {
      return {
        status: false,
        message: "El id del usuario no se ha especificado correctamente",
        genre: null,
      };
    }
    if (user?.password === "1234") {
      return {
        status: false,
        message:
          "En este caso no podemos activar el usuario porque no has cambiado el password 1234",
      };
    }
    let update = { active: unblock };
    if (unblock && !admin) {
      console.log('Soy cliente y estoy cambiando la contraseña');
      update = Object.assign(
        {},
        { active: true },
        {
          birthday: user?.birthday,
          password: bcrypt.hashSync(user?.password || "", 10),
        }
      );
    }
    console.log(update);
    const result = await this.update(
      this.collection,
      { id },
      update,
      "usuario"
    );
    const action = unblock ? "Desbloqueado" : "Bloqueado";
    return {
      status: result.status,
      message: result.message
        ? `${action} correctamente`
        : `No se ha ${action.toLowerCase()} correctamente`,
    };
  }

  async active() {
    const id = this.getVariables().user?.id;
    const email = this.getVariables().user?.email || "";
    if (email === undefined || email === "") {
      return {
        status: false,
        message: "El email no se ha definido correctamente",
      };
    }
    const token = new JWT().sing({ user: { id, email } }, EXPIRETIME.H1);
    const html = `Para activar la cuenta haz sobre esto: <a href="${process.env.CLIENT_URL}/#/active/${token}">Clic aqui</a>`;
    const mail = {
      subject: "Activar usuario",
      to: email,
      html,
    };
    return new MailService().send(mail);
  }
  private checkData(value: string) {
    return value === "" || value === undefined ? false : true;
  }
}

export default UsersService;
