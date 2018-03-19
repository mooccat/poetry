let bcrypt = require('bcrypt');
const saltRounds = think.config("bcrypt.salt");
module.exports = class extends think.Service {
    hashPassword(password) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const result = bcrypt.hashSync(password, salt);
        return result;
    }
    compare(password, hash) {
        let res = bcrypt.compareSync(password, hash);
        return res;
    }
};