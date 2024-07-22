import React, { Fragment, useEffect, useState } from "react";
import moment from "moment";
import cryptoRandomString from "crypto-random-string";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ThemeOptions from "../../../Layout/ThemeOptions";
import EditIcon from "@mui/icons-material/Edit";
import AppHeader from "../../../Layout/AppHeader";
import AppSidebar from "../../../Layout/AppSidebar";
// import AppFooters from "../../../Layout/AppFooter";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useHistory, useLocation, Link } from "react-router-dom";
import "./index.scss";
import {
  Typography,
  CardContent,
  Card,
  Grid,
  Button,
  Box,
} from "@mui/material";
import Modal from "../../../reusables/htmlDialog";
import { toast } from "react-toastify";
import {
  fetchIBAccountDetail,
  fetchIBPortfolioSummary,
  orderPlaceApi,
  fetchIBContractInfo,
  fetchIBOpenOders,
  orderConfirmApi,
  fetchIBSnapshotApi,
  fetchIBPnlApi,
  saveOrderResponseApi,
  fetchPortfolioPositionApi
} from "../../../api/ApiCall";

export default function ContentManagement() {
  const history = useHistory();
  const [open1, setOpen1] = useState(false);
  const [accountDetail, setAccountDetail] = useState(null);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [contractInfo, setContractInfo] = useState(null);
  const [pnlInfo, setPnlInfo] = useState(null);
  const [placeOrderBtt, setPlaceOrderBtt] = useState(true);
  const [formData, setFormData] = useState({
    stockPosition: 10,
    tif: "DAY"
  });
  const [openOrderList, setOpenOrderList] = useState([]);
  const [existingOrder, setExistingOrder] = useState([]);
  const [snapshot, setSnapshot] = useState({
    bid: 0,
    mid: 0,
    ask: 0,
    lastPrice: 0,
  });

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
    fetchIBOpenOdersFun();
    fetchIBAccountDetailFun().then((response) => {
      fetchIBSnapshotFun(response);
    }).catch((err) => {
      console.log("Account Details Not Fetch.")
    });

    const conid = searchParams.conid || "";
    fetchIBContractInfo(conid)
      .then((response) => {
        setContractInfo(response || null);
      })
      .catch((err) => {
        console.log("Fetch Contract Info:", err);
      });

    fetchIBPnlApi().then((response) => {
      setPnlInfo(response || null);
    }).catch((err) => {
      console.log("Pnl Info Error:", err);
    });

  }, []);

  function fetchIBSnapshotFun(data) {
    const conid = searchParams.conid || "";
    if (!conid) {
      console.log("Contract id missing.")
      return 0;
    }
    fetchIBSnapshotApi(conid, "31,84,86")
      .then((response) => {
        if (!(+response?.[0]?.[84]) || !(+response?.[0]?.[86])) {
          fetchIBSnapshotFun(data);
          return 0;
        }
        let bid = +response?.[0]?.[84] || 0;
        let ask = +response?.[0]?.[86] || 0;
        let lastPrice = +response?.[0]?.[31] || 0;
        let mid = (bid + ask) / 2;
        mid = +mid.toFixed(2) || 0;
        setSnapshot({
          bid: bid,
          mid: mid,
          ask: ask,
          lastPrice: lastPrice,
        });

        let accountBal = 0;
        if (data?.["availablefunds-s"]?.amount) {
          accountBal = data["availablefunds-s"].amount;
        } else {
          accountBal = portfolioSummary?.["availablefunds-s"]?.amount || 0;
        }
        let shares = 0;
        let existingValue = 0;
        let liveAccPercentage = 0;
        if (+formData?.stockPosition && accountBal && mid) {
          existingValue = (+formData.stockPosition * accountBal) / 100;
          existingValue = +existingValue.toFixed(2);
          shares = existingValue / mid;
          shares = +shares.toFixed(2);
          liveAccPercentage = +formData.stockPosition;
        }

        setFormData({
          ...formData,
          shares,
          existingValue,
          liveAccPercentage,
          orderType: "LMT",
          limitPrice: mid
        });
      })
      .catch((err) => {
        console.log("IB Snapshot Error", err);
        toast.error("Current prices not fetch. please try after some time.");
      });
  }

  function fetchIBAccountDetailFun() {
    return new Promise((resolve, reject) => {
      fetchIBAccountDetail()
        .then((response) => {
          let accId = response?.selectedAccount || "";
          if (accId) {
            fetchPortfolioSummaryFun(accId, resolve, reject);
            fetchPortfolioPositionFun(accId);
          }
          setAccountDetail(response || null);
        })
        .catch((err) => {
          console.log("Account Details Error:", err);
          toast.error(
            "Interactive broker account detail not found. please login interactive broker acoount first",
            {
              toastId: "interactive-broker-login-error",
            }
          );
          reject();
        });
    });
  }

  function fetchPortfolioPositionFun(accId) {
    fetchPortfolioPositionApi(accId).then((response) => {
      setExistingOrder(response || []);
    }).catch((err) => {
      console.log("Portfolio Position Error:", err.message);
    });
  }

  function fetchPortfolioSummaryFun(accId, resolve, reject) {
    if (accId) {
      fetchIBPortfolioSummary(accId)
        .then((response) => {
          setPortfolioSummary(response || null);
          if (resolve) resolve(response);
        })
        .catch((err) => {
          console.log("Portfolio Summary Error:", err);
          toast.error("Portfolio summary not found. please try again.");
          if (reject) reject();
        });
    } else {
      toast.error(
        "Interactive broker account detail not found. please login interactive broker acoount first",
        {
          toastId: "interactive-broker-login-error",
        }
      );
      if (reject) reject();
    }
  }

  function fetchIBOpenOdersFun() {
    let filtersVal = `?Filters=inactive,pending_submit,pre_submitted,submitted,pending_cancel,cancelled,warn_state,sort_by_time`;
    fetchIBOpenOders(filtersVal)
      .then((response) => {
        setOpenOrderList(response?.orders || []);
      })
      .catch((err) => {
        console.log("Fetch Open Orders:", err);
      });
  }

  function handleNumericInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    let accountBal = portfolioSummary?.["availablefunds-s"]?.amount || 0;

    if (+value || value == "") {
      if (name == "profit_order")
        setFormData({ ...formData, [name]: value, profit_order_percentage: 0 });
      else if (name == "profit_order_percentage") {
        let tempProfOrder = percentageVal(+value, "profit");
        setFormData({ ...formData, [name]: value, profit_order: tempProfOrder });
      }
      else if (name == "stop_loss")
        setFormData({ ...formData, [name]: value, stop_loss_percentage: 0 });
      else if (name == "stop_loss_percentage") {
        let tempLossOrder = percentageVal(+value);
        setFormData({ ...formData, [name]: value, stop_loss: tempLossOrder });
      }
      else if (name == "limitPrice") {
        let shares = +formData?.shares || 0;
        let existingValue = 0;
        let liveAccPercentage = 0;
        let midPrice = +value || +snapshot.mid || 0;
        if (shares) {
          existingValue = midPrice * shares;
          existingValue = +existingValue.toFixed(2) || 0;
          if (accountBal) {
            liveAccPercentage = (existingValue * 100) / accountBal;
            liveAccPercentage = +liveAccPercentage.toFixed(2) || 0;
          }
          setFormData({
            ...formData,
            [name]: value,
            liveAccPercentage,
            existingValue,
          });
        } else {
          setFormData({ ...formData, [name]: value });
        }
      } else if (name == "shares") {
        let shares = +value;
        let existingValue = 0;
        let liveAccPercentage = 0;
        let midPrice = +formData?.limitPrice || +snapshot.mid || 0;
        if (shares) {
          existingValue = midPrice * shares;
          existingValue = +existingValue.toFixed(2) || 0;
          if (accountBal) {
            liveAccPercentage =
              (existingValue * 100) /
              (portfolioSummary?.["availablefunds-s"]?.amount || 0);
            liveAccPercentage = +liveAccPercentage.toFixed(2) || 0;
          }
        }
        setFormData({
          ...formData,
          [name]: value,
          liveAccPercentage,
          existingValue,
        });
      } else setFormData({ ...formData, [name]: value });
    }
  }

  function handleOrderTypeChange(e) {
    let value = e.target.value;
    let accountBal = portfolioSummary?.["availablefunds-s"]?.amount || 0;

    let shares = +formData?.shares || 0;
    let existingValue = 0;
    let liveAccPercentage = 0;
    let midPrice = +snapshot.mid || 0;
    if (shares) {
      existingValue = midPrice * shares;
      existingValue = +existingValue.toFixed(2) || 0;
      if (accountBal) {
        liveAccPercentage = (existingValue * 100) / accountBal;
        liveAccPercentage = +liveAccPercentage.toFixed(2) || 0;
      }
    }

    if (value == "LMT") {
      setFormData({
        ...formData,
        orderType: value,
        limitPrice: snapshot.mid,
        liveAccPercentage,
        existingValue,
      });
    } else {
      setFormData({
        ...formData,
        orderType: value,
        limitPrice: "",
        liveAccPercentage,
        existingValue,
      });
    }
  }

  function handleStockPosition(value, inputType) {
    if (+value || value == "") {
      let accountBal = portfolioSummary?.["availablefunds-s"]?.amount || 0;
      let midPrice = +formData?.limitPrice || +snapshot.mid || 0;
      let shares = 0;
      let existingValue = 0;
      let liveAccPercentage = 0;
      if (+value && accountBal && midPrice) {
        existingValue = (+value * accountBal) / 100;
        existingValue = +existingValue.toFixed(2);
        shares = existingValue / midPrice;
        shares = +shares.toFixed(2);
        liveAccPercentage = +value;
      }
      if (inputType == "input") {
        setFormData({
          ...formData,
          stockPositionVal: +value,
          stockPosition: 0,
          shares,
          existingValue,
          liveAccPercentage
        })
      } else {
        setFormData({
          ...formData,
          stockPosition: value,
          stockPositionVal: "",
          shares,
          existingValue,
          liveAccPercentage
        });
      }
    }
  }

  function handleSubmitButton(e) {
    let checkValidation = true;
    let accId = accountDetail?.selectedAccount || "";

    if (!accId) {
      toast.error(
        "Interactive broker account detail not found. please login interactive broker acoount first",
        {
          toastId: "form-error",
        }
      );
      checkValidation = false;
    }
    if (
      !contractInfo?.con_id ||
      !contractInfo?.symbol ||
      !contractInfo?.exchange
    ) {
      toast.error(
        "Invalid contract id or you are not login in interactive broker account.",
        {
          toastId: "form-error",
        }
      );
      checkValidation = false;
    }
    if (!formData?.shareType) {
      toast.error("Please select share type BUY or SELL.", {
        toastId: "form-error",
      });
      checkValidation = false;
    }
    if (!formData?.shares) {
      toast.error("Please enter number of shares quantity.", {
        toastId: "form-error",
      });
      checkValidation = false;
    }
    if (!snapshot?.ask || !snapshot?.bid || !snapshot?.mid) {
      toast.error(
        "Mid, Bid, Ask price not found. please check your interactive broker account login",
        {
          toastId: "form-error",
        }
      );
      checkValidation = false;
    }
    if (!formData?.orderType) {
      toast.error("Please select order type.", {
        toastId: "form-error",
      });
      checkValidation = false;
    } else if (
      formData?.orderType == "LMT" &&
      formData.limitPrice &&
      (+formData.limitPrice < snapshot.bid ||
        +formData.limitPrice > snapshot.ask)
    ) {
      toast.error(
        "Limit price should be greater than bid price and less than ask price.",
        {
          toastId: "form-error",
        }
      );
      checkValidation = false;
    }
    if (!formData?.tif) {
      toast.error("Please select TIF.", {
        toastId: "form-error",
      });
      checkValidation = false;
    }

    if (checkValidation) setOpen1(true);
  }

  function placeOrderFun() {
    const randomStr = cryptoRandomString({ length: 10 });
    let accId = accountDetail?.selectedAccount || "";
    if (!accId || !contractInfo) {
      toast.error(
        "Interactive broker account detail not found. please login interactive broker acoount first",
        {
          toastId: "interactive-broker-login-error",
        }
      );
      return 0;
    }
    setPlaceOrderBtt(false);
    let orderPayload = {
      orders: [
        {
          acctId: accId,
          conid: contractInfo.con_id,
          conidex: String(contractInfo.con_id),
          secType: String(contractInfo.con_id) + ":STK",
          cOID: randomStr,
          orderType: formData.orderType,
          listingExchange: contractInfo.exchange,
          isSingleGroup: false,
          outsideRTH: false,
          price: +formData?.limitPrice || snapshot.mid || 0,
          side: formData.shareType,
          ticker: contractInfo.symbol,
          tif: formData.tif,
          referrer: "QuickTrade",
          quantity: +formData.shares || 1,
          fxQty: 0,
          useAdaptive: false,
          isCcyConv: false,
          allocationMethod: "AvailableEquity",
          strategy: "Adaptive",
          strategyParameters: {
            adaptivePriority: "Normal",
          },
        },
      ],
    };
    let orderStoreObj = {
      accountId: accId,
      price: +formData?.limitPrice || snapshot.mid || 0,
      startDate: new Date(),
      ...formData,
      ...contractInfo,
      ...snapshot
    }
    orderPlaceApi(accId, orderPayload)
      .then((response) => {
        let result = response?.[0] || {};
        let orderId = result?.id || "";
        let order_id = result?.order_id || "";
        let order_status = result?.order_status || "";

        if (orderId) {
          orderConfirmationFun(orderId, {
            confirmed: true
          }).then((response2) => {
            let result2 = response2?.[0] || {};
            orderStoreObj = { ...orderStoreObj, ...result2 };
            orderSuccessPlaceMsg(orderStoreObj);
            setPlaceOrderBtt(true);
          }).catch((err) => {
            console.log("Order Confirmation Error:", err.message);
            toast.error("Something went wrong. please try again.");
            setPlaceOrderBtt(true);
          });
        } else if (order_status && order_id) {
          orderStoreObj = { ...orderStoreObj, ...result };
          orderSuccessPlaceMsg(orderStoreObj);
          setPlaceOrderBtt(true);
        } else {
          toast.error("Something went wrong. please try again");
          setPlaceOrderBtt(true);
        }
      })
      .catch((err) => {
        console.log("Order Place Error:", err);
        setOpen1(false);
        setPlaceOrderBtt(true);
        toast.error("Something went wrong. please try again.");
      });
  }

  function orderConfirmationFun(orderId, payload) {
    return new Promise((resolve, reject) => {
      orderConfirmApi(orderId, payload).then((response) => {
        let result = response?.[0] || {};
        if (result?.order_id && result?.order_status) resolve(response);
        else orderConfirmationFun(orderId, payload);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  function orderSuccessPlaceMsg(orderObj) {
    let accId = accountDetail?.selectedAccount || "";
    if (accId) {
      fetchPortfolioSummaryFun(accId);
      fetchPortfolioPositionFun(accId);
    }
    fetchIBOpenOdersFun();
    saveOrderResponseApi(orderObj).then((response) => {
      console.log("Save Order Response:", response);
      // setFormData({});
      setOpen1(false);
      toast.success("Order successfully placed.");
    }).catch((err) => {
      console.log("Save Order Api Error:", err.message);
      // setFormData({});
      setOpen1(false);
      toast.success("Order successfully placed.");
    })
  }


  function percentageVal(percentage, type) {
    let midPrice = +formData?.limitPrice || +snapshot.mid || 0;
    let result = (midPrice * percentage) / 100;
    if (type == "profit") {
      result = midPrice + result;
    } else {
      result = midPrice - result;
    }
    return +result.toFixed(2);
  }

  return (
    <Fragment>
      <ThemeOptions />
      <AppHeader />
      <div className="app-main">
        <AppSidebar />
        <div className="app-main__outer">
          <div className="app-main__inner">
            <div className="row">
              {/* <div className="col-12">
                <div className="d-flex align-items-center justify-content-end px-lg-5 px-md-4 px-sm-3 px-3 my-3">
                  <Link
                    className="textPurpal text-decoration-none fs-6 fw-medium"
                    to="/Stocks_Details"
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
              </div> */}
              <div
                className="col-lg-3 col-md-12 col-12 pt-2"
                style={{ marginBottom: "20px" }}
              >
                <Card className="cardDesign mb-0" style={{ height: "100%" }}>
                  <CardContent className="cardContent">
                    <h6 className="fs-6 mb-3">Account Information</h6>
                    <ul className="twopartContent">
                      <li>
                        Live Account Values
                        <span className="digit">
                          {portfolioSummary?.["availablefunds-s"]?.amount?.toFixed(2) || 0}
                        </span>
                      </li>
                      <li>
                        Cash Buying Power
                        <span className="digit">
                          {portfolioSummary?.["buyingpower"]?.amount?.toFixed(2) || 0}
                        </span>
                      </li>
                      <li>
                        Margin Buying Power
                        <span className="digit">
                          {portfolioSummary?.["fullinitmarginreq-s"]?.amount?.toFixed(2) || 0}
                        </span>
                      </li>
                      {/* <li>
                        Day Trading buying Power
                        <span className="digit">{0}</span>
                      </li> */}
                      <li>
                        Day Trade Excess
                        <span className="digit">
                          {portfolioSummary?.["excessliquidity-s"]?.amount?.toFixed(2) || 0}
                        </span>
                      </li>
                      <li>
                        Today’s Trading G/L
                        <span className="digit text-success">{pnlInfo?.["upnl"]?.[`${accountDetail?.selectedAccount}.Core`]?.["dpl"] || 0}</span>
                      </li>
                      <li>
                        Unrealized PnL
                        <span className="digit text-success">{pnlInfo?.["upnl"]?.[`${accountDetail?.selectedAccount}.Core`]?.["upl"] || 0}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <div className="col-lg-9 col-md-12 col-12 pt-2">
                <Card className="cardDesign">
                  <CardContent className="cardContent">
                    <div className="row">
                      {/* <div className="col-lg-3 col-12">
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
                                  name="shareType"
                                  id="buy-checkbox"
                                  onChange={(e) => { setFormData({ ...formData, shareType: "BUY" }) }}
                                  checked={formData?.shareType == "BUY" ? true : false}
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
                                  name="shareType"
                                  id="sell-short-checkbox"
                                  onChange={(e) => { setFormData({ ...formData, shareType: "SELL" }) }}
                                  checked={formData?.shareType == "SELL" ? true : false}
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
                                  name="shareType"
                                  id="close-checkbox"
                                  onChange={(e) => { setFormData({ ...formData, shareType: "CLOSE" }) }}
                                  checked={formData?.shareType == "CLOSE" ? true : false}
                                />
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div> */}
                      <div className="col-lg-12 col-12">
                        <div className="row">
                          <div className="col-md-12 col-12">
                            <Card
                              className="cardDesign grayBg"
                              style={{
                                height: "calc(100% - 20px)",
                                padding: "18px",
                                marginBottom: "15px",
                              }}
                            >
                              <CardContent className="cardContent">
                                <div className="row">
                                  <div className="col-md-6 col-12">
                                    <div className="totalShare">
                                      {/* <h5 className="fw-bold fs-7">Stock System</h5> */}
                                      <h5 className="fw-bold fs-7">
                                        {contractInfo?.symbol || "--"}{" "}
                                        {contractInfo?.company_name
                                          ? `(${contractInfo.company_name})`
                                          : "--"}
                                      </h5>
                                    </div>
                                    <div className="cardHeader mb-2 flex-wrap gap-2">
                                      <h6 className="fs-7 fw-500 semiGray mb-0">
                                        Current prices
                                      </h6>
                                      <div className="userInputAction d-flex justify-content-start align-items-center gap-3">
                                        <div class="form-check p-0 d-flex align-items-center justify-content-between">
                                          <label
                                            class="form-check-label  flex-grow-1"
                                            htmlFor="buy-checkbox"
                                          >
                                            Buy
                                          </label>
                                          <input
                                            class="form-check-input m-0 ms-1"
                                            type="radio"
                                            name="shareType"
                                            id="buy-checkbox"
                                            onChange={(e) => {
                                              setFormData({
                                                ...formData,
                                                shareType: "BUY",
                                              });
                                            }}
                                            checked={
                                              formData?.shareType == "BUY"
                                                ? true
                                                : false
                                            }
                                          />
                                        </div>
                                        <div class="form-check p-0 d-flex align-items-center justify-content-between">
                                          <label
                                            class="form-check-label flex-grow-1"
                                            htmlFor="sell-short-checkbox"
                                          >
                                            Sell Short
                                          </label>
                                          <input
                                            class="form-check-input m-0  ms-1"
                                            type="radio"
                                            name="shareType"
                                            id="sell-short-checkbox"
                                            onChange={(e) => {
                                              setFormData({
                                                ...formData,
                                                shareType: "SELL",
                                              });
                                            }}
                                            checked={
                                              formData?.shareType == "SELL"
                                                ? true
                                                : false
                                            }
                                          />
                                        </div>
                                        <div class="form-check p-0 d-flex align-items-center justify-content-between">
                                          <label
                                            class="form-check-label flex-grow-1"
                                            htmlFor="close-checkbox"
                                          >
                                            Close
                                          </label>
                                          <input
                                            class="form-check-input m-0  ms-1"
                                            type="radio"
                                            name="shareType"
                                            id="close-checkbox"
                                            onChange={(e) => {
                                              setFormData({
                                                ...formData,
                                                shareType: "CLOSE",
                                              });
                                            }}
                                            checked={
                                              formData?.shareType == "CLOSE"
                                                ? true
                                                : false
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="bitTable">
                                      <table className="table table-striped-columns table-borderless mb-2">
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
                                              <p className=" ">
                                                {snapshot.bid}
                                              </p>
                                            </td>
                                            <td className="  lightGreenBg">
                                              <p className=" ">
                                                {snapshot.mid}
                                              </p>
                                            </td>
                                            <td className=" bg-white">
                                              <p className=" ">
                                                {snapshot.ask}
                                              </p>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>

                                    <Card className="cardDesign bg-light my-2 mb-md-0 py-2 px-3">
                                      <CardContent className="cardContent">
                                        <div className="cardHeader mb-0">
                                          <h6 className="fs-7 fw-500 semiGray mb-1">
                                            Existing Position
                                          </h6>
                                        </div>
                                        <div className="card-body p-0">
                                          <div className="existingPosition">
                                            <ul className="list-group">
                                              <li className="list-group-item">
                                                Existing Value of{" "}
                                                {contractInfo?.symbol || "--"}
                                                <span className="value">
                                                  $
                                                  {formData?.existingValue || 0}
                                                </span>
                                              </li>
                                              <li className="list-group-item">
                                                % of Live Account Value
                                                <span className="value">
                                                  {" "}
                                                  {formData?.liveAccPercentage ||
                                                    0}
                                                  %
                                                </span>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>
                                  <div className="col-md-6 col-12">
                                    <div className="totalShare">
                                      <div className="row">
                                        <div className="col-lg-3 col-md-6 col-12">
                                          <h5 className="fw-bold fs-7">Qty</h5>
                                          <input
                                            type="text"
                                            name="shares"
                                            className="form-control borderd-purple shadow-sm apperance-none"
                                            value={formData?.shares || ""}
                                            onChange={handleNumericInput}
                                          />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12">
                                          <h5 className="fw-bold fs-7">
                                            Order Type
                                          </h5>
                                          <div
                                            className="row "
                                            style={{ marginInline: "-0.2rem" }}
                                          >
                                            <div className="col-6 px-1">
                                              <select
                                                name="orderType"
                                                value={
                                                  formData?.orderType || ""
                                                }
                                                onChange={handleOrderTypeChange}
                                                className="form-select"
                                              >
                                                <option value="LMT">LMT</option>
                                                <option value="MKT">MKT</option>
                                                <option value="STP">STP</option>
                                                <option value="STOP_LIMIT">
                                                  STOP LIMIT
                                                </option>
                                                <option value="MIDPRICE">
                                                  MIDPRICE
                                                </option>
                                                <option value="TRAIL">
                                                  TRAIL
                                                </option>
                                                <option value="TRAILLMT">
                                                  TRAILLMT
                                                </option>
                                              </select>
                                            </div>
                                            <div className="col-6 px-1">
                                              {formData?.orderType == "LMT" ? (
                                                <input
                                                  type="text"
                                                  name="limitPrice"
                                                  className="form-control borderd-purple shadow-sm apperance-none"
                                                  value={
                                                    formData?.limitPrice || ""
                                                  }
                                                  onChange={handleNumericInput}
                                                  placeholder="Limit Price"
                                                />
                                              ) : (
                                                <input
                                                  type="text"
                                                  name="limitPrice"
                                                  className="form-control borderd-purple shadow-sm apperance-none"
                                                  value={
                                                    formData?.orderType || ""
                                                  }
                                                  disabled
                                                />
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-lg-3 col-md-6 col-12">
                                          <h5 className="fw-bold fs-7">TIF</h5>
                                          <select
                                            className="form-select"
                                            name="tif"
                                            value={formData?.tif || ""}
                                            onChange={(e) =>
                                              setFormData({
                                                ...formData,
                                                tif: e.target.value,
                                              })
                                            }
                                          >
                                            <option value="DAY">DAY</option>
                                            <option value="GTC">GTC</option>
                                            <option value="OPG">OPG</option>
                                            <option value="IOC">IOC</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="row">
                                      <div className="col-6">
                                        Profit Order
                                        <div className="priceWithProfit bg-light">
                                          <label htmlFor="addMoney ">$ </label>
                                          <input
                                            type="number"
                                            id="addMoney"
                                            name="profit_order"
                                            className="apperance-none px-2"
                                            value={formData?.profit_order || ""}
                                            onChange={handleNumericInput}
                                          />
                                          <select
                                            name="profit_order_percentage"
                                            onChange={handleNumericInput}
                                            value={
                                              formData?.profit_order_percentage ||
                                              0
                                            }
                                          >
                                            <optgroup>
                                              <option value="0">0%</option>
                                              <option value="0.5">0.5%</option>
                                              <option value="1">1%</option>
                                              <option value="1.5">1.5%</option>
                                              <option value="2">2%</option>
                                              <option value="2.5">2.5%</option>
                                              <option value="3">3%</option>
                                              <option value="3.5">3.5%</option>
                                              <option value="4">4%</option>
                                              <option value="4.5">4.5%</option>
                                              <option value="5">5%</option>
                                              <option value="6">6%</option>
                                              <option value="7">7%</option>
                                              <option value="8">8%</option>
                                              <option value="9">9%</option>
                                              <option value="10">10%</option>
                                              <option value="100">100%</option>
                                            </optgroup>
                                          </select>
                                        </div>
                                      </div>
                                      <div className="col-6">
                                        Stop Loss
                                        <div className="priceWithProfit bg-light">
                                          <label htmlFor="addMoney"> $ </label>
                                          <input
                                            type="number"
                                            id="addMoney"
                                            name="stop_loss"
                                            className="apperance-none px-2"
                                            value={formData?.stop_loss || ""}
                                            onChange={handleNumericInput}
                                          />
                                          <select
                                            name="stop_loss_percentage"
                                            onChange={handleNumericInput}
                                            value={
                                              formData?.stop_loss_percentage ||
                                              0
                                            }
                                          >
                                            <optgroup>
                                              <option value="0">0%</option>
                                              <option value="0.5">0.5%</option>
                                              <option value="1">1%</option>
                                              <option value="1.5">1.5%</option>
                                              <option value="2">2%</option>
                                              <option value="2.5">2.5%</option>
                                              <option value="3">3%</option>
                                              <option value="3.5">3.5%</option>
                                              <option value="4">4%</option>
                                              <option value="4.5">4.5%</option>
                                              <option value="5">5%</option>
                                              <option value="6">6%</option>
                                              <option value="7">7%</option>
                                              <option value="8">8%</option>
                                              <option value="9">9%</option>
                                              <option value="10">10%</option>
                                              {/* <option value="100">100%</option> */}
                                            </optgroup>
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                    <Card className="cardDesign bg-light my-2 mb-md-0 py-2 px-3 ">
                                      <CardContent className="cardContent">
                                        <div className="cardHeader mb-0">
                                          <h6 className="fs-7 fw-500 semiGray">
                                            Add to Position
                                          </h6>
                                        </div>
                                        <div className="card-body p-0">
                                          <div className="positionList">
                                            <ul className="list-unstyled">
                                              <li
                                                className={`${formData?.stockPosition == 5
                                                  ? "recomended"
                                                  : ""
                                                  }`}
                                              >
                                                <Button
                                                  onClick={() =>
                                                    handleStockPosition(5)
                                                  }
                                                >
                                                  5%
                                                </Button>
                                              </li>
                                              <li
                                                className={`${formData?.stockPosition == 10
                                                  ? "recomended"
                                                  : ""
                                                  }`}
                                              >
                                                <Button
                                                  onClick={() =>
                                                    handleStockPosition(10)
                                                  }
                                                >
                                                  10%
                                                </Button>
                                              </li>
                                              <li
                                                className={`${formData?.stockPosition == 15
                                                  ? "recomended"
                                                  : ""
                                                  }`}
                                              >
                                                <Button
                                                  onClick={() =>
                                                    handleStockPosition(15)
                                                  }
                                                >
                                                  15%
                                                </Button>
                                              </li>
                                              <li>
                                                <input
                                                  type="text"
                                                  name="stockPositionVal"
                                                  className="form-control borderd-purple shadow-sm apperance-none"
                                                  value={
                                                    formData?.stockPositionVal ||
                                                    ""
                                                  }
                                                  onChange={(e) => handleStockPosition(e.target.value, "input")}
                                                />
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                        {/* <div className="card-footer bg-transparent border-0 px-0 pb-0 mt-5">
                                  <div className="totalPosition">
                                    <ul className="list-unstyled mb-0">
                                      <li>$ 298,739</li>
                                      <li>28%</li>
                                    </ul>
                                  </div>
                                </div> */}
                                      </CardContent>
                                    </Card>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          {/* <div className="col-md-6 col-12">
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
                                          <select name="profit_order_percentage" onChange={handleNumericInput} value={formData?.profit_order_percentage || 0}>
                                            <optgroup>
                                              <option value="0">0%</option>
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
                                          <select name="stop_loss_percentage" onChange={handleNumericInput} value={formData?.stop_loss_percentage || 0}>
                                            <optgroup>
                                              <option value="0">0%</option>
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
                          </div> */}
                          <div className="col-md-6 col-12"></div>
                          <div className="col-md-6 col-12"></div>
                          <div className="col-12 ">
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
                      {/* <Grid item xs={"auto"}>
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
                      </Grid> */}
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
                            Sym
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            Stock/Option
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            Shares
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            Todays UR Net Gn/Ls
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            Total UR Gan/Ls
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            Avg Enter Price
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            Last Trade Price
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            Market Value
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            System Exit Yes/No
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            Type of System Exit
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            Close Position
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      {existingOrder ? (
                        <TableBody>
                          {existingOrder.map((row, ind) => (
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
                                {row.contractDesc}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                Stock
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row.position}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row.realizedPnl?.toFixed(2)}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row.unrealizedPnl?.toFixed(2)}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row?.avgPrice?.toFixed(2)}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row?.avgCost?.toFixed(2)}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row?.mktValue?.toFixed(2)}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {/* {row?.avgPrice?.toFixed(2)} */}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {/* {row?.unrealizedPnl?.toFixed(2)} */}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                <Button>Close</Button>
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
              <div className="col-12 mb-1">
                <Card className="cardDesign">
                  <Box className="tableHeader">
                    <Grid container spacing={1} p={"0 !important"}>
                      <Grid item xs={"auto"} sx={{ flexGrow: " 1 !important" }}>
                        <Typography variant="h6" className="tableHeading">
                          Open Order
                        </Typography>
                      </Grid>
                      {/* <Grid item xs={"auto"}>
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
                      </Grid> */}
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
                            Order Entry Time
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            # of Shares/Contracts
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            # Remaining
                          </TableCell>
                          <TableCell
                            align="left"
                            className="table_head tableRow1"
                          >
                            Order Price
                          </TableCell>
                          <TableCell
                            align="right"
                            className="table_head tableRow1"
                          >
                            Delete or Modify
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
                                {row?.ticker}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row?.side}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {moment(row?.lastExecutionTime_r).format(
                                  "DD-MM-YYYY hh:mm A"
                                )}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row?.totalSize}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row?.remainingQuantity}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row?.price || row?.avgPrice}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                <Button>Delete</Button>
                                <Button>Modify</Button>
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
            <div className="row">
              <div className="col-md-6 col-12 mb-3">
                <Card
                  className="cardDesign"
                  sx={{ padding: "15px !important" }}
                >
                  <CardContent className="cardContent">
                    <h6 className="fs-6 mb-3">Screen Triggered - Long</h6>
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
              <div className="col-md-6 col-12 mb-3">
                <Card
                  className="cardDesign"
                  sx={{ padding: "15px !important" }}
                >
                  <CardContent className="cardContent">
                    <h6 className="fs-6 mb-3">Screen Triggered - Short Sell</h6>
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
            </div>
          </div>
        </div>
      </div>
      {/* <DialogTransition
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
      /> */}

      {open1 ? <Modal
        open={open1}
        setOpen={setOpen1}
        placeOrderBtt={placeOrderBtt}
        apiCall={placeOrderFun}
        Heading="Confirm Order "
        data={{
          stockSymbol: contractInfo?.symbol,
          stockName: contractInfo?.company_name,
          shares: formData.shares,
          midPrice: +formData?.limitPrice || snapshot?.mid || 0,
          existingValue: formData.existingValue,
          shareType: formData?.shareType || ""
        }}
      /> : <></>}
    </Fragment>
  );
}
