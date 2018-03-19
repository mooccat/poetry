module.exports = class extends think.Mongoose {
    get schema() {
        const schema = new think.Mongoose.Schema({
            "name":{type:String},
            "desc":String,
            "sort":String,
            "desc":String,
            "short_desc":String,
            "decade":String
        });
        return schema;
    }
};