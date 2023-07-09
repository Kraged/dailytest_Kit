import Head from "next/head";

import { createTheme } from "@mui/material/styles";

import DataRetriever from "./DataRetriever";

type SlugProps = {
  slug: string[];
};
const figmaTheme = createTheme({
  palette: {
    primary: {
      main: "#651fff",
    },
  },
});

const SlugPage: React.FC<SlugProps> = ({ slug }) => {
  return (
    <>
      <DataRetriever des="" />
    </>
  );
};

export default SlugPage;
