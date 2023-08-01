const getToken = (): String | null => {
  const authToken = localStorage.getItem("authToken");
  if (authToken) return authToken;
  return null;
};

export const token = getToken();
