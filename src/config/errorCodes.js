export const ERROR_KEYS = {
  errorToken1: 'ERR_ACCESS_BY_TOKEN_1',
  errorToken2: 'ERR_ACCESS_BY_TOKEN_2',
  internalErr500: 'ERR_INTERNAL_ERR_500',
  wrongAuthCred: 'ERR_WRONG_AUTH_CRED',
};

export const ERROR_INSTR = {
  [ERROR_KEYS.errorToken1]: {
    ru: 'Токен не был получен.',
    en: '',
  },
  [ERROR_KEYS.errorToken2]: {
    ru: 'Не удалось проверить токен.',
    en: '',
  },
  [ERROR_KEYS.internalErr500]: {
    ru: 'Внутренняя ошибка. Пожалуйста, попробуйте еще раз.',
    en: '',
  },
  [ERROR_KEYS.wrongAuthCred]: {
    ru: 'Не правильный e-mail или пароль.',
    en: '',
  },
};
