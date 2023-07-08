import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { render } from "react-dom";
import { Router, useLocation } from "react-router-dom";
import { parseString } from "xml2js";

import { OutlinedInput, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "@component/styles/Home.module.css";
import Toolbar from "@mui/material/Toolbar";

// const inter = Inter({ subsets: ["latin"] });

const figmaTheme = createTheme({
  palette: {
    primary: {
      main: "#651fff",
    },
  },
});

export default function Home() {
  // fetch year
  const availableYear = ["106", "107", "108", "109", "110", "111"];
  const [getYear, setgetYear] = useState(availableYear[0] || "");
  const handleYearChange = (event: SelectChangeEvent) => {
    setgetYear(event.target.value);
  };

  // fetch county
  let [countyName, setcountyName] = useState<string[]>([]);
  let [getCounty, setgetCounty] = useState("" || "");
  const handleCountyChange = (event: SelectChangeEvent) => {
    const selectedValue = event.target.value;
    const selectedKey = countyCodes[countyName.indexOf(selectedValue)];
    setgetCounty(selectedValue);
    setgetTown(""); // Reset the townInput value to empty
    getAxiosTown(selectedKey);
  };
  // get as key
  let [countyCodes, setcountyCodes] = useState<string[]>([]);

  // fetch town
  let [townName, setTownName] = useState<string[]>([] || "");
  let [getTown, setgetTown] = useState("");
  const handleTownChange = (event: SelectChangeEvent) => {
    setgetTown(event.target.value);
  };

  const router = useRouter();
  const { year, county, town } = router.query;
  const handleClick = () => {
    const baseUrl = window.location.origin; // Get the base URL (e.g., http://localhost:3000)
    const url = `${baseUrl}/${getYear}/${getCounty}/${getTown}`;
    router.push(
      {
        pathname: router.pathname,
        query: {
          year: getYear,
          county: getCounty,
          town: getTown,
        },
      },
      url
    );

    // Additional logic if needed
    const pathName = window.location.pathname.split("/");

    console.log(pathName);
    // console.log(object)
  };

  const { query } = router;
  useEffect(() => {
    const { year, county, town } = query;
    if (year && county && town) {
      setgetYear(year as string);
      setgetCounty(county as string);
      setgetTown(town as string);
      console.log(getYear, getCounty, getTown);
    }
  }, [query]);
  // useEffect(() => {
  //   const pathName = window.location.pathname.split("/");

  //   console.log(pathName);

  //   setgetYear(pathName[1]);
  //   setgetCounty(pathName[2]);
  //   setgetTown(pathName[3]);
  //   console.log(getYear, getCounty, getTown);
  // }, [getCounty, getTown, getYear]);

  const [btnAble, setbtnAble] = useState(true);

  let [householdSingleIntM, sethouseholdSingleIntM] = useState<string[]>([]);
  let [householdSingleIntF, sethouseholdSingleIntF] = useState<string[]>([]);
  let [householdOrdinIntM, sethouseholdOrdinIntM] = useState<string[]>([]);
  let [householdOrdinIntF, sethouseholdOrdinIntF] = useState<string[]>([]);

  let [householdSingleSumM, sethouseholdSingleSumM] = useState(0);
  let [householdSingleSumF, sethouseholdSingleSumF] = useState(0);
  let [householdOrdinSumM, sethouseholdOrdinSumM] = useState(0);
  let [householdOrdinSumF, sethouseholdOrdinSumF] = useState(0);

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "My chart",
    },
    series: [
      {
        data: [1, 2, 3],
      },
    ],
  };

  const getAxiosTown = (selectedCountyCodes: string) => {
    axios
      .get(`https://api.nlsc.gov.tw/other/ListTown/${selectedCountyCodes}`)
      .then((response) => {
        const xmlData = response.data;
        // Parse the XML data into a JavaScript object
        parseString(xmlData, (err, result) => {
          if (err) {
            console.error("Error parsing XML:", err);
            return;
          }
          const townItem = result.townItems.townItem;
          townName = townItem.map((item: any) => item.townname[0]);
          setTownName(townName);
          console.log("Axios' printing: ", townName);
        });
      })
      .catch((error) => {
        console.error("Error fetching XML data:", error);
      });
  };

  const getAxiosCharts = (
    getYear: string,
    getCounty: string,
    getTown: string
  ) => {
    axios
      .get(
        `https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/${getYear}?COUNTY=${getCounty}&TOWN=${getTown}`
      )
      .then((response) => {
        const responseData = response.data.responseData;
        console.log("Axios' printing: ", responseData);
        sethouseholdOrdinIntM(
          responseData.map(
            (item: { household_ordinary_m: string }) =>
              item.household_ordinary_m
          )
        );
        sethouseholdOrdinIntF(
          responseData.map(
            (item: { household_ordinary_f: string }) =>
              item.household_ordinary_f
          )
        );
        sethouseholdSingleIntM(
          responseData.map(
            (item: { household_single_m: string }) => item.household_single_m
          )
        );
        sethouseholdSingleIntF(
          responseData.map(
            (item: { household_single_f: string }) => item.household_single_f
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const countyCodesRef = useRef<string[]>([]);
  const countyNameRef = useRef<string[]>([]);
  useEffect(() => {
    axios
      .get("https://api.nlsc.gov.tw/other/ListCounty")
      .then((response) => {
        const xmlData = response.data;
        parseString(xmlData, (err, result) => {
          if (err) {
            console.error("Error parsing XML:", err);
            return;
          }
          const countyItems = result.countyItems.countyItem;
          countyCodesRef.current = countyItems.map(
            (item: any) => item.countycode[0]
          );
          countyNameRef.current = countyItems.map(
            (item: any) => item.countyname[0]
          );
          setcountyName((prevNames) => countyNameRef.current);
          setcountyCodes((prevCodes) => countyCodesRef.current);
          // setgetAll((prevState) => {
          //   const newArray = [...prevState]; // Create a new array using the spread operator
          //   newArray[1] = "true"; // Update the value at in_dex 1
          //   return newArray; // Return the updated array
          // });
          // console.log(getAll);
          // // console.log("Axios' printing: ", countyCodes, countyName);
        });
      })
      .catch((error) => {
        console.error("Error fetching XML data:", error);
      });
  }, []);

  useEffect(() => {
    console.log(getCounty.length === 0 && getTown.length === 0);
    if (getCounty.length !== 0 && getTown.length !== 0) {
      setbtnAble(false);
    }
  }, [getCounty, getTown]);

  useEffect(() => {
    if (householdOrdinIntM.length > 0) {
      sethouseholdOrdinSumM(
        householdOrdinIntM.reduce((sum: number, item: string) => {
          return (sum += parseInt(item));
        }, 0)
      );
    }
    if (householdOrdinIntF.length > 0) {
      sethouseholdOrdinSumF(
        householdOrdinIntF.reduce((sum: number, item: string) => {
          return (sum += parseInt(item));
        }, 0)
      );
    }
    if (householdSingleIntM.length > 0) {
      sethouseholdSingleSumM(
        householdSingleIntM.reduce((sum: number, item: string) => {
          return (sum += parseInt(item));
        }, 0)
      );
    }
    if (householdSingleIntF.length > 0) {
      sethouseholdSingleSumF(
        householdSingleIntF.reduce((sum: number, item: string) => {
          return (sum += parseInt(item));
        }, 0)
      );
    }
    console.log(
      "Check array in Effect: ",
      householdOrdinIntM,
      householdOrdinIntF,
      householdSingleIntM,
      householdSingleIntF,
      "\nCheck sum   in Effect: ",
      householdOrdinSumM,
      householdOrdinSumF,
      householdSingleSumM,
      householdSingleSumF
    );
  }, [
    householdOrdinIntF,
    householdOrdinIntM,
    householdOrdinSumF,
    householdOrdinSumM,
    householdSingleIntF,
    householdSingleIntM,
    householdSingleSumF,
    householdSingleSumM,
  ]);

  return (
    <>
      {/* <Router> */}
      <Head>
        <title>Kit Chan - DailyViewTest</title>
        {/* <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main>
        <ThemeProvider theme={figmaTheme}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" className="grow" aria-label="appBarLogo">
                LOGO
              </Typography>
              <SettingsIcon />
            </Toolbar>
          </AppBar>
        </ThemeProvider>
        <Box className="bg-white w-full h-full fixed">
          <Typography
            className={styles.backgroundDiv}
            aria-label="backgroundCounty"
          >
            TAIWAN
          </Typography>
          <Typography component="div" className="text-center pb-10 pl-24">
            <Typography
              className="pt-5 pb-10 "
              variant="h4"
              fontWeight="bold"
              aria-label="contentTitle"
            >
              人口數、戶數按戶別及性別統計
            </Typography>
            {/* Year */}
            <FormControl sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="yearInput" shrink>
                年份
              </InputLabel>
              <Select
                id="yearInput"
                label="年份"
                value={getYear}
                onChange={handleYearChange}
              >
                {availableYear.map((theYear: string, index: number) => (
                  <MenuItem key={index} value={theYear}>
                    {theYear}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* County */}
            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel id="countyInput" shrink>
                縣/市
              </InputLabel>
              <Select
                id="countyInput"
                label="縣/市"
                displayEmpty
                value={getCounty || ""}
                onChange={handleCountyChange}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography className="text-gray-400">
                        請選擇 縣/市
                      </Typography>
                    );
                  }
                  return selected;
                }}
                inputProps={{ "aria-label": "Without label" }}
                className="text-left not-italic"
              >
                {countyName.map((county: string, index: number) => (
                  <MenuItem key={countyCodes[index]} value={county}>
                    {county}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Town */}
            <FormControl sx={{ m: 1, width: 200, paddingBottom: 5 }}>
              <InputLabel id="townInput" shrink>
                區
              </InputLabel>
              <Select
                id="townInput"
                label="區"
                displayEmpty
                value={getTown || ""}
                onChange={handleTownChange}
                renderValue={(selected) => {
                  if (!selected) {
                    return (
                      <Typography className="text-gray-400">
                        請先選擇 縣/市
                      </Typography>
                    );
                  }
                  return selected;
                }}
                inputProps={{ "aria-label": "Without label" }}
                className="text-left not-italic"
                disabled={!getCounty} // Disable townInput when countyInput is empty
              >
                {townName.map((townName: string, index: number) => (
                  <MenuItem key={index} value={townName}>
                    {townName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              className="bg-[#1565c0] p-3 mt-3 w-[7%] text-base"
              disabled={btnAble}
              onClick={handleClick}
            >
              SUMBIT
            </Button>
            <Divider
              className="w-[70%]"
              sx={{
                mx: "auto", // Align center horizontally
                "::before": {
                  borderTop: "thin solid #c29fff",
                },
                "::after": {
                  borderTop: "thin solid #c29fff",
                },
              }}
            >
              <Chip
                label="搜索結果"
                variant="outlined"
                sx={{
                  color: "#c29fff",
                  borderColor: "#c29fff",
                }}
              />
            </Divider>
            <Typography className="text-4xl pt-12">
              {getYear}年 {getCounty} {getTown}
              {/* <div>
                <HighchartsReact highcharts={Highcharts} options={options} />
              </div> */}
            </Typography>
          </Typography>
        </Box>
      </main>
      {/* </Router> */}
    </>
  );
}
