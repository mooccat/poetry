const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }
  async searchAction(){
    let data;
    let param = this.ctx.param()
    let limit = 10
    let offset = 0
    if (param.limit) {
      limit = parseInt(param.limit)
      delete param.limit
    }
    if (param.offset) {
      offset = parseInt(param.offset)
      delete param.offset
    }
    let searchStr = this.ctx.param('searchStr')
    const reg = new RegExp(searchStr, 'i')
    let condition  = {
      $or : [ 
          {title : {$regex : reg}},
          {author : {$regex : reg}}
      ]
  }
    let poetryModel = this.mongoose('poetries', 'mongoose')
    let poeries = await poetryModel.find(condition).limit(limit).skip(offset)
    let count = await poetryModel.count(condition)
    this.success({ data: poeries, count: count })
  }
  // async getAction() {
  //   let param = this.ctx.param()
  //   let limit = 10
  //   let offset = 0
  //   if (param.limit) {
  //     limit = parseInt(param.limit)
  //     delete param.limit
  //   }
  //   if (param.offset) {
  //     offset = parseInt(param.offset)
  //     delete param.offset
  //   }
  //   let poetryModel = this.mongoose('poetries', 'mongoose')
  //   let poeries = await poetryModel.find(param).limit(limit).skip(offset)
  //   let count = await poetryModel.count(param)
  //   this.success({ poeries: poeries, count: count })
  // }
};
