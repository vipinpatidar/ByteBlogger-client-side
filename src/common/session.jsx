export const storeInSession = (key, value) => {
  sessionStorage.setItem(key, value);
};

export const getFromSession = (key) => {
  return sessionStorage.getItem(key);
};

export const removeFromSession = (key) => {
  sessionStorage.removeItem(key);
};

export const clearSession = () => {
  sessionStorage.clear();
};
