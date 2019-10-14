var mysql = require('mysql');

var createConnection = () => {
    return mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'maudoden',
        database: 'btcn06-db'
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