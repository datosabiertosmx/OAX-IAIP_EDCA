
var options = {};

var pgp = require('pg-promise')(options);

const config = {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_NAME ||'edca_generica',
    user: process.env.POSTGRES_USER || 'prueba_captura',
    password: process.env.POSTGRES_PASSWORD || 'p4ssw0rd'
};

var edca_db = pgp(config);

console.log('DB Config -> ', JSON.stringify(config));

const configDash = {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_NAME ||'edca_generica',
    user: process.env.POSTGRES_USER || 'prueba_dashboard',
    password: process.env.POSTGRES_PASSWORD || 'p4ssw0rd'
};

const globals = {
    site : {
        port : 3020
    },
    node: {
        port : 6020
    }
}

var connectionDashboard = pgp(configDash);
var dash_user = configDash.user;


module.exports = {
    pgp: pgp,
    edca_db : edca_db,
    dashboard: connectionDashboard,
    dash_user: dash_user,
    globals: globals
};
