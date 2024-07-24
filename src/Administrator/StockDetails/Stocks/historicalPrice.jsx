import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Grid,
  Breadcrumbs,
  Box,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Fragment } from "react";
import moment from "moment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ThemeOptions from "../../../Layout/ThemeOptions";
import EditIcon from "@mui/icons-material/Edit";
import AppSidebar from "../../../Layout/AppSidebar";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import { Route, useHistory, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { socket } from "../../../api/socket"
import { DateTimeParam } from "use-query-params";
socket.connect();

export default function RealTimeStock() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { conid } = useParams();
  const [historicalData, setHistoricalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("RealTimeStock conid============", conid);

    socket.on("connect", () => {
      console.log("Node socket connect successfully.");
    })
    socket.on("disconnect", () => {
      console.log("Node socket disconnected.");
    });

    socket.on("ib_message", (resData) => {
      let socketResponse = JSON.parse(resData);
      if (socketResponse.topic == `smh+${conid}`) {
        setHistoricalData(socketResponse);
      }
      console.log("ib_message:", socketResponse);
    });

    let obj = {
      "period": "2h",
      "bar": "1min",
      "source": "trades",
      "outsideRTH": true,
      "format": "%o/%c/%h/%l/%v"
    };

    socket.emit("req_data", `smh+${conid}+${JSON.stringify(obj)}`);

    setIsLoading(false);
  }, []);

  return (
    <Card>
      <Fragment>
        <ThemeOptions />
        <div className="app-main">
          <AppSidebar />
          <div className="app-main__outer">
            <div className="app-main__inner">
              <div className=" row">
                <div className="col-12 mb-3 mt-5">
                  <Card className="cardDesign">
                    <Box className="tableHeader">
                      <Grid container spacing={1} p={"0 !important"}>
                        <Grid
                          item
                          xs={"auto"}
                          sx={{ flexGrow: " 1 !important" }}
                        >
                          <Typography variant="h6" className="tableHeading">
                            Historical Price Data
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <TableContainer className="tableDesignFrame">
                      <Table
                        sx={{ minWidth: 650 }}
                        class="table table-hover table-striped tableDesign"
                      >
                        <TableHead>
                          <TableRow className="tableRow1">
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              Date
                            </TableCell>
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              Symbol
                            </TableCell>
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              Time
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Open
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              HI
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              LO
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Close
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Volume
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Today’s Volume
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              MA-X
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              MA-Y
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              RSI
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        {isLoading ?
                          <div className="notDataDiv">Please wait...</div>
                          : Object.keys(historicalData || {}).length ? (
                            <TableBody>
                              {historicalData?.data?.map((row, ind) => (
                                <TableRow
                                  align="left"
                                  className="tableRow1"
                                  key={ind}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell className="table_content tableRow1">
                                    {moment(historicalData?.startTime, "YYYYMMDD-HH:mm:ss").format("DD MMM YYYY")}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {historicalData?.symbol}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {moment(historicalData?.startTime, "YYYYMMDD-HH:mm:ss").format("hh:mm A")}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.o}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.h}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.l}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.c}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.v}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">

                                  </TableCell>
                                  <TableCell className="table_content tableRow1">

                                  </TableCell>
                                  <TableCell className="table_content tableRow1">

                                  </TableCell>
                                  <TableCell className="table_content tableRow1">

                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          ) : (
                            <div className="notDataDiv">No Data Available</div>
                          )}
                      </Table>
                    </TableContainer>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </Card >
  );
}
