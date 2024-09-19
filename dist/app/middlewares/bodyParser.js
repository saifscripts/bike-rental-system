"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyParser = void 0;
const bodyParser = (req, _res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
};
exports.bodyParser = bodyParser;
