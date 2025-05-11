import React, { createContext } from "react";
export const AuthContext = createContext();
function AuthProvider({ children }) {
  const [authToken, setAuthToken] = React.useState("");
  const login = (newToken) => {
    setAuthToken(newToken);
    sessionStorage.setItem("token", newToken);
  };
  const logout = () => {
    setAuthToken(null);
    sessionStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
