import { describe } from 'mocha'
import { expect } from 'chai';

const extractor = (path: string) => {
  if (!path) {
    return '';
  }
  if (path.includes('img/images/user')) {
    const match = /([a-zA-Z0-9_\-]+)\/profile.png$/gm.exec(path);
    if (match) {
      return match[1];
    }
  } else {
    const step1 = path.split('/');
    const step2 = step1[3].split('_');
    step2.pop();
    step2.pop();
    return step2.join('_');
  }
  return path;
};

describe('extract_id', function () {
  it('string.includes', function () {
    expect('../img/images/user/chamdare/profile.png'.includes('/img/images/user')).equal(true);
  });
  it('type_1', function () {
    const path = '../img/images/user/chamdare/profile.png';
    const result = extractor(path);
    expect(result).equal('chamdare');
  });
  it('type_2', function () {
    const path = '../img/images/user/miracle0k/profile.png';
    const result = extractor(path);
    expect(result).equal('miracle0k');
  });
  it('type_3', function () {
    const path = '../img/images/user/pigcat_/profile.png';
    const result = extractor(path);
    expect(result).equal('pigcat_');
  });
  it('type_4', function () {
    const path = '../img/images/user/myoboe-/profile.png';
    const result = extractor(path);
    expect(result).equal('myoboe-');
  });
  it('type_5', function () {
    const path = '../img/20130526_55/tilly_1369526556502SLyCX_PNG/original_profile.s75.png';
    const result = extractor(path);
    expect(result).equal('tilly');
  });
});