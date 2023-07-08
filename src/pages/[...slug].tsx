import Head from "next/head";

import { createTheme } from "@mui/material/styles";

import DataRetriever from "./DataRetriever";

// Define the types for the slug array
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
// Define the component
const SlugPage: React.FC<SlugProps> = ({ slug }) => {
  return (
    // Your JSX/HTML code
    <>
      <DataRetriever des="" />
    </>
  );
};

export default SlugPage;
