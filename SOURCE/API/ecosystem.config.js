
const SUFFIX = process.argv.indexOf('--env') === -1 ? '' :
'-' + process.argv[process.argv.indexOf('--env') + 1]

module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps : [

        // First application
        {
            name      : 'tvdl-api' + SUFFIX,
            script    : './bin/www',
            env_production : {
                NODE_ENV: 'production',
                DB_HOST : "13.212.67.7",
                DB_USER : "root",
                DB_PASSWORD : "V21official",
                DEBUG: "tvdl-api:error,app:error",
                PORT : 2013,
                DB_NAME: "duonglieu_library",
                autorestart: true
            },
            env_development: {
                NODE_ENV: 'development',
                DB_HOST : "13.212.67.7",
                DB_USER : "root",
                DB_PASSWORD : "V21official",
                DEBUG: "tvdl-api:*,app:*",
                PORT : 9496,
                DB_NAME: "duonglieu_library_test",
                autorestart: true
            }
        },
        
    ],
};
