export const transformEmail = ({ value }): string => value?.toLowerCase().trim();

export const transformStringToFloat = ({ value }): number | string => {
  const transformedValue = Number.parseFloat(value);
  if (!transformedValue) {
    return Number.parseFloat(value?.split(',').join('.'));
  }
  return transformedValue;
};

export const transformStringToInt = ({ value }): number => Number.parseInt(value);
