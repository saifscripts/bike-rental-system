"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    db_uri: process.env.DB_URI,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
};
