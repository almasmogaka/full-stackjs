'use strict';

const Hapi = require('hapi');
const sql = require('mysql');

const server = Hapi.server({
    port: 8000,
    host: 'localhost',
    routes: {
        cors: true
    }
});
const con = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "restApi"
});
con.connect((err) => {
    if (err) throw err;

});
//add route
server.route({
    method: 'POST',
    path: '/loginApi',
    handler: (request, h) => {
        let usernm = request.payload.username;
        let pass = request.payload.password;
        return new Promise(
            (res, reject) => {
                con.query("select count(*) as users from restApi.login where username = '"+usernm + "' and password = '"+pass+"'", (err, rows, fields) => {
                    if (err) {
                        console.log('error',err);
                        
                        reject(err);
                    }  
                    console.log('rows',rows[0]);

                    if(rows[0].users == 1) {
                        console.log('successful');
                        res({"success": "Login is successful"});
                    }else {
                        console.log('unsuccessful');
                        res({"Failure":"Invalid username or password"});
                    }                   
                });
            }
        );
    }
});
server.route({
    method: 'POST',
    path: '/register',
    handler: (request, h) => {
        let username = request.payload.username;
        let password = request.payload.password;
        let email= request.payload.email;        
        return new Promise(
            (res, reject) => {
               
                con.query("INSERT INTO login(username, password, email) VALUES ('" + username + "','" + password + "','" + email + "')", (err, result, fields) => {
                    if (err) {
                        reject(err);
                    }
                    if(result){
                        res({"success": "Registration is successful"});
                    }else {
                        res({"Failure": "Registration error"});
                    }
                });
            }
        );
    }
});
server.route({
    method: 'GET',
    path: '/quiz',
    handler: (request, h) => {

        return new Promise(
            (res, reject) => {
                con.query("select * from survey", (err, result, fields) => {
                    if (err) {
                        reject(err);
                    }
                    res(result);
                });
            }
        );
        //return 'Hello, '+ encodeURIComponent(request.params.name) +'!';
    }
});
const init = async () => {

    await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/survey',
        handler: (request, h) => {

            return h.file('./public/survey.json');
        }
    });
    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyprint: false,
            logEvents: ['response']
        }
    });
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();