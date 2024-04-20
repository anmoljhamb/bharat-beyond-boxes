export const showMessage = (message: string) => {
  alert(message);
};

export const uploadImage = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};
