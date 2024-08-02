import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Grid,
  Box,
  Button,
} from "@mui/material";
import { Fragment } from "react";
import moment from "moment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ThemeOptions from "../../Layout/ThemeOptions";
import AppSidebar from "../../Layout/AppSidebar";
import { Route, useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchIBOpenOders } from "../../api/ApiCall"

export default function Stocks() {
  const history = useHistory();
  const [openOrderList, setOpenOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIBOpenOders(`?Filters=filled`).then((response) => {
      setOpenOrderList(response?.orders || []);
      setIsLoading(false);
    }).catch((err) => {
      console.log("Fetch Open Orders:", err);
      toast.error("Interactive broker panel not login.")
    });
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
                            Order History
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
                              Order Entry Time
                            </TableCell>
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              Fill Time Range
                            </TableCell>
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              Sym
                            </TableCell>
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              Order Type
                            </TableCell>
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              Stock / Option
                            </TableCell>
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              # of Shares
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Order Price
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Avg Fill Price
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Extended Amount
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        {isLoading ?
                          <div className="notDataDiv">Please wait...</div>
                          :
                          openOrderList?.length ? (
                            <TableBody>
                              {openOrderList.map((row, ind) => (
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
                                    {moment(row?.lastExecutionTime_r).format("MM/DD/YYYY")}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {moment(row?.lastExecutionTime_r).format("hh:mm A")}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {/* {moment(row?.lastExecutionTime_r).format("DD-MM-YYYY hh:mm:ss A")} */}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.ticker}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.side}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    Stock
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {showQty(row)}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.price || row?.avgPrice}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.avgPrice || row?.price}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.side == "BUY" ? "-" : ""}{((+row?.avgPrice || +row?.price) * (+row?.totalSize)).toFixed(2)}
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

function showQty(data) {
  let qty = 0;
  if (data?.status == "Filled") {
    qty = data?.filledQuantity || 0;
  } else if (data?.status == "Cancelled") {
    qty = data?.remainingQuantity || 0;
  } else {
    qty = data?.totalSize || 0;
  }
  return qty;
}