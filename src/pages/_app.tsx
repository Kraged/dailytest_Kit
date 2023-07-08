import type { AppProps } from "next/app";

import "@component/styles/globals.css";
import "@component/styles/Home.module.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
