export const array_sum = (array, start, length) => {
  return array.slice(start, length).reduce((prev, current) => prev + current);
};

export const get_line_length = (start, end) => {
  return start - end;
};
