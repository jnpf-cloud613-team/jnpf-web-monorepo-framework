export const isValidComponentSize = (val: string): boolean => {
  return ['', 'default', 'large', 'small'].includes(val);
};
