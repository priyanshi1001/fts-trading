import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import {
  TextField,
  CardHeader,
  div,
  CardContent,
  CardActions,
  Card,
  Divider,
  Breadcrumbs,
  Link,
  Select,
  MenuItem,
  Checkbox,
  Button,
  Box,
  Typography,
  Grid,
  InputAdornment,
  FormControl,
} from "@mui/material";
import ThemeOptions from "../../../Layout/ThemeOptions/";
import { Fragment } from "react";
import AppSidebar from "../../../Layout/AppSidebar/";

export default function Accounts() {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Card>
      <Fragment>
        <ThemeOptions />

        <div className="app-main">
          <AppSidebar />
          <div className="app-main__outer">
            <div className="app-main__inner shadow-none">
              <div role="presentation" className="bread_crumbs">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link underline="hover" color="#0c62a8">
                    Content Block
                  </Link>
                  <p underline="hover" color="#000000">
                    Content Management Languages
                  </p>
                </Breadcrumbs>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-12 mb-0">
                      <Card
                        className="cardDesign"
                        sx={{ p: { lg: 4, md: 3, sm: 2 } }}
                      >
                        <CardContent className="cardContent">
                          <Box component="div" className="userInfo">
                            <Box component="div" className="userIcon orange-bg">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"
                                  fill="white"
                                />
                              </svg>
                            </Box>
                            <Box component={"div"} className="userDeatil">
                              <Typography variant="h6" className="userName">
                                All Users{" "}
                              </Typography>
                              <Typography variant="h6" className="userCount">
                                70
                              </Typography>
                            </Box>
                          </Box>
                          <Box component={"div"}>
                            <Link
                              to="/admin/users"
                              className="px-0 btn text-orange link-text gap-1 align-items-center"
                            >
                              View All{" "}
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6 12L10 8L6 4"
                                  stroke="#F89B53"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </Link>
                          </Box>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12 mb-0">
                      <Card
                        className="cardDesign"
                        sx={{ p: { lg: 4, md: 3, sm: 2 } }}
                      >
                        <CardContent className="cardContent">
                          <Box component="div" className="userInfo">
                            <Box component="div" className="userIcon green-bg">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"
                                  fill="white"
                                />
                              </svg>
                            </Box>
                            <Box component={"div"} className="userDeatil">
                              <Typography variant="h6" className="userName">
                                Active Users
                              </Typography>
                              <Typography variant="h6" className="userCount">
                                55
                              </Typography>
                            </Box>
                          </Box>
                          <Box component={"div"}>
                            <Link
                              to="/admin/users"
                              className="px-0 btn text-orange link-text gap-1 align-items-center"
                            >
                              View All{" "}
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6 12L10 8L6 4"
                                  stroke="#F89B53"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </Link>
                          </Box>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12 mb-0">
                      <Card
                        className="cardDesign"
                        sx={{ p: { lg: 4, md: 3, sm: 2 } }}
                      >
                        <CardContent className="cardContent">
                          <Box component="div" className="userInfo">
                            <Box component="div" className="userIcon orange-bg">
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z"
                                  fill="white"
                                />
                              </svg>
                            </Box>
                            <Box component={"div"} className="userDeatil">
                              <Typography variant="h6" className="userName">
                                Inactive Users
                              </Typography>
                              <Typography variant="h6" className="userCount">
                                15
                              </Typography>
                            </Box>
                          </Box>
                          <Box component={"div"}>
                            <Link
                              to="/admin/users"
                              className="px-0 btn text-orange link-text gap-1 align-items-center"
                            >
                              View All{" "}
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6 12L10 8L6 4"
                                  stroke="#F89B53"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </Link>
                          </Box>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <Card className="cardDesign">
                    <CardContent className="cardContent">
                      <Box className="tableHeader">
                        <Grid container spacing={1} p={"0 !important"}>
                          <Grid
                            item
                            xs={"auto"}
                            sx={{ flexGrow: " 1 !important" }}
                          >
                            <Typography variant="h6" className="tableHeading">
                              Account
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
                              <FormControl className="small-select-box position-relative">
                                <Select
                                  size="small"
                                  labelId="demo-select-small-label"
                                  id="demo-select-small"
                                  value={age}
                                  placeholder="Age"
                                  onChange={handleChange}
                                  IconComponent={(props) => (
                                    <svg
                                      width="10"
                                      height="7"
                                      viewBox="0 0 10 7"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      {...props}
                                      className="dropArrow"
                                    >
                                      <path
                                        d="M1 1.5L5 5.5L9 1.5"
                                        stroke="#53545C"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                >
                                  <MenuItem value={10}>Ten</MenuItem>
                                  <MenuItem value={20}>Twenty</MenuItem>
                                  <MenuItem value={30}>Thirty</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
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
