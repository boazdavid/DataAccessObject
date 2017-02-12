process.env.tests = true;

const assert = require('chai').assert;
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const fs = require('fs');
const path = require('path');
const tmpDir = 'tmp';
const FileDao = require('../src/FileDAO');

const deleteFolderRecursive = (path) => {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

describe('FileDao', () => {

	before(() =>{
		console.log('before');
		return new Promise((resolve, reject)=>
			fs.mkdtemp(tmpDir, (err, folder) => {
				if (err) reject(err);
				console.log(folder);
				this.folder = folder;
				resolve();
			})
		);
	});
	after(() =>{
		console.log('after')
		return deleteFolderRecursive(this.folder);
	});

	it('CRUD', () => {
		const dao = new FileDao('CAR', this.folder, id=>`${id}.json`, nm=>nm.substr(0, nm.indexOf('.json')));
		
		const car = {size:4, owner:{ id: 'abc'}};
		const carId = 12;
		return dao.put(carId, car).then(()=>{
			const filePath = `${this.folder}${path.sep}${carId}.json`;
			assert(fs.existsSync(filePath));//file created
			return dao.list().then(([nm1])=>{
				assert.equal(nm1, carId);
				return dao.get(carId)
				.then(obj=>{
					assert.equal(car.size, obj.size);
					assert.equal(car.owner.id, obj.owner.id);
					return dao.remove(carId)
					.then(()=>{
						assert(!fs.existsSync(filePath));
						return dao.list().then(nms=>{
							assert.equal(nms.length, 0);
						})
					})
				});
			});
		});

	});

});
