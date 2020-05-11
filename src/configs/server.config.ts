export const port = 8000;

export const publicPaths = [
  /^\/user/,
  /^\/register/,
  /^\/about/,
  /^\/chapter/,
  /^\/login/,
];
export const secret = "lifliblalallalalla";
export const jwtExpires = process.env.SESSION_EXPIRES || "7d";
