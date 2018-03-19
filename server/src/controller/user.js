const rp = require('request-promise-native');
const Base = require('./base.js');
const tokenService = think.service('token');
const APPID = think.config('weixin.appId')
const SECRET = think.config('weixin.secretId')

module.exports = class extends Base {
    indexAction() {
        this.ctx.success()
    }
    async weLoginAction() {
        try {
            let info = this.post()
            const JSCODE = info.code
            let url = ' https://api.weixin.qq.com/sns/jscode2session?appid=' + APPID + '&secret=' + SECRET + '&js_code=' + JSCODE + '&grant_type=authorization_code'
            const option = {
                url: url
            }
            let userInterface = await rp.get(option)
            let data = {}
            data = info.userInfo
            let userModel = this.mongoose('user', 'mongoose')
            data.session_key = JSON.parse(userInterface).session_key
            data.openid = JSON.parse(userInterface).openid
            let user = await userModel.find({ openid: data.openid }, { session_key: 0 })
            if(user.length>0){
                this.success(user[0])
            }else{
                const token = tokenService.createToken({
                    'openid': data.openid
                })
                data.token = token
                let userModel = this.mongoose('user', 'mongoose')
                let user = new userModel(data)
                let res = await user.save()
                res = res.toObject()
                delete res.session_key
                this.success(res)
            }
        } catch (error) {
            this.ctx.status = 500
            this.fail(error)
        }
    }
}
