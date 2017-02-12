const BadRequestError = require('./BadRequestError');

module.exports = class MemDAO {

	constructor(resourceType) {
		this.resourceType = resourceType;
		this._items = new Map();
	}

	setup(data) {
		this._items.clear();
		return Promise.all(
			Object.keys(data).map(key=>
				this.put(key, data[key])
			)
		);
	}

	get(id) {
		return new Promise((resolve, reject)=>{
			if (this._items.has(id)) {
				return resolve(this._items.get(id));
			}
			return reject(new BadRequestError(`resource ${this.resourceType} '${id}' does not exist`));
		});
	}

	put(id, obj) {
		this._items.set(id, obj);
		return Promise.resolve();
	}
	
	remove(id) {
		this._items.delete(id);
		return Promise.resolve();
	}

	list() {
		return Promise.resolve(Array.from(this._items.keys()));
	}

};
