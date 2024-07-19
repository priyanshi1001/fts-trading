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
  TableBody,
} from "@mui/material";
import ThemeOptions from "../../../Layout/ThemeOptions/";
import { Fragment } from "react";
import { toast } from "react-toastify";
import AppSidebar from "../../../Layout/AppSidebar/";
import { fetchOrderReportApi } from "../../../api/ApiCall";

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

    fetchOrderReportApi(query)
      .then((response) => {
        if (response?.status) {
          setReportList(response?.data || []);
        }
        setIsLoading(false);
      })
      .catch((err) => {
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
                            <div className="border border-secondary-subtle px-2 py-1 rounded-2 d-flex align-items-center gap-1">
                              <label
                                htmlFor="startDate"
                                className="d-flex align-items-center gap-1"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.00004 0.166504V1.49984H9.00004V0.166504H10.3334V1.49984H13C13.3682 1.49984 13.6667 1.79832 13.6667 2.1665V12.8332C13.6667 13.2014 13.3682 13.4998 13 13.4998H1.00004C0.631854 13.4998 0.333374 13.2014 0.333374 12.8332V2.1665C0.333374 1.79832 0.631854 1.49984 1.00004 1.49984H3.66671V0.166504H5.00004ZM12.3334 6.83317H1.66671V12.1665H12.3334V6.83317ZM3.66671 2.83317H1.66671V5.49984H12.3334V2.83317H10.3334V4.1665H9.00004V2.83317H5.00004V4.1665H3.66671V2.83317Z"
                                    fill="#53545C"
                                  />
                                </svg>
                                From :
                              </label>
                              <input
                                style={{
                                  appearance: "none",
                                  border: "none",
                                }}
                                className="inputApperanceDesign"
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={filter?.startDate || ""}
                                onChange={(e) =>
                                  setFilter({
                                    ...filter,
                                    startDate: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="border border-secondary-subtle px-2 py-1 rounded-2 d-flex align-items-center gap-1">
                              <label
                                htmlFor="startDate"
                                className="d-flex align-items-center gap-1"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M5.00004 0.166504V1.49984H9.00004V0.166504H10.3334V1.49984H13C13.3682 1.49984 13.6667 1.79832 13.6667 2.1665V12.8332C13.6667 13.2014 13.3682 13.4998 13 13.4998H1.00004C0.631854 13.4998 0.333374 13.2014 0.333374 12.8332V2.1665C0.333374 1.79832 0.631854 1.49984 1.00004 1.49984H3.66671V0.166504H5.00004ZM12.3334 6.83317H1.66671V12.1665H12.3334V6.83317ZM3.66671 2.83317H1.66671V5.49984H12.3334V2.83317H10.3334V4.1665H9.00004V2.83317H5.00004V4.1665H3.66671V2.83317Z"
                                    fill="#53545C"
                                  />
                                </svg>
                                To:
                              </label>
                              <input
                                style={{
                                  appearance: "none",
                                  border: "none",
                                }}
                                className="inputApperanceDesign"
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={filter?.endDate || ""}
                                onChange={(e) =>
                                  setFilter({
                                    ...filter,
                                    endDate: e.target.value,
                                  })
                                }
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
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Order Execution noted on Broker Platform (Not
                              controllable)
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              “B” Time lag from FTS return response
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Time lag from FTS return response
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              “Controllable” from FTS to FTS A+B
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        {isLoading ? (
                          <div className="notDataDiv">Please wait...</div>
                        ) : reportList?.length ? (
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
                                  {moment(row?.startDate).format("hh:mm:ss:ms")}
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  {getTimeDuration(
                                    row?.startDate,
                                    row?.order_lastExecutionTime
                                  )}{" "}
                                  Sec
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  {moment(row?.order_lastExecutionTime).format(
                                    "hh:mm:ss:ms"
                                  )}
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  {getTimeDuration(
                                    row?.order_lastExecutionTime,
                                    row?.createdAt
                                  )}{" "}
                                  Sec
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  {moment(row?.createdAt).format("hh:mm:ss:ms")}
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  {getTimeDurationSum(
                                    row?.startDate,
                                    row?.order_lastExecutionTime,
                                    row?.createdAt
                                  )}
                                </TableCell>
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

function getTimeDurationSum(startDate, midDate, endDate) {
  let start = moment(startDate);
  let end = moment(midDate);
  let diff = end.diff(start);

  let start2 = moment(midDate);
  let end2 = moment(endDate);
  let diff2 = end2.diff(start2);

  let diffInSec = (diff2 + diff) / 1000;
  return diffInSec.toFixed(2);
}
