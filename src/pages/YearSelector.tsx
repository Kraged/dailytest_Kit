import * as React from "react";
import { Routes, Route, useParams } from "react-router-dom";

import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const YearSelector = () => {
  return (
    <Routes>
      <Route path="users">
        <Route path=":userId">
          <div>hello there</div>
        </Route>
        <Route path="me">
          <div>bitch.</div>
        </Route>
      </Route>
    </Routes>
  );
};

export default YearSelector;
