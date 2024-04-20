import { createContext } from "react";
import { BAuthContext } from "../types";

export const AuthContext = createContext<BAuthContext | null>(null);
