import { ValidationUtils } from './validation.utils';
/**
 * ValidationUtils testing.
 */
describe('ValidationUtils testing', () => {
  it('should return false if value equals null', () => {
    const result = ValidationUtils.hasValue(null);
    expect(result).toBe(false);
  });
  it('should return true if value not equals null', () => {
    const result = ValidationUtils.hasValue('123');
    expect(result).toBe(true);
  });

  it('should return true for true', () => {
    const result = ValidationUtils.hasValue(true);
    expect(result).toBe(true);
  });

  it('should return true for false', () => {
    const result = ValidationUtils.hasValue(false);
    expect(result).toBe(true);
  });

  it('should return false if value is empty string', () => {
    const result = ValidationUtils.hasValue('');
    expect(result).toBe(false);
  });

  it('should return true for valid json schema', () => {
    const result = ValidationUtils.isValidJsonSchema(['string', 'number', 'array'], {
      key1: 5,
      key2: '5',
      key3: [1, '2', 3.5],
    });
    expect(result).toBe(true);
  });

  it('should throw error for invalid json schema', () => {
    try {
      ValidationUtils.isValidJsonSchema(['string', 'number'], { key1: 5, key2: '5', key3: {} });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
