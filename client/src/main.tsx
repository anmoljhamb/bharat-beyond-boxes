import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AuthProvider from "./providers/AuthProvider.tsx";
import { MessageProvider } from "./providers/MessageProvider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <MessageProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </MessageProvider>
  </>,
);
