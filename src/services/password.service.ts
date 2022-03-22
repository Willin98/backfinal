import { COLLECTIONS, EXPIRETIME } from "../config/constants";
import { findOneElement } from "../lib/db-operations";
import JWT from "../lib/jwt";
import { IContextData } from "./../interfaces/context-data.interface";
import MailService from "./mail.service";
import ResolversOperationsService from "./resolvers-operations.service";
import bcrypt from "bcrypt";

class PasswordService extends ResolversOperationsService {
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }
  async sendMail() {
    const email = this.getVariables().user?.email || "";
    if (email === undefined || email === "") {
      return {
        status: false,
        message: "El email no se ha definido correctamente",
      };
    }
    //Coger informacion del usuario
    const user = await findOneElement(this.getDb(), COLLECTIONS.USERS, {
      email,
    });
    //Si usuario es indefinido mandamos un mensajes que no existe el usuario
    if (user === null || user === undefined) {
      return {
        status: false,
        message: `Usuario con el ${email} no existe`,
      };
    }
    const newUser = {
      id: user.id,
      email,
    };
    const token = new JWT().sing({ user: newUser }, EXPIRETIME.M15);
    const html = `Para cambiar de contraseña haz sobre esto: <a href="${process.env.CLIENT_URL}/#/reset/${token}">Clic aqui</a>`;
    const mail = {
      to: email,
      subject: "Cambiar contraseña",
      html,
    };
    return new MailService().send(mail);
  }
  async change(){
    const id = this.getVariables().user?.id;
    let password = this.getVariables().user?.password;
     //Comprobar que el id es correcto
     if (id === undefined || id === "") {
      return {
        status: false,
        message: "El ID necesita una informacion correcta",
      };
    }
    //Comprobar la contraseña
    if (password === undefined || password === "" || password === '1234') {
      return {
        status: false,
        message: "La contraseña necesita una informacion correcta",
      };
    }
    //Encriptar el contraseña
    password = bcrypt.hashSync(password || "", 10);
    //Actualizar
    const result = await this.update(
      COLLECTIONS.USERS,
      { id },
      { password },
      'users'
    );
    return {
      status: result.status,
      message: (result.status) ? 'Contraseña actualizada correctamente' :
      result.message
    };
  }
}

export default PasswordService;
