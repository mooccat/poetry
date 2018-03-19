const path = require('path');
const assert = require('assert');

module.exports = class extends think.Controller {
  constructor(ctx) {
    super(ctx);
    this.resource = this.getResource();
    this.id = this.getId();
    assert(think.isFunction(this.model), 'this.model must be a function');
    this.modelInstance = this.mongoose(this.resource);
  }
  /**
   * get resource
   * @return {String} [resource name]
   */
  getResource() {
    const filename = this.__filename || __filename;
    const last = filename.lastIndexOf(path.sep);
    return filename.substr(last + 1, filename.length - last - 4);
  }
  getId() {
    const id = this.get('_id') || this.post('_id');
    if (id && (think.isString(id) || think.isNumber(id))) {
      return id;
    }
    const last = this.ctx.path.split('/').slice(-1)[0];
    if (last !== this.resource) {
      return last;
    }
    return '';
  }
  async getAction() {
    let data;
    let count;
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
    try {
      data = await this.modelInstance.find(param).limit(limit).skip(offset);
      count = await this.modelInstance.count(this.ctx.param());
      return this.success({ data: data, count: count });
    } catch (e) {
      this.status = 500;
      return this.fail(e);
    }
  }
};
