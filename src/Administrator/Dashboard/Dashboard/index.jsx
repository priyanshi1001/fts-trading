import React, { Fragment, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ThemeOptions from "../../../Layout/ThemeOptions";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AppHeader from "../../../Layout/AppHeader";
import { useDispatch, useSelector } from "react-redux";
import Transition from "../../../reusables/languagesModal";
import AppSidebar from "../../../Layout/AppSidebar";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  // exportContent,
  getAllContentType,
  getAllLanguages,
  getContentLanguageById,
  importContent,
} from "../../../redux/Actions";
import { Route, useHistory } from "react-router-dom";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AppFooter from "../../../Layout/AppFooter";
import "./index.scss";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  TextField,
  Typography,
  Collapse,
  CardHeader,
  IconButton,
  CardContent,
  CardActions,
  Card,
  Divider,
  Grid,
  Select,
  MenuItem,
  Checkbox,
  Button,
  Tooltip,
  Breadcrumbs,
  Link,
} from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import DialogTransition from "../../../reusables/deleteDialog";
import Modal from "../../../reusables/htmlDialog";

// getAllContentTypeByIdReducer   getAllContentType

const typeIdList = [{ ContentBlock: 1 }, { EasyHelp: 2 }, { Phrases: 3 }];
export default function ContentManagement() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [typeId, setTypeId] = React.useState(1);
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [rowId, setRowId] = useState({});
  const [fileData, setFileData] = useState();
  const [open1, setOpen1] = useState(false);
  const handleClickOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [idData, setIdData] = useState(0);
  const [search, setSearch] = useState("");
  const [dropDownData, setDropDownData] = useState([]);
  const [open2, setOpen2] = useState(false);
  const handleClickOpen2 = () => setOpen2(true);
  const handleClose2 = () => {
    setOpen2(false);
    setRowId({});
  };
  const languageData = useSelector((state) => state.LanguagesReducer);
  const [data, setData] = React.useState({
    // id: 4,
    name: "",
    text: "",
    moreText: "",
    language: null,
    translation: null,
    toolTip: "",
    typeId: null,
  });
  const setSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSize(10);
    dispatch(getAllContentType(page, size, search));
  };
  useEffect(() => {
    if (search === "") {
      setPage(1);
      setSize(10);
      dispatch(getAllContentType(page, size, search));
    }
  }, [search]);
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    dispatch(getAllContentType(page, size));
  }, [page]);

  const tableData = useSelector((state) => state.getAllContentTypeByIdReducer);

  useEffect(() => {
    dispatch(getAllContentType(page, size, search));
    // dispatch(getAllLanguages());
  }, []);

  return (
    <Fragment>
      <ThemeOptions />
      <AppHeader />
      <div className="app-main">
        <AppSidebar />
        <div className="app-main__outer">
          <div className="app-main__inner">
            {/* <div className=" row mx-4"></div> */}
            {/* <div role="presentation" className="bread_crumbs">
              <Breadcrumbs aria-label="breadcrumb">
                <p underline="hover" color="#000000">
                  Content Block
                </p>
              </Breadcrumbs>
            </div> */}
            {/* <div className=" row m-1 card p-3 box_style">
              <form
                className="row"
                onSubmit={(e) => {
                  setSubmit(e);
                }}
              >
                <div className="col-8 d-flex ">
                  <TextField
                    style={{ backgroundColor: "#fff", borderRadius: "10px" }}
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mx-md-3 mx-auto w-50 rounded-Input"
                    placeholder="Search"
                    type="search"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
                <div className="col-4 ">
                  <Button
                    size="small"
                    type="submit"
                    className="btn-cstm"
                    style={{ float: "right", display: "none" }}
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div> */}
            <div className="row">
              <div className="col-12">
                <div className="d-flex align-items-center justify-content-end px-lg-5 px-md-4 px-sm-3 px-3 my-3">
                  <Link
                    className="textPurpal text-decoration-none fs-6 fw-medium"
                    to="/"
                  >
                    Stock Details{" "}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.1716 10.9999H4V12.9999H16.1716L10.8076 18.3638L12.2218 19.778L20 11.9999L12.2218 4.22168L10.8076 5.63589L16.1716 10.9999Z"
                        fill="#5570F1"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
              <div className="col-lg-3 col-md-12 col-12">
                <Card className="cardDesign">
                  <CardContent className="cardContent">
                    <h6 className="fs-6 mb-3">Account Information</h6>
                    <ul className="twopartContent">
                      <li>
                        Live Account Values
                        <span className="digit">1,056,250</span>
                      </li>
                      <li>
                        Cash Buying Power
                        <span className="digit">35,0000</span>
                      </li>
                      <li>
                        Margin Buying Power
                        <span className="digit">1,750.25</span>
                      </li>
                      <li>
                        Day Trading buying Power
                        <span className="digit">3.150,251</span>
                      </li>
                      <li>
                        Day Trade Excess
                        <span className="digit">521,245</span>
                      </li>
                      <li>
                        Today’s Trading G/L
                        <span className="digit text-success">3,535</span>
                      </li>
                      <li>
                        YTD Trading Gain
                        <span className="digit text-success">25,625</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="cardDesign">
                  <CardContent className="cardContent">
                    <h6 className="fs-6 mb-3">Screen Triggered</h6>
                    <table className="table w-100 simpleTable table-borderless">
                      <thead>
                        <tr>
                          <th> </th>
                          <th>Time</th>
                          <th>Symbol</th>
                          <th>Screen Trig</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <input
                              type="radio"
                              name="radio"
                              className="form-check-input"
                              id="radio1"
                            />
                          </td>
                          <td>10:55</td>
                          <td>AAPL</td>
                          <td>PUBackinUptrnd</td>
                          <td className="text-center">
                            <Button className="btn btn-secondary rounded-circle px-2 deleteBtn">
                              {" "}
                              <DeleteOutlinedIcon fontSize="12px" />
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input
                              type="radio"
                              name="radio"
                              className="form-check-input"
                              id="radio2"
                            />
                          </td>
                          <td>10:55</td>
                          <td>AAPL</td>
                          <td>PUBackinUptrnd</td>
                          <td className="text-center">
                            <Button className="btn btn-secondary rounded-circle px-2 deleteBtn">
                              {" "}
                              <DeleteOutlinedIcon fontSize="12px" />
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input
                              type="radio"
                              name="radio"
                              className="form-check-input"
                              id="radio3"
                            />
                          </td>
                          <td>10:55</td>
                          <td>AAPL</td>
                          <td>PUBackinUptrnd</td>
                          <td className="text-center">
                            <Button className="btn btn-secondary rounded-circle px-2 deleteBtn">
                              {" "}
                              <DeleteOutlinedIcon fontSize="12px" />
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </div>
              <div className="col-lg-9 col-md-12 col-12">
                <Card className="cardDesign">
                  <div className="cardHeader mb-lg-5 mb-md-4 mb-sm-3 mb-3">
                    <h6 className="fs-6 mb-3">Order Ticket- Stock</h6>
                    <h6 className="fs-6 mb-3">10-May-24 - 11:50:25 AM</h6>
                  </div>
                  <CardContent className="cardContent">
                    <div className="row">
                      <div className="col-md-3 col-12">
                        <div className="stockInfo">
                          <ul class="list-group mb-2">
                            <li className="list-group-item">Stock System</li>
                            <li className="list-group-item">AAPL</li>
                          </ul>
                          <p>Apple Computer Inc</p>
                        </div>
                        <div className="StockAction">
                          <ul class="list-group mb-2">
                            <li className="list-group-item border-0">
                              <div class="form-check p-0 d-flex align-items-center justify-content-between">
                                <label
                                  class="form-check-label  flex-grow-1"
                                  for="flexRadioDefault1"
                                >
                                  Buy
                                </label>
                                <input
                                  class="form-check-input m-0"
                                  type="radio"
                                  name="flexRadioDefault"
                                  id="flexRadioDefault1"
                                />
                              </div>
                            </li>
                            <li className="list-group-item border-0">
                              <div class="form-check p-0 d-flex align-items-center justify-content-between">
                                <label
                                  class="form-check-label flex-grow-1"
                                  for="flexRadioDefault2"
                                >
                                  Sell Short
                                </label>
                                <input
                                  class="form-check-input m-0"
                                  type="radio"
                                  name="flexRadioDefault"
                                  id="flexRadioDefault2"
                                  checked
                                />
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div className="StockActionClose">
                          <ul class="list-group mb-2">
                            <li className="list-group-item border-0">
                              <div class="form-check p-0 d-flex align-items-center justify-content-between">
                                <label
                                  class="form-check-label flex-grow-1"
                                  for="cancleTrade"
                                >
                                  Close
                                </label>
                                <input
                                  class="form-check-input m-0"
                                  type="radio"
                                  name="cancleTrade"
                                  id="cancleTrade"
                                />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-9 col-12">
                        <div className="row">
                          <div className="col-md-6 col-12">
                            <Card
                              className="cardDesign grayBg"
                              style={{ height: "calc(100% - 20px)" }}
                            >
                              <CardContent className="cardContent">
                                <div className="cardHeader mb-3">
                                  <h6 className="fs-7 fw-500 semiGray">
                                    Current prices
                                  </h6>
                                </div>
                                <div className="bitTable">
                                  <table className="table table-striped-columns table-borderless">
                                    <thead>
                                      <tr>
                                        <th
                                          scope="col"
                                          className="semiGray bg-white"
                                        >
                                          Bid
                                        </th>
                                        <th
                                          scope="col"
                                          className="semiGray lightGreenBg"
                                        >
                                          Mid
                                        </th>
                                        <th
                                          scope="col"
                                          className="semiGray bg-white"
                                        >
                                          Ask
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td className=" bg-white">
                                          <p className=" ">10:55</p>
                                        </td>
                                        <td className="  lightGreenBg">
                                          <p className=" ">10:55</p>
                                        </td>
                                        <td className=" bg-white">
                                          <p className=" ">10:55</p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div className="totalShare d-flex align-items-center justify-content-between">
                                  <h5 className="fw-bold fs-7"># of Shares</h5>
                                  <input
                                    type="number"
                                    className="form-control borderd-purple shadow-sm apperance-none"
                                    min={"1"}
                                    minLength={"1"}
                                    max={"1000"}
                                    maxLength={"1000"}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          <div className="col-md-6 col-12">
                            <Card className="cardDesign grayBg">
                              <CardContent className="cardContent">
                                <div className="cardHeader mb-3">
                                  <h6 className="fs-6">Order Type</h6>
                                </div>
                                <div className="row">
                                  <div className="col-6">
                                    <Card className="orderCard shadow-none rounded-1">
                                      <div className="card-header h-auto p-2">
                                        <h6 className="fs-7 fw-500 mb-0">
                                          Max- X
                                        </h6>
                                      </div>
                                      <div className="card-body p-0">
                                        <ul className="list-group ">
                                          <li className="list-group-item">
                                            Limited Order
                                          </li>
                                          <li className="list-group-item maxProfitNumber">
                                            150.16
                                          </li>
                                          <li className="list-group-item">
                                            Profit Order
                                          </li>
                                        </ul>
                                        <div className="priceWithProfit">
                                          <label htmlFor="addMoney"> $ </label>
                                          <input
                                            type="number"
                                            id="addMoney"
                                            className="apperance-none"
                                          />
                                          <select name="" id="" class="">
                                            <optgroup>
                                              <option value="">0%</option>
                                              <option value="">1%</option>
                                              <option value="">2%</option>
                                              <option value="">3%</option>
                                              <option value="">4%</option>
                                              <option value="">5%</option>
                                              <option value="">6%</option>
                                              <option value="">7%</option>
                                              <option value="">8%</option>
                                            </optgroup>
                                          </select>
                                        </div>
                                      </div>
                                    </Card>
                                  </div>
                                  <div className="col-6">
                                    <Card className="orderCard shadow-none rounded-1">
                                      <div className="card-header h-auto p-2">
                                        <h6 className="fs-7 fw-500 mb-0">
                                          Max- Y
                                        </h6>
                                      </div>
                                      <div className="card-body p-0">
                                        <ul className="list-group ">
                                          <li className="list-group-item">
                                            Market Order
                                          </li>
                                          <li className="list-group-item ">
                                            &nbsp;
                                          </li>
                                          <li className="list-group-item">
                                            Stop Loss
                                          </li>
                                        </ul>
                                        <div className="priceWithProfit">
                                          <label htmlFor="addMoney"> $ </label>
                                          <input
                                            type="number"
                                            id="addMoney"
                                            className="apperance-none"
                                          />
                                          <select name="" id="" class="">
                                            <optgroup>
                                              <option value="">0%</option>
                                              <option value="">1%</option>
                                              <option value="">2%</option>
                                              <option value="">3%</option>
                                              <option value="">4%</option>
                                              <option value="">5%</option>
                                              <option value="">6%</option>
                                              <option value="">7%</option>
                                              <option value="">8%</option>
                                            </optgroup>
                                          </select>
                                        </div>
                                      </div>
                                    </Card>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          <div className="col-md-6 col-12">
                            <Card
                              className="cardDesign grayBg "
                              style={{ height: "calc(100% - 20px)" }}
                            >
                              <CardContent className="cardContent">
                                <div className="cardHeader mb-0">
                                  <h6 className="fs-7 fw-500 semiGray">
                                    Existing Position
                                  </h6>
                                </div>
                                <div className="card-body p-0">
                                  <div className="existingPosition">
                                    <ul className="list-group">
                                      <li className="list-group-item">
                                        Existing Value of AAPL
                                        <span className="value">$11,000</span>
                                      </li>
                                      <li className="list-group-item">
                                        % of Live Account Value
                                        <span className="value"> 11%</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          <div className="col-md-6 col-12">
                            <Card className="cardDesign grayBg ">
                              <CardContent className="cardContent">
                                <div className="cardHeader mb-0">
                                  <h6 className="fs-7 fw-500 semiGray">
                                    Add to Position
                                  </h6>
                                </div>
                                <div className="card-body p-0">
                                  <div className="positionList">
                                    <ul className="list-unstyled">
                                      <li>5% </li>
                                      <li className="recomended">10% </li>
                                      <li>15% </li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="card-footer bg-transparent border-0 px-0 pb-0 mt-5">
                                  <div className="totalPosition">
                                    <ul className="list-unstyled mb-0">
                                      <li>$ 298,739</li>
                                      <li>28%</li>
                                    </ul>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          <div className="col-12 mt-2">
                            <div className="btn-box d-flex align-items-center justify-content-end">
                              <button className="btn btn-lg rounded-3 btn-purple">
                                submit
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className=" row m-1  card p-3" style={{ overflowX: "auto" }}>
              <div className="col-12 d-flex">
                <table class="table table-hover table-striped">
                  <Paper>
                    <TableContainer sx={{}}>
                      <Table
                        sx={{ minWidth: 650 }}
                        class="table table-hover table-striped"
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
                              align="left"
                              className="table_head tableRow1"
                            >
                              Translations
                            </TableCell>

                            <TableCell
                              align="right"
                              className="table_head tableRow1"
                            >
                              Action
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        {tableData?.contentData &&
                        tableData?.contentData?.records?.length ? (
                          <TableBody>
                            {tableData?.contentData?.records.map((row) => (
                              <TableRow
                                align="left"
                                className="tableRow1"
                                key={row.name}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell className="table_content tableRow1">
                                  {row.name}
                                </TableCell>

                                <TableCell
                                  align="left"
                                  className="table_content tableRow1"
                                  // onClick={() => getLangById(row.id)}
                                >
                                  <span
                                    className="addSubpage "
                                    onClick={() => {
                                      setOpen2(true);
                                      setDropDownData(row?.id);
                                      dispatch(
                                        getContentLanguageById(
                                          row?.id,
                                          (item) => setRowId(item)
                                        )
                                      );
                                    }}
                                  >
                                    Select Languages
                                  </span>
                                </TableCell>
                                <TableCell
                                  className="table_content tableRow1"
                                  align="right"
                                >
                                  {row.action}
                                  <div className="actionRow">
                                    <EditIcon
                                      style={{
                                        color: "green",
                                        fontSize: "20px",
                                      }}
                                      onClick={() => {
                                        history.push(
                                          `/content_edits/${row.id}`
                                        );
                                      }}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        ) : (
                          <div className="notDataDiv">No Data Available</div>
                        )}
                      </Table>
                    </TableContainer>
                  </Paper>
                </table>
              </div>
              {tableData?.contentData?.totalPages > 1 ? (
                <Stack spacing={2}>
                  <Pagination
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    count={tableData?.contentData?.totalPages}
                    onChange={(e, value) => setPage(value)}
                  />
                </Stack>
              ) : (
                ""
              )}
            </div>
            <div className="col-12 mb-4 mt-2">
              <Button
                size="small"
                className="btn-cstm mx-1 mb-4"
                style={{ float: "right", marginLeft: "5px" }}
                onClick={() => {
                  setOpen1(true);
                }}
              >
                Import
              </Button>

              <Button
                size="small"
                className="btn-cstm  mb-4"
                style={{ float: "right", marginLeft: "5px" }}
                onClick={() => {
                  // dispatch(exportContent());
                }}
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
      <DialogTransition
        open={open}
        // deleteItems={deleteItems}
        setOpen={setOpen}
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        // deleteApi={deletePAGES}
        // getAllApi={getAllPages}
      />

      <Transition
        open={open2}
        rowId={rowId}
        redirectFunc={(langId, i) => {
          history.push(`/content_language/${langId}/${i?.id}`);
        }}
        langId={dropDownData}
        setOpen={setOpen2}
        handleClickOpen={handleClickOpen2}
        handleClose={handleClose2}
      />

      <Modal
        open={open1}
        // deleteItems={deleteItems}
        fileData={fileData}
        setFileData={setFileData}
        dispatch={dispatch}
        setOpen={setOpen1}
        handleClickOpen={handleClickOpen1}
        handleClose={handleClose1}
        Heading="Import Content Block Data"
        apiCall={(formData) => {
          dispatch(importContent(formData));
        }}
      />
    </Fragment>
  );
}
