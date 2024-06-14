"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
exports.default = {
    port: process.env.PORT,
    db_uri: process.env.DB_URI,
};
