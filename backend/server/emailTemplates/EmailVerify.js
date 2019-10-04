// eslint-disable-next-line import/prefer-default-export
export const EmailVerifyTemplate = (to, process, userId) => {
  return {
    from: "libraryGPbot@libraryGP.com",
    to,
    subject: "LibraryGP. Подтверждение e-mail адреса.",
    text: `Для подтверждения адреса перейдите по данной ссылке: ${process.CORS_LINK}/emailVerify?token=${userId}`
  };
};
