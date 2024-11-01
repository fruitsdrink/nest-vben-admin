import { pinyinHelper } from './pinyin';

describe('pinyin', () => {
  it('拼音首字母', () => {
    const str = '拼音首字母';
    const py = pinyinHelper.getFirstChar(str);
    expect(py).toEqual('pyszm');
  });

  it('英文', () => {
    const str = 'test';
    const py = pinyinHelper.getFirstChar(str);
    expect(py).toEqual('test');
  });

  it('数字', () => {
    const str = '123';
    const py = pinyinHelper.getFirstChar(str);
    expect(py).toEqual('123');
  });

  it('英文+数字', () => {
    const str = 'test123';
    const py = pinyinHelper.getFirstChar(str);
    expect(py).toEqual('test123');
  });

  it('中文+英文+数字', () => {
    const str = '测试test123';
    const py = pinyinHelper.getFirstChar(str);
    expect(py).toEqual('cstest123');
  });
});
