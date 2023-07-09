import axios from "axios";
import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { parseString } from "xml2js";

import { Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "@component/styles/Home.module.css";
import Toolbar from "@mui/material/Toolbar";

const figmaTheme = createTheme({
  palette: {
    primary: {
      main: "#651fff",
    },
  },
});

const DataRetriever = ({ des }: { des: string }) => {
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

  const [loadingCharts, setLoadingCharts] = useState(false);
  const loadingScreen = () => {
    setLoadingCharts(true);
  };

  const handleClick = (des: string) => {
    getAxiosCharts(getYear, getCounty, getTown);
    loadingScreen();
    setLoadingCharts(!loadingCharts);
    setTimeout(() => {
      getCallColCharts(true);
      getCallPieCharts(true);
      const baseUrl = window.location.origin;
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
    }, 1400);
  };

  useEffect(() => {
    if (loadingCharts) {
      const timer = setTimeout(() => {
        setLoadingCharts(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [loadingCharts]);

  const [btnAble, setbtnAble] = useState(true);

  let [householdOrdinTotalInt, sethouseholdOrdinTotalInt] = useState<string[]>(
    []
  );
  let [householdSingleTotalInt, sethouseholdSingleTotalInt] = useState<
    string[]
  >([]);
  let [householdSingleIntM, sethouseholdSingleIntM] = useState<string[]>([]);
  let [householdSingleIntF, sethouseholdSingleIntF] = useState<string[]>([]);
  let [householdOrdinIntM, sethouseholdOrdinIntM] = useState<string[]>([]);
  let [householdOrdinIntF, sethouseholdOrdinIntF] = useState<string[]>([]);

  let [householdOrdinTotalSum, sethouseholdOrdinTotalSum] = useState(0);
  let [householdSingleTotalSum, sethouseholdSingleTotalSum] = useState(0);
  let [householdSingleSumM, sethouseholdSingleSumM] = useState(0);
  let [householdSingleSumF, sethouseholdSingleSumF] = useState(0);
  let [householdOrdinSumM, sethouseholdOrdinSumM] = useState(0);
  let [householdOrdinSumF, sethouseholdOrdinSumF] = useState(0);

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
        });
      })
      .catch((error) => {
        console.error(
          "Error fetching XML getAxiosTown data:",
          selectedCountyCodes,
          error
        );
      });
  };

  const [optionsCol, setOptionsCol] = useState({
    chart: {
      type: "column",
      backgroundColor: "transparent",
      marginLeft: 60,
      marginRight: 10,
      spacingTop: 100,
      height: "600px",
    },
    title: {
      text: "人口數統計",
      floating: true,
      y: -70,
      style: {
        fontSize: "24px",
      },
    },
    yAxis: {
      title: {
        text: "數量",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          margin: "0",
          padding: "0",
        },
        align: "high",
        rotation: 0,
        y: -30,
        x: 50,
      },
    },
    xAxis: {
      categories: ["共同生活", "獨立生活"],
      title: {
        text: "型態",
        style: {
          fontSize: "16px",
          fontWeight: "bold",
        },
      },
    },
    series: [
      {
        name: "男性",
        data: [0],
      },
      {
        name: "女性",
        data: [0],
      },
    ],
    plotOptions: {
      column: {
        dataLabels: {
          enabled: true,
          format: "{point.y}",
          style: {
            fontSize: "20px",
          },
        },
      },
    },
  });

  const [optionsPie, setOptionsPie] = useState({
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },
    title: {
      text: "戶數統計",
      style: {
        fontSize: "24px",
        paddingTop: "8px",
        paddingLeft: "0px",
      },
    },
    series: [
      {
        name: "共同生活",
        data: [
          { name: "hi", y: 0 },
          { name: "bye", y: 88 },

          //   [householdOrdinTotalSum.toString(), 123],
          //   [householdSingleTotalSum.toString(), 456],
        ],
      },
    ],
    tooltip: {
      pointFormat: "{series.name}: <b>{point.y}</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        colors: ["#626eb2", "#a3b1ff"], // Customize the colors here
        dataLabels: {
          enabled: true,
          format: "{point.y}",
          style: {
            fontSize: "20px",
          },
        },

        showInLegend: true,
      },
    },
  });

  const [callColCharts, getCallColCharts] = useState(false);
  const [callPieCharts, getCallPieCharts] = useState(false);
  const updateOptions = (
    ordinSumM: number,
    ordinSumF: number,
    ordinTotal: number,
    singleSumM: number,
    singleSumF: number,
    singleTotal: number
  ) => {
    setOptionsCol((prevOptions) => ({
      ...prevOptions,
      series: [
        {
          name: "男性",
          data: [ordinSumM, singleSumM],
          color: "#7d5fb2",
        },
        {
          name: "女性",
          data: [ordinSumF, singleSumF],
          color: "#c29fff",
        },
      ],
    }));
    setOptionsPie((prevOptions) => ({
      ...prevOptions,
      series: [
        {
          name: "戶數統計",
          data: [
            { name: "共同生活", y: ordinTotal },
            { name: "獨立生活", y: singleTotal },
          ],
        },
      ],
    }));
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
        sethouseholdOrdinTotalInt(
          responseData.map(
            (item: { household_ordinary_total: string }) =>
              item.household_ordinary_total
          )
        );
        sethouseholdSingleTotalInt(
          responseData.map(
            (item: { household_single_total: string }) =>
              item.household_single_total
          )
        );
      })
      .catch((error) => {
        console.error("Error fetching getAxiosCharts data:", error);
      });
  };

  useEffect(() => {
    updateOptions(
      householdOrdinSumM,
      householdOrdinSumF,
      householdSingleSumM,
      householdSingleSumF,
      householdOrdinTotalSum,
      householdSingleTotalSum
    );
  }, [
    householdOrdinSumM,
    householdOrdinSumF,
    householdSingleSumM,
    householdSingleSumF,
    householdOrdinTotalSum,
    householdSingleTotalSum,
  ]);

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
        });
      })
      .catch((error) => {
        console.error("Error fetching XML ListCounty data:", error);
      });
  }, []);

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
    if (householdOrdinTotalInt.length > 0) {
      sethouseholdOrdinTotalSum(
        householdOrdinTotalInt.reduce((sum: number, item: string) => {
          return (sum += parseInt(item));
        }, 0)
      );
    }
    if (householdSingleTotalInt.length > 0) {
      sethouseholdSingleTotalSum(
        householdSingleTotalInt.reduce((sum: number, item: string) => {
          return (sum += parseInt(item));
        }, 0)
      );
    }
    // console.log(householdSingleTotalSum, householdOrdinTotalSum);
  }, [
    btnAble,
    householdOrdinIntF,
    householdOrdinIntM,
    householdOrdinSumF,
    householdOrdinSumM,
    householdOrdinTotalInt,
    householdOrdinTotalSum,
    householdSingleIntF,
    householdSingleIntM,
    householdSingleSumF,
    householdSingleSumM,
    householdSingleTotalInt,
    householdSingleTotalSum,
  ]);

  const router = useRouter();
  const data = router.query;

  useEffect(() => {
    console.log(getCounty, getTown);
    if (getCounty.length !== 0 && getTown.length !== 0) {
      setbtnAble(false);
    }
    if (router.query.slug) {
      setgetYear(data.slug?.[0]!);
      setgetCounty(data.slug?.[1]!);
      setgetTown(data.slug?.[2]!);
      const selectedValue = data.slug?.[1]!;
      const selectedKey = countyCodes[countyName.indexOf(selectedValue)];
      getAxiosTown(selectedKey);
      getAxiosCharts(getYear, getCounty, getTown);
      loadingScreen();

      if (loadingCharts) {
        const timer = setTimeout(() => {
          setLoadingCharts(false);
        }, 1000);

        return () => clearTimeout(timer);
      }
      //   setLoadingCharts(!loadingCharts);
      getCallColCharts(true);
      getCallPieCharts(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.slug, getCounty, getTown]);

  return (
    <>
      <Head>
        <title>Kit Chan - DailyViewTest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />*/}
        <link rel="icon" href="/favicon.ico" />
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
        <Box className="bg-white w-full h-full fixed overflow-y-scroll">
          <div className={styles.backgroundDiv} aria-label="backgroundCounty">
            TAIWAN
          </div>
          <Typography
            component="div"
            className="text-center pb-10 xl:pl-24 md:pl-0"
          >
            <Typography
              className="pt-5 pb-10 text-2xl md:text-3xl"
              //   variant="h4"
              fontWeight="bold"
              aria-label="contentTitle"
            >
              人口數、戶數按戶別及性別統計
            </Typography>
            {/* Year */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-center pb-5">
              <FormControl sx={{ m: 1, width: 80 }}>
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
              <FormControl sx={{ m: 1, minWidth: 200, md: "100%" }}>
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
              <FormControl sx={{ m: 1, minWidth: 200, md: "100%" }}>
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
                className=" p-3 ml-2 mr-2 my-3 w-[fit] text-base md:w-[7%]"
                disabled={btnAble}
                onClick={() => handleClick(des)}
                sx={{
                  color: "white",
                  backgroundColor: "#1565c0",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                SUMBIT
              </Button>
            </div>
            <Divider
              className="md:w-[70%] w[100%]"
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
            <div className="text-4xl pt-12">
              {loadingCharts && (
                <>
                  <Modal
                    className="w-[100%] h-[100%]"
                    open={loadingCharts}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{
                      backdrop: {
                        timeout: 50,
                      },
                    }}
                  >
                    <Backdrop
                      sx={{ color: "#fff", zIndex: 999 }}
                      open={loadingCharts}
                      className="flex flex-col"
                    >
                      <CircularProgress />
                      <Typography className="pt-3">載入中...</Typography>
                    </Backdrop>
                  </Modal>
                </>
              )}
              {/* {!btnAble && (
              )} */}
              {/* {getYear}年 {getCounty} {getTown} */}
              {callColCharts && (
                <>
                  <div>
                    {getYear}年 {getCounty} {getTown}
                  </div>
                  <div className="flex justify-center py-10 inset-x-0">
                    <div className="w-[100%] md:w-[70%] inset-x-0">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={optionsCol}
                        containerProps={{
                          style: {
                            height: "600px",
                            width: "100%",
                          },
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
              {callPieCharts && (
                <div className="flex justify-center py-10">
                  <div className="w-[100%] md:w-[70%]">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={optionsPie}
                      containerProps={{ style: { height: "600px" } }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Typography>
        </Box>
      </main>
      {/* </Router> */}
    </>
  );
};

export default DataRetriever;
