import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  Grid,
  Breadcrumbs,
  // Link,
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
import { Route, useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchIBStockList } from "../../../api/ApiCall"

export default function Stocks() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(100);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [payload, setPayload] = useState({
    "pageNumber": 1,
    "pageSize": 100,
    "sortField": "symbol",
    "sortDirection": "asc",
    "productCountry": [
      "US",
      "IN"
    ],
    "productSymbol": "",
    "newProduct": "all",
    "productType": [
      "STK"
    ],
    "domain": "com"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (size > 0) payload["pageSize"] = size;
    if (page > 0) payload["pageNumber"] = page;
    payload["productSymbol"] = (search || "");

    setPayload({ ...payload });

    fetchIBStockList(payload).then((response) => {
      setData(response);
      setIsLoading(false);
    }).catch((err) => {
      setIsLoading(false);
    })
  }, [size, page, search]);

  return (
    <Card>
      <Fragment>
        <ThemeOptions />
        <div className="app-main">
          <AppSidebar />
          <div className="app-main__outer">
            <div className="app-main__inner">
              {/* <div role="presentation" className="bread_crumbs">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link underline="hover" color="#0c62a8">
                    Content Block
                  </Link>
                  <p underline="hover" color="#000000">
                    Content Management Languages
                  </p>
                </Breadcrumbs>
              </div> */}
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
                            Stock Details
                          </Typography>
                        </Grid>
                        <Grid item xs={"auto"}>
                          <Box className="btn-box d-flex align-items-center justify-content-end gap-3">
                            <div className="searchBox">
                              <TextField
                                id="outlined-size-normal"
                                placeholder="Search"
                                variant="outlined"
                                size="small"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                InputProps={{
                                  className: "searchInput",
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <SearchIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </div>
                            <button className="btn btn-sm btn-outline-gray">
                              <svg
                                width="16"
                                height="17"
                                viewBox="0 0 16 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M14.6666 2.5H1.33325L6.66659 8.80667V13.1667L9.33325 14.5V8.80667L14.6666 2.5Z"
                                  stroke="#53545C"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                              Filter
                            </button>
                            <button className="btn btn-sm btn-outline-gray">
                              <svg
                                width="18"
                                height="19"
                                viewBox="0 0 18 19"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2.25 14.75H15.75V16.25H2.25V14.75ZM9.75 10.3787L14.3033 5.82538L15.364 6.88604L9 13.25L2.63604 6.88604L3.6967 5.82538L8.25 10.3787V2H9.75V10.3787Z"
                                  fill="#53545C"
                                />
                              </svg>
                              Export
                            </button>
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
                              Symbol
                            </TableCell>
                            <TableCell
                              align="left"
                              className="table_head tableRow1"
                            >
                              Description
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Exchange
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Contract id
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Type
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Currency
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Country
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
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
                                    <Link to={`/Dashboard?conid=${row.conid}&symbol=${row.symbol}`}>
                                      {row.symbol}
                                    </Link>
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row.description}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row.exchangeId}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row.conid}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row.type}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row.currency}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row.country}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    <Link to={`/Get_real_time_stock/${row.conid}`}>
                                      Get Real Time Stock
                                    </Link>
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    <Link to={`/Get_historical_price/${row.conid}`}>
                                      Get Historical Price
                                    </Link>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          ) : (
                            <div className="notDataDiv">No Data Available</div>
                          )}
                      </Table>
                    </TableContainer>
                    <Box className="tableFooter">
                      <Stack spacing={2}>
                        <Pagination
                          className="d-flex justify-content-end"
                          variant="outlined"
                          shape="rounded"
                          color="primary"
                          count={Math.ceil((data?.productCount || 1) / size)}
                          onChange={(e, value) => setPage(value)}
                        />
                      </Stack>
                    </Box>
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
