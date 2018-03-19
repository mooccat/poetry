module.exports = class extends think.Mongoose {
    get schema() {
        const schema = new think.Mongoose.Schema({
            nickName: String,
            gender: String,
            language: String,
            city: String,
            province: String,
            country: String,
            avatarUrl: String,
            token: String,
            session_key: String,
            openid: {
                type: String, required: true,
                unique: true
            },
            more:{}
        });
        return schema;
    }
};