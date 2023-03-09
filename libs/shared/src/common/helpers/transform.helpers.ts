export const transformEmail = ({ value }): string => value?.toLowerCase().trim();
export const transformStringToInt = ({ value }): number => Number.parseInt(value);
