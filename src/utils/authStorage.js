export const getStoredToken = () => localStorage.getItem("viyona_token");

export const getStoredUser = () => {
  const rawUser = localStorage.getItem("viyona_user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

export const setAuthSession = ({ token, user }) => {
  localStorage.setItem("viyona_token", token);
  localStorage.setItem("viyona_user", JSON.stringify(user));
};

export const clearAuthSession = () => {
  localStorage.removeItem("viyona_token");
  localStorage.removeItem("viyona_user");
};

export const getUserRole = () => {
  const user = getStoredUser();

  if (!user) {
    return null;
  }

  if (user.accountType === "admin") {
    return "admin";
  }

  return user.role || null;
};

export const isAuthenticated = () =>
  Boolean(getStoredToken() && getStoredUser());
