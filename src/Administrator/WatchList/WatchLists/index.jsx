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
import { fetchWatchListApi, deleteWatchListApi } from "../../../api/ApiCall";

export default function Reports() {
  const history = useHistory();
  const [watchList, setWatchList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    fetchWatchListApi()
      .then((response) => {
        if (response?.status) {
          setWatchList(response?.data || []);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Order Report Error:", err.message);
        toast.error("Server not responsded.");
        setIsLoading(false);
      });
  }, []);

  function handleDeleteWatchListFun(obj) {
    let id = obj._id;
    deleteWatchListApi(id).then((response) => {
      if (response?.status) {
        let tempWatchList = watchList.filter((dt) => dt?._id != id);
        setWatchList(tempWatchList);
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
    }).catch((err) => {
      console.log("deleteWatchListApi Error:", err.message);
      toast.error("Something went wrong. please try again.", {
        toastId: "watch-list-delete"
      });
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
                          <Typography variant="h6" className="tableHeading">
                            Watch List
                          </Typography>
                        </Grid>
                        <Grid item xs={"auto"}>
                          <Box className="btn-box d-flex align-items-center justify-content-end gap-3">
                            <div className="btn-box d-flex align-items-center justify-content-end">
                              <button
                                className="btn btn-lg rounded-3 btn-purple"
                                onClick={() => history.push(`/add-stock-list`)}
                              >
                                + Create New
                              </button>
                            </div>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <TableContainer className="tableDesignFrame reports-listing-tbl">
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
                              Name
                            </TableCell>
                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        {isLoading ? (
                          <div className="notDataDiv">Please wait...</div>
                        ) : watchList?.length ? (
                          <TableBody>
                            {watchList.map((row, ind) => (
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
                                  {row.name}
                                </TableCell>
                                <TableCell className="table_content tableRow1">
                                  <button
                                    className="btn btn-sm rounded-3 btn-outline-purple"
                                    onClick={() => history.push(`/update-stock-list/${row._id}`)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm rounded-3 btn-outline-danger"
                                    onClick={() => handleDeleteWatchListFun(row)}
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
