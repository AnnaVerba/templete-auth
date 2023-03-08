import { ArrayUtils } from './array.utils';
/**
 * ArrayUtils testing.
 */
describe('ArrayUtils testing', () => {
  it('should return true if array is empty', () => {
    const result = ArrayUtils.isEmptyArray([]);
    expect(result).toBe(true);
  });
  it('should return true if array is not empty', () => {
    const result = !ArrayUtils.isEmptyArray([1, 2, 3]);
    expect(result).toBe(true);
  });
});
