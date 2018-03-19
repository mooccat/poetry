module.exports = class extends think.Mongoose {
    get schema() {
        const schema = new think.Mongoose.Schema({
            "strains": [],
            "author": String,
            "sort": String,
            "decade": String,
            "paragraphs": [],
            "title": String
        });
        return schema;
    }
};