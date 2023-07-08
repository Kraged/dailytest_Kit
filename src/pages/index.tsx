import Head from "next/head";

import { ThemeProvider, createTheme } from "@mui/material/styles";

import DataRetriever from "./DataRetriever";

// const inter = Inter({ subsets: ["latin"] });

const figmaTheme = createTheme({
  palette: {
    primary: {
      main: "#651fff",
    },
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={figmaTheme}>
      <DataRetriever des="Home" />
    </ThemeProvider>
  );
}
