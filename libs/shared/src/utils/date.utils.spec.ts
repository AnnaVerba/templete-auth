import { DateUtils } from './date.utils';
/**
 * DateUtils tests.
 */
describe('DateUtils testing', () => {
  it('should return valid date', () => {
    expect(typeof DateUtils.dateNow()).toEqual(typeof new Date());
  });

  it('should return correct date', () => {
    expect(DateUtils.dateParse('2021-10-11T21:00:00.000Z')).toEqual(new Date(Date.parse('2021-10-11T21:00:00.000Z')));
  });

  it('should return invalid(NaN) date', () => {
    expect(DateUtils.dateParse('asdf').toString()).toEqual(new Date(Number.NaN).toString());
  });
});
