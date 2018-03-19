module.exports = class extends think.Service {
    async loadingUserInfo(a) {
    //登录、注册不验证token
    if (a.ctx.action === 'loginAdmin' || a.ctx.action === 'loginup') {
      return;
    }
    // 获取http-header token
    const userToken = a.ctx.header.token;
    // 调用tokenservice中间件
    const tokenService = think.service('token');
    // 验证token
    const verifyTokenResult = tokenService.verifyToken(userToken);
    if (verifyTokenResult !== 'fail') {
      // 获取用户信息
      const user = verifyTokenResult;
      const userModel = a.mongoose('user', 'mongoose'); // use `mongoose` adapter type
      const data = await userModel.find({'email': user.email, 'token': userToken});
      if (data.length) {
        a.ctx.state.user = data[0];
      }
    }
  }
};
