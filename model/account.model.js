var db = require("../utils/mysql-db");

module.exports = function() {
    function add(entity){
        return db.add(`accounts`,entity);
    }
    function single(id){
        return db.load(`select * from accounts where id=${id}`);
    }
    function singleByUsername(username){
        return db.load(`select * from accounts where username like '${username}'`)
    }
    function update(entity){
        return db.update(`accounts`,`id`,entity);
    }

    return {
        add,
        single,
        singleByUsername,
        update
    }
}