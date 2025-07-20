import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
  logout: () => {}
});

export default AuthContext;