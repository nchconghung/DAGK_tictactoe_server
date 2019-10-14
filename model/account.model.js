var db = require("../utils/mysql-db");

module.exports = {
    add: entity => {
        return db.add(`accounts`,entity);
    },
    single: id => {
        return db.load(`select * from accounts where Id=${id}`);
    }
}