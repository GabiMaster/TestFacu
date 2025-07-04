import { AuthContext } from "@/src/utils/contexts/AuthContext";
import { useContext } from "react";

export const useAuth = () => useContext(AuthContext);