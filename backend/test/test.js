import { equal } from 'assert';
describe('DB', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      equal([1, 2, 3].indexOf(4), -1);
    });
  });
});