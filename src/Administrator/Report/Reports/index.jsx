import React, { useEffect, useState } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import {
  Card,
  Box,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody
} from "@mui/material";
import ThemeOptions from "../../../Layout/ThemeOptions/";
import { Fragment } from "react";
import { toast } from "react-toastify";
import AppSidebar from "../../../Layout/AppSidebar/";
import { fetchOrderReportApi } from "../../../api/ApiCall"


export default function Reports() {
  const history = useHistory();
  const [reportList, setReportList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({});

  useEffect(() => {
    let query = "";
    if (filter?.startDate) {
      query += `?startDate=${filter.startDate}`;
    }
    if (filter?.endDate) {
      if (query) query += `&endDate=${filter.endDate}`;
      else query += `?endDate=${filter.endDate}`;
    }

    fetchOrderReportApi(query).then((response) => {
      if (response?.status) {
        setReportList(response?.data || []);
      }
      setIsLoading(false);
    }).catch((err) => {
      console.log("Order Report Error:", err.message);
      toast.error("Server not responsded.");
      setIsLoading(false);
    });
  }, [filter]);

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
                            Latency for Order Execution by Orders
                          </Typography>
                        </Grid>
                        <Grid item xs={"auto"}>
                          <Box className="btn-box d-flex align-items-center justify-content-end gap-3">
                            <div>
                              <label>From:</label>
                              <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={filter?.startDate || ""}
                                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                              />
                            </div>
                            <div>
                              <label>To:</label>
                              <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={filter?.endDate || ""}
                                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                              />
                            </div>
                          </Box>
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
                              Stock/Opt
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Orders #
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Time Order entered in FTS
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              “A” Time lag from FTS to Broker
                            </TableCell>
                            {/* <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              “B” Time lag from FTS to Broker to Xchange
                            </TableCell> */}
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Order Execution noted on Broker Platform (Not controllable)
                            </TableCell>
                            {/* <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              “C” Time lag from FTS to Broker
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              “Controllable” from FTS to FTS A+B+C
                            </TableCell> */}
                          </TableRow>
                        </TableHead>

                        {isLoading ?
                          <div className="notDataDiv">Please wait...</div>
                          : reportList?.length ? (
                            <TableBody>
                              {reportList.map((row, ind) => (
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
                                    {moment(row.createdAt).format("DD MMMM YY")}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.stockSymbol}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {"Stock"}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.order_id}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {moment(row?.createdAt).format("hh:mm:ss:ms")}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {getTimeDuration(row?.order_lastExecutionTime, row?.createdAt)} Sec
                                  </TableCell>
                                  {/* <TableCell className="table_content tableRow1">
                                    {}
                                  </TableCell> */}
                                  <TableCell className="table_content tableRow1">
                                    {moment(row?.order_lastExecutionTime).format("hh:mm:ss:ms")}
                                  </TableCell>
                                  {/* <TableCell className="table_content tableRow1">
                                    {}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {}
                                  </TableCell> */}
                                </TableRow>
                              ))}
                            </TableBody>
                          ) : (
                            <div className="notDataDiv">No Data Available</div>
                          )}
                      </Table>
                    </TableContainer>
                    {/* <Box className="tableFooter">
                      <Stack spacing={2}>
                        <Pagination
                          className="d-flex justify-content-end"
                          variant="outlined"
                          shape="rounded"
                          color="primary"
                          count={1}
                          onChange={(e, value) => setPage(value)}
                        />
                      </Stack>
                    </Box> */}
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </Card>
  );
}


function getTimeDuration(startDate, endDate) {
  let start = moment(startDate);
  let end = moment(endDate);
  let diff = end.diff(start);
  let diffInSec = diff / 1000;
  return diffInSec.toFixed(2);
}