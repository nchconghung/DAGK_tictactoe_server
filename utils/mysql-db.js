var mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
        host: 'remotemysql.com',
        port: 3306,
        user: 'MIiDkQ9UOD',
        password: '3VX6ClYWV6',
        database: 'MIiDkQ9UOD'
    });
}

module.exports={
    load: sql => {
        return new Promise((resolve,reject)=>{
            var conn = createConnection();
            conn.connect();
            conn.query(sql,(error,result,fields)=>{
                if (error){
                    reject(error);
                } else{
                    resolve(result);
                }
            });
            conn.end();
        });
    },
    add: (tableName,entity) => {
        return new Promise((resolve,reject)=> {
            var sql = `insert into ${tableName} set ?`;
            var conn = createConnection();
            conn.connect();
            conn.query(sql,entity,(error,value) => {
                if (error){
                    reject(error);
                } else{
                    resolve(value.insertId);
                }
            });
            conn.end();
        })
    }
}