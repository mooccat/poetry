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
    try {
      data = await this.modelInstance.find(this.ctx.param());
      count = await this.modelInstance.count(this.ctx.param());
      return this.success(data);
    } catch (e) {
      this.status = 500;
      return this.fail(e);
    }
  }
  /**
   * put resource
   * @return {Promise} []
   */
  async postAction() {
    const data = this.post();
    if (think.isEmpty(data)) {
      return this.fail('data is empty');
    }
    try {
      const insertId = await this.modelInstance.create(data);
      // const insertId = await newInstance.save(data);
      return this.success(insertId);
    } catch (e) {
      if (e.code == 11000) {
        this.status = 400;
        return this.fail({
          errmsg: '已经存在相同的对象'
        });
      } else {
        this.status = 500;
        return this.fail(e);
      }
    }
  }
  /**
   * delete resource
   * @return {Promise} []
   */
  async deleteAction() {
    if (!this.id) {
      return this.fail('params error');
    }
    const pk = await this.modelInstance.pk;
    const rows = await this.modelInstance.remove({
      _id: this.id
    });
    return this.success({
      affectedRows: rows
    });
  }
  /**
   * update resource
   * @return {Promise} []
   */
  async putAction() {
    if (!this.id) {
      return this.fail('params error');
    }
    const pk = await this.modelInstance.pk;
    const data = this.post();
    delete data['_id'];
    if (think.isEmpty(data)) {
      return this.fail('data is empty');
    }
    try {
      const rows = await this.modelInstance.update({
        _id: this.id
      }, data);
      return this.success({
        affectedRows: rows
      });
    } catch (e) {
      if (e.code == 11000) {
        this.status = 400;
        return this.fail({
          errmsg: '已经存在同名的对象'
        });
      } else {
        this.status = 500;
        return this.fail(e);
      }
    }
  }
  __call() {

  }
};
