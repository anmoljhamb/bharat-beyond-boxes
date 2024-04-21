import { createContext } from "react";
import { MessageContextInterface } from "../types";

export const MessageContext = createContext<MessageContextInterface | null>(
  null,
);
