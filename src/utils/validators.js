export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email || '');
};

export const isValidPassword = (password, minLength = 6) => {
  return password && password.length >= minLength;
};
