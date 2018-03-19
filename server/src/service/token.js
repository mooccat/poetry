// 引入jwt
const jwt = require('jsonwebtoken');
// 读取secret标记码
const secret = think.config('token.secret');
const expiresIn = think.config('token.expiresIn');
module.exports = class extends think.Service {
  createToken(userinfo) {
    const result = jwt.sign(userinfo, secret, {'expiresIn': expiresIn});
    return result;
  }
  verifyToken(token) {
    if (token) {
      try {
        const result = jwt.verify(token, secret);
        return result;
      } catch (err) {
        return 'fail';
      }
    }
    return 'fail';
  }
};
