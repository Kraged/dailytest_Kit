import {
  Typography,
  AppBar,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  TextField,
  Autocomplete,
  InputLabel,
  Modal,
  Toolbar,
} from "@mui/material";
import axios from "axios";
import Highcharts from "highcharts";
import { HighchartsReact } from "highcharts-react-official";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { parseString, parseStringPromise } from "xml2js";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import styles from "@component/styles/Home.module.css";

const figmaTheme = createTheme({
  palette: {
    primary: {
      main: "#651fff",
    },
  },
});

const DataRetriever = ({ des }: { des: string }) => {
  const router = useRouter();
  const [inputYear, setInputYear] = useState("");
  const [inputCounty, setInputCounty] = useState("");
  const [inputTown, setInputTown] = useState("");
  const [getYear, setgetYear] = useState<string | null>(null);
  const [getCounty, setgetCounty] = useState("");
  const [getTown, setgetTown] = useState("");
  const [countyName, setcountyName] = useState<string[]>([]);
  const [countyCodes, setcountyCodes] = useState<string[]>([]);
  const [townName, setTownName] = useState<string[]>([]);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [btnAble, setbtnAble] = useState(true);
  const [btnSync, setbtnSync] = useState(false);
  const [resultText, setResultText] = useState("");
  const [controlDisable, setControlDisable] = useState(false);
  const [householdOrdinIntM, sethouseholdOrdinIntM] = useState<string[]>([]);
  const [householdOrdinIntF, sethouseholdOrdinIntF] = useState<string[]>([]);
  const [householdSingleIntM, sethouseholdSingleIntM] = useState<string[]>([]);
  const [householdSingleIntF, sethouseholdSingleIntF] = useState<string[]>([]);
  const [householdOrdinTotalInt, sethouseholdOrdinTotalInt] = useState<
    string[]
  >([]);
  const [householdSingleTotalInt, sethouseholdSingleTotalInt] = useState<
    string[]
  >([]);
  const [householdOrdinSumM, sethouseholdOrdinSumM] = useState(0);
  const [householdOrdinSumF, sethouseholdOrdinSumF] = useState(0);
  const [householdSingleSumM, sethouseholdSingleSumM] = useState(0);
  const [householdSingleSumF, sethouseholdSingleSumF] = useState(0);
  const [householdOrdinTotalSum, sethouseholdOrdinTotalSum] = useState(0);
  const [householdSingleTotalSum, sethouseholdSingleTotalSum] = useState(0);
  const [callColCharts, setCallColCharts] = useState(false);
  const [callPieCharts, setCallPieCharts] = useState(false);

  const availableYear = ["106", "107", "108", "109", "110", "111"];

  useEffect(() => {
    console.log("useEffect for Axios ListCounty: ", callColCharts);
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
          const countyCodes = countyItems.map(
            (item: any) => item.countycode[0]
          );
          const countyNames = countyItems.map(
            (item: any) => item.countyname[0]
          );
          setcountyName(countyNames);
          setcountyCodes(countyCodes);
        });
      })
      .catch((error) => {
        console.error("Error fetching XML ListCounty data:", error);
      });
  }, []);

  useEffect(() => {
    console.log("useEffect for inputCounty: ", callColCharts);
    if (inputCounty !== "" && fin !== "") {
      handleCountyGetTown(inputCounty);
    }
  }, [inputCounty]);

  const handleCountyGetTown = (inputCounty: string) => {
    const selectedValue = inputCounty;
    const selectedKey = countyCodes[countyName.indexOf(selectedValue)];
    setgetCounty(selectedValue);
    if (fin == "") {
      setgetTown("");
      getAxiosTown(selectedKey);
    }
    getAxiosTown(selectedKey);
  };

  const getAxiosTown = (selectedCountyCodes: string) => {
    axios
      .get(`https://api.nlsc.gov.tw/other/ListTown/${selectedCountyCodes}`)
      .then((response) => {
        const xmlData = response.data;
        parseString(xmlData, (err, result) => {
          if (err) {
            console.error("Error parsing XML:", err);
            return;
          }
          const townItems = result?.townItems?.townItem;
          if (townItems && townItems.length > 0) {
            const townNames = townItems.map((item: any) => item.townname[0]);
            setTownName(townNames);
          } else {
            setTownName([]);
          }
        });
      });
  };

  const [fin, setfin] = useState("");
  useEffect(() => {
    console.log("useEffect for slug: ", callColCharts);
    if (router.query.slug && fin === "") {
      const { slug } = router.query;
      const year = slug?.[0] || "";
      const county = slug?.[1] || "";
      const town = slug?.[2] || "";

      setgetYear(year);
      setgetCounty(county);
      setgetTown(town);
      setfin(town);
      const text = `${year}年 ${county} ${town}`;
      setResultText(text);
      setCallColCharts(true);
      setCallPieCharts(true);

      getAxiosCharts(year, county, town);
    }
  }, [router.query.slug]);

  const getAxiosCharts = (year: string, county: string, town: string) => {
    axios
      .get(
        `https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/${year}?COUNTY=${county}&TOWN=${town}`
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
    console.log("useEffect for Calculating sum: ", callColCharts);
    if (householdOrdinIntM.length > 0) {
      sethouseholdOrdinSumM(
        householdOrdinIntM.reduce(
          (sum: number, item: string) => sum + parseInt(item),
          0
        )
      );
    }
    if (householdOrdinIntF.length > 0) {
      sethouseholdOrdinSumF(
        householdOrdinIntF.reduce(
          (sum: number, item: string) => sum + parseInt(item),
          0
        )
      );
    }
    if (householdSingleIntM.length > 0) {
      sethouseholdSingleSumM(
        householdSingleIntM.reduce(
          (sum: number, item: string) => sum + parseInt(item),
          0
        )
      );
    }
    if (householdSingleIntF.length > 0) {
      sethouseholdSingleSumF(
        householdSingleIntF.reduce(
          (sum: number, item: string) => sum + parseInt(item),
          0
        )
      );
    }
    if (householdOrdinTotalInt.length > 0) {
      sethouseholdOrdinTotalSum(
        householdOrdinTotalInt.reduce(
          (sum: number, item: string) => sum + parseInt(item),
          0
        )
      );
    }
    if (householdSingleTotalInt.length > 0) {
      sethouseholdSingleTotalSum(
        householdSingleTotalInt.reduce(
          (sum: number, item: string) => sum + parseInt(item),
          0
        )
      );
    }
  }, [
    householdOrdinIntM,
    householdOrdinIntF,
    householdSingleIntM,
    householdSingleIntF,
    householdOrdinTotalInt,
    householdSingleTotalInt,
  ]);

  const handleClick = () => {
    if (getYear && getCounty && getTown) {
      getAxiosCharts(getYear, getCounty, getTown);
      setLoadingCharts(true);
      setbtnSync(true);
      const text = `${getYear}年 ${getCounty} ${getTown}`;
      setResultText(text);
      setLoadingCharts(!loadingCharts);
      setTimeout(() => {
        setCallColCharts(true);
        setCallPieCharts(true);
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
    } else {
      setResultText("請先選擇 年度、縣/市、區");
      setCallColCharts(false);
      setCallPieCharts(false);
    }
  };

  useEffect(() => {
    console.log("useEffect for loadingCharts: ", callColCharts);
    if (loadingCharts) {
      const timer = setTimeout(() => {
        setLoadingCharts(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loadingCharts]);

  useEffect(() => {
    console.log("useEffect for checking lengths: ", callColCharts);
    getAxiosTown(countyCodes[countyName.indexOf(getCounty)]);
    if (getCounty.length !== 0 && getTown.length !== 0) {
      setbtnAble(false);
    }
    if (getYear?.length === 0 && getCounty.length > 0) {
      setControlDisable(false);
    }
    if (!getCounty || !getYear) {
      setControlDisable(false);
      //   setCallColCharts(false);
      //   setCallPieCharts(false);
      setbtnAble(true);
      setResultText("");
    } else {
      setControlDisable(true);
    }
    if (getCounty) {
      setControlDisable(true);
    }
  }, [getCounty, getYear, getTown, countyCodes, countyName]);

  useEffect(() => {
    console.log("useEffect for updateOptions: ", callColCharts);
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
  const [optionsCol, setOptionsCol] = useState({
    chart: {
      type: "column",
      backgroundColor: "transparent",
      marginLeft: 50,
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
        colors: ["#626eb2", "#a3b1ff"],
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

  return (
    <>
      <Head>
        <title>Kit Chan - DailyViewTest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Created by Kit Chan" />
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
              fontWeight="bold"
              aria-label="contentTitle"
            >
              人口數、戶數按戶別及性別統計
            </Typography>
            {/* Year */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-center pb-5">
              <FormControl sx={{ minWidth: 80, md: "100%", mt: 1 }}>
                <InputLabel
                  id="countyInputLabel"
                  shrink
                  sx={{
                    paddingTop: "8px",
                    paddingBottom: "4px",
                    paddingX: "10px",
                    backgroundColor: "white",
                  }}
                >
                  年份
                </InputLabel>
                <Autocomplete
                  value={getYear}
                  noOptionsText="查無資料"
                  onChange={(event: any, newValue: string | null) => {
                    setgetYear(newValue || "");
                  }}
                  inputValue={inputYear}
                  onInputChange={(event, newInputValue) => {
                    setInputYear(newInputValue);
                    if (newInputValue === "" && getYear) {
                      setCallColCharts(false);
                      setCallPieCharts(false);
                      setbtnAble(true);
                      setResultText("");
                      setInputCounty("");
                      setgetCounty("");
                    }

                    setbtnAble(true);
                  }}
                  id="autoYear"
                  options={availableYear}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="年份"
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                  className="m-1 w-[110px] mb-2"
                />
              </FormControl>
              {/* County */}
              <FormControl sx={{ minWidth: 200, md: "100%", mt: 1 }}>
                <InputLabel
                  id="countyInputLabel"
                  shrink
                  sx={{
                    paddingTop: "8px",
                    paddingBottom: "4px",
                    paddingX: "10px",
                    backgroundColor: "white",
                  }}
                >
                  縣/市
                </InputLabel>
                <Autocomplete
                  value={getCounty}
                  noOptionsText="查無資料"
                  onChange={(event: any, newValue: string | null) => {
                    setgetCounty(newValue || "");
                    setInputTown("");
                    setgetTown("");
                    if (newValue === "" && newValue) {
                      setInputTown("");
                      setgetTown("");
                    }
                  }}
                  inputValue={inputCounty}
                  onInputChange={(event, newInputValue) => {
                    setInputCounty(newInputValue);
                    if (newInputValue === "" && newInputValue) {
                      setInputTown("");
                      setgetTown("");
                    }
                  }}
                  id="autoCounty"
                  options={countyName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="請選擇 縣/市"
                      InputProps={{
                        ...params.InputProps,
                      }}
                    />
                  )}
                  className="m-1 min-w-[200px] md:w-[200px] mb-2"
                />
              </FormControl>
              {/* Town */}
              <FormControl sx={{ minWidth: 200, md: "100%", mt: 1 }}>
                <InputLabel
                  id="countyInputLabel"
                  shrink
                  sx={{
                    paddingTop: "8px",
                    paddingBottom: "4px",
                    paddingX: "10px",
                    backgroundColor: "white",
                  }}
                >
                  區
                </InputLabel>
                <Autocomplete
                  value={getTown}
                  noOptionsText="查無資料"
                  onChange={(event: any, newValue: string | null) => {
                    setgetTown(newValue || "");
                  }}
                  inputValue={inputTown}
                  onInputChange={(event, newInputValue) => {
                    handleCountyGetTown(inputCounty);
                    setInputTown(newInputValue);
                    if (newInputValue === "" && newInputValue) {
                      setCallColCharts(false);
                      setCallPieCharts(false);
                      setbtnAble(true);
                      setResultText("");
                      setgetTown("");
                    }
                  }}
                  id="autoTown"
                  options={townName}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="請先選擇 縣/市"
                      InputProps={{
                        ...params.InputProps,
                      }}
                      disabled={!controlDisable}
                    />
                  )}
                  disabled={!controlDisable}
                  className="m-1 min-w-[200px] md:w-[200px] mb-2"
                />
              </FormControl>

              <Button
                variant="contained"
                className=" p-3 mx-1 mt-2 mb-2 w-[fit] text-base md:w-[8%]"
                disabled={btnAble}
                onClick={() => handleClick()}
                sx={{
                  color: "white",
                  backgroundColor: "#651fff",
                  "&:hover": {
                    backgroundColor: "##651fff",
                  },
                }}
              >
                SUMBIT
              </Button>
            </div>
            <Divider
              className="md:w-[70%] w[100%]"
              sx={{
                mx: "auto",
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
              <Typography variant="h4">{resultText}</Typography>
              {callColCharts || callPieCharts ? (
                <>
                  <div className="flex justify-center py-6 inset-x-0">
                    <div className="w-[100%] md:w-[70%] inset-x-0 m-10">
                      <div>
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
                      <div className="pt-16">
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={optionsPie}
                          containerProps={{
                            style: {
                              height: "600px",
                              width: "100%",
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </Typography>
        </Box>
      </main>
    </>
  );
};

export default DataRetriever;
