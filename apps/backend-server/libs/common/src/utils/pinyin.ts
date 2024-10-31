import { pinyin } from 'pinyin-pro';

/**
 * 获取字符串的生母首字母
 * @param str
 */
const getFirstChar = (str: string) => {
  const py = pinyin(str, {
    pattern: 'first',
    type: 'array',
    nonZh: 'spaced',
  });
  return py.join('');
};

export const pinyinHelper = {
  getFirstChar,
};
