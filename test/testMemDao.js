process.env.tests = true;

const assert = require('chai').assert;
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const MemDao = require('../src/MemDAO');

describe('MemDao', () => {

	before(() =>{
		console.log('before');
	});
	after(() =>{
		console.log('after');
	});

	it('CRUD', () => {
		const dao = new MemDao('CAR');
		
		const car = { size: 4, owner: { id: 'abc' } };
		const carId = 12;
		return dao.put(carId, car).then(()=>{
			return dao.list().then(([nm1])=>{
				assert.equal(nm1, carId);
				return dao.get(carId)
				.then(obj=>{
					assert.equal(car.size, obj.size);
					assert.equal(car.owner.id, obj.owner.id);
					return dao.remove(carId)
					.then(()=>{
						return dao.list().then(nms=>{
							assert.equal(nms.length, 0);
						});
					});
				});
			});
		});
	});

	it('BadReq', () => {
		const dao = new MemDao('CAR');
		return assert.isRejected(dao.get(123));
	});

});
