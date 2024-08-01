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
import {
  fetchIBStockList,
  addStockListAndWatchListApi,
  deleteStockListApi,
} from "../../../api/ApiCall";
import StockListStaticPayload from "../../../api/StockListStaticPayload";

export default function Stocks() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(100);
  const [watchListName, setWatchListName] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [payload, setPayload] = useState(StockListStaticPayload);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAddedStockList, setIsLoadingAddedStockList] = useState(false);
  const [addedStockList, setAddedStockList] = useState([]);

  useEffect(() => {
    if (size > 0) payload["pageSize"] = size;
    if (page > 0) payload["pageNumber"] = page;
    let tempSearch = "";
    if (search) tempSearch = search.toUpperCase().trim();
    payload["productSymbol"] = (tempSearch);

    setPayload({ ...payload });

    if (search) {
      fetchIBStockList(payload).then((response) => {
        setData(response);
        setIsLoading(false);
      }).catch((err) => {
        setIsLoading(false);
      })
    }
  }, [size, page, search]);

  function handleAddStockFun(stockObj) {
    if (!watchListName) {
      toast.error("Please enter watch list name.", {
        toastId: "watch-list-name-error"
      })
      return 0;
    }

    addStockListAndWatchListApi({
      watchListName: watchListName,
      stockDetails: stockObj
    }).then((response) => {
      if (response?.status) {
        let resData = response?.data || {};
        setAddedStockList((prev) => [...prev, resData]);
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
    }).catch((err) => {
      console.log("addStockListAndWatchListApi Error:", err.message);
      toast.error("Something went wrong. please try again.", {
        toastId: "stock-list-add"
      })
    })
  }

  function handleDeleteStockListFun(stockData) {
    let id = stockData._id;
    deleteStockListApi(id).then((response) => {
      if (response?.status) {
        let tempStockList = addedStockList.filter((dt) => dt?._id != id);
        setAddedStockList(tempStockList);
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
    }).catch((err) => {
      console.log("deleteStockListApi Error:", err.message);
      toast.error("Something went wrong. please try again.", {
        toastId: "stock-list-delete"
      })
    })
  }

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
                          <Box component={"div"} className="d-flex align-items-center justify-content-start gap-4">
                            <Box component={"div"} className="d-flex flex-wrap justify-content-start align-items-center gap-2">
                              <Typography variant="h6" className="tableHeading mr-3">
                                Watch List Name
                              </Typography>
                              <TextField
                                id="outlined-size-normal"
                                placeholder="Search"
                                variant="outlined"
                                size="small"
                                value={watchListName}
                                onChange={(e) => {
                                  setWatchListName(e.target.value);
                                  setAddedStockList([]);
                                }}
                              />
                            </Box>
                            <Box component={"div"} className="d-flex flex-wrap justify-content-start align-items-center gap-2">
                              <Typography variant="h6" className="tableHeading  mr-3">
                                Symbol
                              </Typography>
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
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    {search ? <>
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
                                      {row.symbol}
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
                                      <button
                                        className="btn btn-lg rounded-3 btn-purple"
                                        onClick={() => handleAddStockFun(row)}
                                      >
                                        + Add
                                      </button>
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
                    </> : <></>}
                  </Card>
                </div>
              </div>
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
                          <Box component={"div"} className="d-flex align-items-center justify-content-start gap-4">
                            <Box component={"div"} className="d-flex flex-wrap justify-content-start align-items-center gap-2">
                              <Typography variant="h6" className="tableHeading mr-3">
                                My General Watch List
                              </Typography>
                            </Box>
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
                        {isLoadingAddedStockList ?
                          <div className="notDataDiv">Please wait...</div>
                          : addedStockList?.length ? (
                            <TableBody>
                              {addedStockList.map((row, ind) => (
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
                                    {row?.stockDetails?.symbol}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.stockDetails?.description}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.stockDetails?.exchangeId}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.stockDetails?.conid}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.stockDetails?.type}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.stockDetails?.currency}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    {row?.stockDetails?.country}
                                  </TableCell>
                                  <TableCell className="table_content tableRow1">
                                    <button
                                      className="btn btn-lg rounded-3 btn-outline-danger"
                                      onClick={() => handleDeleteStockListFun(row)}
                                    >
                                      Delete
                                    </button>
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
