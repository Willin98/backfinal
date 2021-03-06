import { IComida } from './comida.interface';
import { IPaginationOptions } from './pagination-options.interface';
import { IUser } from './user.interface';

export interface IVariables {
    id?: string | number;
    genre?: string;
    user?: IUser;
    pagination?: IPaginationOptions;
    comida?: IComida;
}