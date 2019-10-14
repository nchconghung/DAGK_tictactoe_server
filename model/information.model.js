var db = require('../utils/mysql-db');

module.exports={
    add: entity => {
        return db.add(`informations`,entity);
    },
    singleByAccount: account =>{
        return db.load(`select * from informations where account = ${account}`);
    }
}