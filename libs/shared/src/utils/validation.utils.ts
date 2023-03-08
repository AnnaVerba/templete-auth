import { Validator as JsonValidator } from 'jsonschema';
/**
 * @class ValidationUtils provides validation helper functions.
 */
export const ValidationUtils = {
  /**
   * Checks argument for having value
   *
   * @function
   * @param value argument that should be checked for having value
   * @returns {Boolean}
   */
  hasValue(value: unknown): boolean {
    return value !== null && value !== undefined && value !== '';
  },

  /**
   * isValidJsonSchema - validates json against validation schema.
   *
   * @function
   * @param {Array} validateSchema - array of valid value types.
   * @returns {Boolean} - returns true for valid schema.
   * @throws {Error} - throws error for invalid schema.
   */
  isValidJsonSchema<T>(validationSchema: string[], data: Record<string, T>): boolean {
    const validator = new JsonValidator();
    const schema = {
      type: 'object',
      patternProperties: {
        '[sS]*': {
          type: validationSchema,
        },
      },
    };
    const result = validator.validate(data, schema);
    if (result?.errors.length) {
      throw new Error(JSON.stringify(result.errors));
    }
    return true;
  },
};
