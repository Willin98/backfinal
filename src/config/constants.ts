import environment from "./environments";

if (process.env.NODE_ENV !== "production") {
  const env = environment;
}

export const SECRET_KEY = process.env.SECRET || "CineWorlConGraphQl";

export enum COLLECTIONS {
  USERS = "users",
  GENRES = "genres",
  SHOP_FILM = "cartelera",
  FILMS = "films",
  PLATFORMS = "platforms",
  COMIDAS = "comidas",
  PROXIMAMENTE = "proximamente"
}

export enum MESSAGES {
  TOKEN_VERICATION_FAILED = "token no valido, inicia sesion de nuevo",
}

/**
 * H= Horas
 * M= Minutos
 * D= Dias
 */

export enum EXPIRETIME {
  H1 = 60 * 60,
  H24 = 24 * H1,
  M15 = H1 / 4,
  M20 = H1 / 3,
  D3 = H24 * 3,
}

export enum ACTIVE_VALUES_FILTER {
  ALL = "ALL",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum SUBSCRIPTIONS_EVENT {
  UPDATE_STOCK_FILM = "UPDATE_STOCK_FILM"
}
