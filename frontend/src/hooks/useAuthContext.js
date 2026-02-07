import { useContext } from "react";
import { AuthContext } from "../context/index";

export const useAuthContext = () => useContext(AuthContext);
