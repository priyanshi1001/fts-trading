import React, { Fragment, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import moment from "moment";
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
// import AppFooters from "../../../Layout/AppFooter";
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
import { Route, useHistory, useLocation, Link } from "react-router-dom";
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
  Box,
} from "@mui/material";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import DialogTransition from "../../../reusables/deleteDialog";
import Modal from "../../../reusables/htmlDialog";
import { toast } from "react-toastify";
import {
  fetchAccountDetail,
  fetchIBAuthStatus,
  fetchIBPortfolioSummary,
  fetchIBPortfolioAccounts,
  orderPlaceApi,
  fetchIBContractInfo,
  fetchIBOpenOders
} from "../../../api/ApiCall"

// getAllContentTypeByIdReducer   getAllContentType

const typeIdList = [{ ContentBlock: 1 }, { EasyHelp: 2 }, { Phrases: 3 }];
export default function ContentManagement() {
  const dispatch = useDispatch();
  const history = useHistory();
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
  const [dropDownData, setDropDownData] = useState([]);
  const [open2, setOpen2] = useState(false);

  const [accountDetail, setAccountDetail] = useState(null);
  const [contractInfo, setContractInfo] = useState(null);
  const [formData, setFormData] = useState({});
  const [openOrderList, setOpenOrderList] = useState([]);
  const [date, setDate] = useState(new Date());

  let searchParams = {};
  const location = useLocation();
  if (location?.search) {
    let locSearch = location.search.split("?")[1] || "";
    let searchArr = locSearch.split("&") || [];
    for (let dt of searchArr) {
      let queryArr = dt.split("=") || [];
      if (queryArr[0] && queryArr[1])
        searchParams = { ...searchParams, [queryArr[0]]: queryArr[1] };
    }
  }

  useEffect(() => {
    fetchIBPortfolioSummary().then((response) => {
      setAccountDetail(response || null);
    }).catch((err) => {
      console.log("Account Details Error:", err);
      toast.error("Something went wrong.");
    });

    const conid = searchParams.conid || "";
    const symbol = searchParams.symbol || "";
    fetchIBContractInfo(conid).then((response) => {
      setContractInfo(response || null);
    }).catch((err) => {
      console.log("Fetch Contract Info:", err);
    });

    fetchIBOpenOders().then((response) => {
      setOpenOrderList(response?.orders || []);
    }).catch((err) => {
      console.log("Fetch Open Orders:", err);
    })
  }, []);

  // useEffect(()=>{
  //   setDate(new Date());
  // })

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

  };
  const tableData = useSelector((state) => state.getAllContentTypeByIdReducer);

  function handleNumericInput(e) {
    const name = e.target.name;
    const value = e.target.value;

    if (+value || value == "") {
      setFormData({ ...formData, [name]: value });
    }
  }

  function handleSubmitButton(e) {
    let checkValidation = true;

    if (!formData?.orderType) {
      toast.error("Please select order type.", {
        toastId: "form-error"
      });
      checkValidation = false;
    }
    if (!formData?.shares) {
      toast.error("Please enter number of shares.", {
        toastId: "form-error"
      });
      checkValidation = false;
    }

    if (checkValidation)
      setOpen1(true);
  }

  function placeOrderFun() {
    orderPlaceApi({
      "orders": [
        {
          "acctId": "DU9313757",
          "conid": 94127580,
          "secType": "94127580@NSE",
          "cOId": "IBOrderPlace",
          "orderType": "LMT",
          "price": 1000,
          "side": "BUY", // SELL
          "tif": "DAY",
          "quantity": 10,
          "strategy": "Adaptive",
          "strategyParameters": { "adaptivePriority": "Normal" }
        }
      ]
    }).then((response) => {
      console.log("orderPlaceApi response==============", response);
      setFormData({});
      setOpen1(false);
      toast.success("Order successfully placed.")
    }).catch((err) => {
      console.log("Order Place Error:", err);
      setOpen1(false);
      toast.error("Something went wrong. please try again.");
    });

  }

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
                    onClick={() => {
                      history.push("/Stocks_Details");
                    }}
                  >
                    Stock Details{" "}
                    <svg
                      width="18"
                      height="18"
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
                        <span className="digit">{accountDetail?.["availablefunds-s"]?.amount || 0}</span>
                      </li>
                      <li>
                        Cash Buying Power
                        <span className="digit">{accountDetail?.["buyingpower"]?.amount || 0}</span>
                      </li>
                      <li>
                        Margin Buying Power
                        <span className="digit">{(accountDetail?.["fullinitmarginreq-s"]?.amount.toFixed(3) || 0)}</span>
                      </li>
                      <li>
                        Day Trading buying Power
                        <span className="digit">{0}</span>
                      </li>
                      <li>
                        Day Trade Excess
                        <span className="digit">{accountDetail?.["excessliquidity-s"]?.amount || 0}</span>
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
                <Card
                  className="cardDesign"
                  sx={{ padding: "15px !important" }}
                >
                  <CardContent className="cardContent">
                    <h6 className="fs-6 mb-3">Screen Triggered</h6>
                    <div className="table-responsive">
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
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="col-lg-9 col-md-12 col-12">
                <Card className="cardDesign">
                  <div className="cardHeader mb-lg-5 mb-md-4 mb-sm-3 mb-3">
                    <h6 className="fs-6 mb-3">Order Ticket- Stock</h6>
                    <h6 className="fs-6 mb-3">{moment(date).format("DD-MMM-YY")} - {moment(date).format("hh:mm:ss A")}</h6>
                  </div>
                  <CardContent className="cardContent">
                    <div className="row">
                      <div className="col-lg-3 col-12">
                        <div className="stockInfo">
                          <ul class="list-group mb-2">
                            <li className="list-group-item">Stock System</li>
                            <li className="list-group-item">{contractInfo?.symbol || "--"}</li>
                          </ul>
                          <p>{contractInfo?.company_name || "--"}</p>
                        </div>
                        <div className="StockAction">
                          <ul class="list-group mb-2">
                            <li className="list-group-item border-0">
                              <div class="form-check p-0 d-flex align-items-center justify-content-between">
                                <label
                                  class="form-check-label  flex-grow-1"
                                  htmlFor="buy-checkbox"
                                >
                                  Buy
                                </label>
                                <input
                                  class="form-check-input m-0"
                                  type="radio"
                                  name="orderType"
                                  id="buy-checkbox"
                                  onChange={(e) => { setFormData({ ...formData, orderType: "BUY" }) }}
                                  checked={formData?.orderType == "BUY" ? true : false}
                                />
                              </div>
                            </li>
                            <li className="list-group-item border-0">
                              <div class="form-check p-0 d-flex align-items-center justify-content-between">
                                <label
                                  class="form-check-label flex-grow-1"
                                  htmlFor="sell-short-checkbox"
                                >
                                  Sell Short
                                </label>
                                <input
                                  class="form-check-input m-0"
                                  type="radio"
                                  name="orderType"
                                  id="sell-short-checkbox"
                                  onChange={(e) => { setFormData({ ...formData, orderType: "SELL" }) }}
                                  checked={formData?.orderType == "SELL" ? true : false}
                                />
                              </div>
                            </li>
                            <li className="list-group-item border-0">
                              <div class="form-check p-0 d-flex align-items-center justify-content-between">
                                <label
                                  class="form-check-label flex-grow-1"
                                  htmlFor="close-checkbox"
                                >
                                  Close
                                </label>
                                <input
                                  class="form-check-input m-0"
                                  type="radio"
                                  name="orderType"
                                  id="close-checkbox"
                                  onChange={(e) => { setFormData({ ...formData, orderType: "CLOSE" }) }}
                                  checked={formData?.orderType == "CLOSE" ? true : false}
                                />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-9 col-12">
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
                                    type="text"
                                    name="shares"
                                    className="form-control borderd-purple shadow-sm apperance-none"
                                    value={formData?.shares || ""}
                                    onChange={handleNumericInput}
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
                                            <input
                                              type="text"
                                              name="max_x"
                                              className="form-control borderd-purple shadow-sm apperance-none"
                                              value={formData?.max_x || ""}
                                              onChange={handleNumericInput}
                                            />
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
                                            name="profit_order"
                                            className="apperance-none"
                                            value={formData?.profit_order || ""}
                                            onChange={handleNumericInput}
                                          />
                                          <select name="profit_order_percentage" onChange={handleNumericInput}>
                                            <optgroup>
                                              <option value=""></option>
                                              <option value="1">1%</option>
                                              <option value="2">2%</option>
                                              <option value="3">3%</option>
                                              <option value="4">4%</option>
                                              <option value="5">5%</option>
                                              <option value="6">6%</option>
                                              <option value="7">7%</option>
                                              <option value="8">8%</option>
                                              <option value="10">10%</option>
                                              <option value="100">100%</option>
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
                                            <input
                                              type="text"
                                              name="max_y"
                                              className="form-control borderd-purple shadow-sm apperance-none"
                                              value={formData?.max_y || ""}
                                              onChange={handleNumericInput}
                                            />
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
                                            name="stop_loss"
                                            className="apperance-none"
                                            value={formData?.stop_loss || ""}
                                            onChange={handleNumericInput}
                                          />
                                          <select name="stop_loss_percentage" onChange={handleNumericInput}>
                                            <optgroup>
                                              <option value=""></option>
                                              <option value="1">1%</option>
                                              <option value="2">2%</option>
                                              <option value="3">3%</option>
                                              <option value="4">4%</option>
                                              <option value="5">5%</option>
                                              <option value="6">6%</option>
                                              <option value="7">7%</option>
                                              <option value="8">8%</option>
                                              <option value="9">9%</option>
                                              <option value="10">10%</option>
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
                              <button
                                className="btn btn-lg rounded-3 btn-purple"
                                onClick={handleSubmitButton}
                              >
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
            <div className=" row">
              <div className="col-12 mb-1">
                <Card className="cardDesign">
                  <Box className="tableHeader">
                    <Grid container spacing={1} p={"0 !important"}>
                      <Grid item xs={"auto"} sx={{ flexGrow: " 1 !important" }}>
                        <Typography variant="h6" className="tableHeading">
                          Existing Position{" "}
                        </Typography>
                      </Grid>
                      <Grid item xs={"auto"}>
                        <Box className="btn-box d-flex align-items-center justify-content-end gap-3">
                          <button className="btn btn-sm btn-outline-lightBlue">
                            Today’s UR NetGn/Ls - 900
                          </button>
                          <button className="btn btn-sm btn-outline-orange">
                            Today’s UR Gn/Ls - 2164
                          </button>
                          <button className="btn btn-sm btn-outline-lightYellow">
                            System exit Yes/No-0
                          </button>
                          <button className="btn btn-sm btn-blue">
                            Preview
                            <svg
                              width="12"
                              height="17"
                              viewBox="0 0 12 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ marginInlineStart: "10px" }}
                            >
                              <path
                                d="M11.376 8.9161L0.77735 15.9818C0.54759 16.135 0.23715 16.0729 0.0839701 15.8432C0.0292201 15.761 0 15.6645 0 15.5658V1.43433C0 1.15818 0.22386 0.934326 0.5 0.934326C0.59871 0.934326 0.69522 0.963546 0.77735 1.0183L11.376 8.084C11.6057 8.2372 11.6678 8.5477 11.5146 8.7774C11.478 8.8323 11.4309 8.8795 11.376 8.9161Z"
                                fill="white"
                              />
                            </svg>
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
                                      getContentLanguageById(row?.id, (item) =>
                                        setRowId(item)
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
                                      history.push(`/content_edits/${row.id}`);
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
                  <Box className="tableFooter">
                    {tableData?.contentData?.totalPages > 1 ? (
                      <Stack spacing={2}>
                        <Pagination
                          className="d-flex justify-content-end"
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
                  </Box>
                </Card>
              </div>
              <div className="col-12 mb-3">
                <Card className="cardDesign">
                  <Box className="tableHeader">
                    <Grid container spacing={1} p={"0 !important"}>
                      <Grid item xs={"auto"} sx={{ flexGrow: " 1 !important" }}>
                        <Typography variant="h6" className="tableHeading">
                          Open Order
                        </Typography>
                      </Grid>
                      <Grid item xs={"auto"}>
                        <Box className="btn-box d-flex align-items-center justify-content-end gap-3">
                          <button className="btn btn-sm btn-blue">
                            Preview
                            <svg
                              width="12"
                              height="17"
                              viewBox="0 0 12 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ marginInlineStart: "10px" }}
                            >
                              <path
                                d="M11.376 8.9161L0.77735 15.9818C0.54759 16.135 0.23715 16.0729 0.0839701 15.8432C0.0292201 15.761 0 15.6645 0 15.5658V1.43433C0 1.15818 0.22386 0.934326 0.5 0.934326C0.59871 0.934326 0.69522 0.963546 0.77735 1.0183L11.376 8.084C11.6057 8.2372 11.6678 8.5477 11.5146 8.7774C11.478 8.8323 11.4309 8.8795 11.376 8.9161Z"
                                fill="white"
                              />
                            </svg>
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
                                {row?.price} ({row?.cashCcy})
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
                  <Box className="tableFooter">
                    {tableData?.contentData?.totalPages > 1 ? (
                      <Stack spacing={2}>
                        <Pagination
                          className="d-flex justify-content-end"
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
                  </Box>
                </Card>
              </div>
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
        formData={formData}
        fileData={fileData}
        setFileData={setFileData}
        dispatch={dispatch}
        setOpen={setOpen1}
        handleClickOpen={handleClickOpen1}
        handleClose={handleClose1}
        Heading="Confirm Order "
        apiCall={placeOrderFun}
      />
    </Fragment>
  );
}
