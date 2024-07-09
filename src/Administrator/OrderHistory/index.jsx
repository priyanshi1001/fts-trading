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

  useEffect(() => {
    fetchIBOpenOders(`?Filters=submitted,filled`).then((response) => {
      setOpenOrderList(response?.orders || []);
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
                              Ticker
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
                              Execution Time
                            </TableCell>
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              Total Size
                            </TableCell>
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              Remaining Quantity
                            </TableCell>
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              Price
                            </TableCell>
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              Status
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        {openOrderList?.length ? (
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
                                  {row?.ticker} ({row?.exchange})
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  {row?.side}
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  {moment(row?.lastExecutionTime_r).format("DD-MM-YYYY hh:mm:ss A")}
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  {row?.totalSize}
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  {row?.remainingQuantity}
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  {row?.price || row?.avgPrice} ({row?.cashCcy})
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  {row?.status}
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  <Button>Delete</Button>
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
