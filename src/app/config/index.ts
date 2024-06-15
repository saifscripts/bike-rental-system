import 'dotenv/config';

export default {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    db_uri: process.env.DB_URI,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_exp_in: process.env.JWT_ACCESS_EXP_IN,
};
