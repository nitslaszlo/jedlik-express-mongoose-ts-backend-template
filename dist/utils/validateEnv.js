import { cleanEnv, port, str } from "envalid";
export default function validateEnv() {
    cleanEnv(process.env, {
        JWT_SECRET: str(),
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        MONGO_DB: str(),
        PORT: port(),
    });
}
//# sourceMappingURL=validateEnv.js.map