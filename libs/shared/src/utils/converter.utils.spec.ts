import { ConverterUtils } from './converter.utils';
/**
 * ConverterUtils tests.
 */
describe('ConverterUtils testing', () => {
  describe('toBoolean testing', () => {
    it('should return true for true', () => {
      expect(ConverterUtils.toBoolean(true)).toEqual(true);
    });

    it('should return true for "true"', () => {
      expect(ConverterUtils.toBoolean('true')).toEqual(true);
    });

    it('should return false for false', () => {
      expect(ConverterUtils.toBoolean(false)).toEqual(false);
    });

    it('should return false for "false"', () => {
      expect(ConverterUtils.toBoolean('false')).toEqual(false);
    });

    it('should return false for non-string, non-boolean value', () => {
      expect(ConverterUtils.toBoolean({})).toEqual(false);
    });
  });

  describe('toKebabCase testing', () => {
    it('should return kebab-case for Kebab-Case', () => {
      expect(ConverterUtils.toKebabCase('Kebab-Case_T')).toEqual('kebab-case-t');
    });

    it('should return kebab-case for Snake_Case', () => {
      expect(ConverterUtils.toKebabCase('Snake_Case')).toEqual('snake-case');
    });

    it('should return kebab-case for snake_case', () => {
      expect(ConverterUtils.toKebabCase('snake_case')).toEqual('snake-case');
    });

    it('should return kebab-case from camelCase', () => {
      expect(ConverterUtils.toKebabCase('camelCase')).toEqual('camel-case');
    });

    it('should return kebab-case from PascalCase', () => {
      expect(ConverterUtils.toKebabCase('PascalCase')).toEqual('pascal-case');
    });

    it('should convert "Currency-GetCurrencyInfoByIdV2.get_currency_info_by_id_v2" to "currency-get-currency-info-by-id-v2.get-currency-info-by-id-v2"', () => {
      const commandKey = 'get_currency_info_by_id_v2';
      const serviceDiscoveryEndpointName = 'Currency-GetCurrencyInfoByIdV2';
      expect(ConverterUtils.toKebabCase(`${serviceDiscoveryEndpointName}.${commandKey}`)).toEqual(
        'currency-get-currency-info-by-id-v2.get-currency-info-by-id-v2',
      );
    });
  });
});
