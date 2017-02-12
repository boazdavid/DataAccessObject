const BadRequestError = require('./BadRequestError');
const fs = require('fs');

module.exports = class FileDAO {

	constructor(resourceType, dir, nameFn, parseNameFn) {
		this.resourceType = resourceType;
		this.dir = dir;
		this.nameFn = nameFn;
		this.parseNameFn = parseNameFn;
	}

	setup(data) {
		return Promise.all(
			Object.keys(data).map(k=>
				this.put(k, data[k])
			)
		);
	}
	_name(id) {
		return `${this.dir}/${this.nameFn(id)}`;
	}

	get(id) {
		return new Promise((resolve, reject)=>{
			fs.readFile(this._name(id), 'utf8', (err, data)=>{
				if (err) {
					return reject(new BadRequestError(`resource ${this.resourceType} '${id}' does not exist`));
				}
				return resolve(JSON.parse(data));
			});
		});
	}

	put(id, obj) {
		return new Promise((resolve, reject)=>{
			fs.writeFile(this._name(id), JSON.stringify(obj, null, 2), 'utf8', (err)=>{
				if (err) {
					return reject(err);
				}
				return resolve();
			});
		});
	}
	
	remove(id) {
		return new Promise((resolve, reject)=>{
			fs.unlink(this._name(id), (err)=>{
				if (err) {
					return reject(err);
				}
				return resolve();
			});
		});
	}

	list() {
		return new Promise((resolve, reject)=>
			fs.readdir(this.dir, (err, files)=>{
				if (err) {
					return reject(err);
				}
				resolve(files.map(this.parseNameFn));
			})
		);
	}
};
