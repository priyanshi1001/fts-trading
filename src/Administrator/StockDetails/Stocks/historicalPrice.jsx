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

export default function RealTimeStock() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { conid } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
                          : data?.products?.length ? (
                            <TableBody>
                              {data.products.map((row, ind) => (
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
                                    {row.symbol}
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
