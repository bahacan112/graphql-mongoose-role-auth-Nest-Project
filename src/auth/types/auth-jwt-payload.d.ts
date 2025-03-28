export interface AuthJwtPayload {
  sub: string; // sadece userId string olarak verilecek
  iat?: number;
  exp?: number;
}
