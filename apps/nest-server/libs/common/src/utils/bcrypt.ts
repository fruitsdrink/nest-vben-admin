import bcrypt from 'bcryptjs';

/**
 * 加密字符串
 * @param val 需要加密的字符串
 * @returns
 */
const hash = (val: string) => {
  return bcrypt.hashSync(val, bcrypt.genSaltSync(10));
};

/**
 * 比较字符串和哈希值
 * @param val 字符串
 * @param hash 哈希值
 * @returns
 */
const compare = (val: string, hash: string) => {
  return bcrypt.compareSync(val, hash);
};

export { hash, compare };
