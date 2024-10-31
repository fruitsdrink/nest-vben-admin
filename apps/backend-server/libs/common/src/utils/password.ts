import { passwordScorer } from 'password-scorer';

/**
 * 密码强度
 * @param password 密码
 * @returns 返回密码强度
 */
const passwordStrength = (password: string) => {
  const res = passwordScorer(password);
  let id = 0;
  switch (res.score) {
    case 0: {
      id = 0;
      break;
    }
    case 20: {
      id = 1;
      break;
    }
    case 40: {
      id = 2;
      break;
    }
    case 60: {
      id = 3;
      break;
    }
    case 80: {
      id = 4;
      break;
    }
    case 100: {
      id = 5;
      break;
    }
    default: {
      id = 0;
      break;
    }
  }

  return {
    id,
    ...res,
  };
};

export const passwordHelper = {
  passwordStrength,
};
