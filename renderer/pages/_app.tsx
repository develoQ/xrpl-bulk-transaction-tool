import React from "react";
import type { AppProps } from "next/app";

import "../styles/globals.css";
import { ToolStateContexttProvider } from "../context/ToolStateContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ToolStateContexttProvider>
      <Component {...pageProps} />
    </ToolStateContexttProvider>
  );
}

export default MyApp;
