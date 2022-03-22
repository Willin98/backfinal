import { SECRET_KEY, MESSAGES, EXPIRETIME } from './../config/constants';
import jwt from 'jsonwebtoken';
import { IJwt } from './../interfaces/jwt.interface'

class JWT {
    private secretKey = SECRET_KEY as string;

    //Informacion del payload con fecha de caducidad de 24 horas
    sing(data: IJwt, expiresIn: number = EXPIRETIME.H24 ){
        return jwt.sign(
            { user: data.user },
            this.secretKey,
            { expiresIn } //24 horas de caducidad
        );
    }

    verify(token: string){
        try{
            return jwt.verify(token, this.secretKey);
        }catch (e){
            return MESSAGES.TOKEN_VERICATION_FAILED;
        }
    }
}

export default JWT;