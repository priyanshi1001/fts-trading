import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Grid,
  Box,
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
import { } from "../../../api/ApiCall"
socket.connect();

export default function RealTimeStock() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { conid } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("RealTimeStock conid============", conid);

    socket.on("connect", () => {
      console.log("Node socket connect successfully.");
    })
    socket.on("disconnect", () => {
      console.log("Node socket disconnected.");
    });

    socket.on("ib_message", (data) => {
      let socketResponse = JSON.parse(data);
      if (socketResponse.topic == `smd+${conid}`) {
        if (data) {
          setData({ ...data, ...socketResponse });
        } else {
          setData(socketResponse);
        }
      }
      console.log("ib_message:", socketResponse);
    });
    const obj = {
      "31": "Last Price",
      "55": "Symbol",
      "58": "Text ?",
      "6073": "expiration",
      "7283": "Strike price",
      "84": "Bid price",
      "86": "Ask price",
      "7308": "Delta",
      "7607": "Today Opt. Volume Change",
      "7638": "Option Open Interest",
      "7633": "Implied volatility",
    }
    const old_fields = ["31", "84", "86"];
    const fields = ["31", "55", "58", "6073", "7283", "84", "86", "7308", "7607", "7638", "7633"];

    socket.emit("req_data", `smd+${conid}+${JSON.stringify({ fields: fields })}`);

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
                            Real Time Stock Data
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
                              Expiration
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Strike price
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Bid
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Ask
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Last Price
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Delta
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Today Volume
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Open Interest
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Implied Volatility
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        {isLoading ?
                          <div className="notDataDiv">Please wait...</div>
                          : data ? (
                            <TableBody>
                              <TableRow
                                align="left"
                                className="tableRow1"
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell className="table_content tableRow1">
                                  {""}
                                </TableCell>
                              </TableRow>
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
