import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import theme from "./theme";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { GlobalContextProvider } from "./context/GlobalContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <QueryClientProvider client={queryClient}>
        <GlobalContextProvider>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </GlobalContextProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
