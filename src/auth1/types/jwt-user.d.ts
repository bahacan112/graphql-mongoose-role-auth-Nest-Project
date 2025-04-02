export interface JwtUser {
  sub: string;
  preferred_username: string;
  email?: string;
  roles: string[]; // ✅ Eklenmeli
}
