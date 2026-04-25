import { cleanEnv, str, port } from "envalid";
import "dotenv/config";

const env = cleanEnv(process.env, {
  PORT: port(),
  CORS_ORIGIN: str(),
  MONGO_URI: str(),
  CLERK_SECRET_KEY: str(),
  ADMIN_EMAILS: str(),
});

export default env;
