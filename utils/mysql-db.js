var mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
        host: 'remotemysql.com',
        port: 3306,
        user: 'RgfLF8H2GX',
        password: 'VoMbegRP2K',
        database: 'RgfLF8H2GX'
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
    },
    update: (tableName, idField, entity) => {
        return new Promise((resolve, reject) => {
          var id = entity[idField];
          delete entity[idField];
    
          var sql = `update ${tableName} set ? where ${idField} = ` + id;
          var connection = createConnection();
          connection.connect();
          connection.query(sql, [entity], (error, value) => {
            if (error) {
              reject(error);
            } else {
              resolve(value.changedRows);
            }
            connection.end();
          });
        });
      },
}