/* eslint-disable no-param-reassign */
export default (text, num) => {
  text = String(text);
  num = Number(num) || 2;
  if (text.substr(-1) === 's') {
    return num > 1 ? text : text.substr(0, text.length - 1);
  }
  return num > 1 ? `${text}s` : text;
};
