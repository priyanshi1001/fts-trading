import React, { Fragment, useEffect, useState, useRef } from "react";
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
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
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
  fetchPortfolioPositionApi,
  cancelOrderApi,
  modifyOrderApi,
  fetchIBStockList
} from "../../../api/ApiCall";
import StockListStaticPayload from "../../../api/StockListStaticPayload";
import { socket } from "../../../api/socket";
socket.connect();

export default function ContentManagement() {
  const history = useHistory();
  const modifyOrderRef = useRef(null);
  const [open1, setOpen1] = useState(false);
  const [cnlOdShow, setCnlOdShow] = useState(-1);
  const [modifyOdShow, setModifyOdShow] = useState(-1);
  const [modifyOrderData, setModifyOrderData] = useState(null);
  const [accountDetail, setAccountDetail] = useState(null);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [contractInfo, setContractInfo] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [pnlInfo, setPnlInfo] = useState(null);
  const [placeOrderBtt, setPlaceOrderBtt] = useState(true);
  const [formData, setFormData] = useState({
    stockPosition: 10,
    tif: "DAY",
    shareType: "BUY"
  });
  const [openOrderList, setOpenOrderList] = useState([]);
  const [existingOrder, setExistingOrder] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [stockList, setStockList] = useState([]);
  const [stockPage, setStockPage] = useState(1);
  const [stockSize, setStockSize] = useState(100);
  const [stockPayload, setStockPayload] = useState(StockListStaticPayload);
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

    fetchIBPnlApi().then((response) => {
      setPnlInfo(response || null);
    }).catch((err) => {
      console.log("Pnl Info Error:", err);
    });

  }, []);

  useEffect(() => {
    if (!selectedStock?.type)
      updateStockDetails();

    const conid = searchParams.conid || "";

    fetchIBContractInfo(conid)
      .then((response) => {
        setContractInfo(response || null);
      })
      .catch((err) => {
        console.log("Fetch Contract Info:", err);
      });

    socket.on("connect", () => {
      console.log("Dashboard Node socket connect successfully.");
    })
    socket.on("disconnect", () => {
      console.log("Dashboard Node socket disconnected.");
    });

    socket.on("ib_message", (resData) => {
      let socketResponse = JSON.parse(resData);
      if (socketResponse.topic == `smd+${conid}`) {
        let bid = +socketResponse?.["84"] || 0;
        let ask = +socketResponse?.["86"] || 0;
        let lastPrice = +socketResponse?.["31"] || 0;
        let tempObj = {};
        if (bid) {
          tempObj["bid"] = bid;
        }
        if (ask) {
          tempObj["ask"] = ask;
        }
        if (lastPrice) {
          tempObj["lastPrice"] = lastPrice;
        }
        if (tempObj.bid && tempObj.ask) {
          let mid = (bid + ask) / 2;
          mid = +mid.toFixed(2) || 0;
          tempObj["mid"] = mid;
        } else if (tempObj.bid || tempObj.ask) {
          tempObj["mid"] = tempObj.bid || tempObj.ask;
        }

        // if (bid && mid && ask) {
        //   setSnapshot({
        //     bid: bid,
        //     mid: mid,
        //     ask: ask,
        //     lastPrice: lastPrice,
        //   });
        // }
        setSnapshot((prev) => ({ ...prev, ...tempObj }));
      }

      console.log("Dashboard ib_message:", socketResponse);
    });
    const obj = {
      "31": "Last Price",
      "84": "Bid price",
      "86": "Ask price"
    }
    const fields = ["31", "84", "86"];
    if (conid) {
      socket.emit("req_data", `smd+${conid}+${JSON.stringify({ fields: fields })}`);
    }
  }, [selectedStock]);

  function updateStockDetails() {
    fetchIBAccountDetailFun().then((response) => {
      fetchIBSnapshotFun(response);
    }).catch((err) => {
      console.log("Account Details Not Fetch.")
    });
  }

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
        if (+formData?.stockPosition && accountBal && bid) {
          existingValue = (+formData.stockPosition * accountBal) / 100;
          existingValue = +existingValue.toFixed(2);
          shares = existingValue / bid;
          shares = +shares.toFixed(2);
          liveAccPercentage = +formData.stockPosition;
        }

        setFormData({
          ...formData,
          shares: Math.round(shares),
          existingValue,
          liveAccPercentage,
          orderType: "LMT",
          limitPrice: bid
        });
      })
      .catch((err) => {
        console.log("IB Snapshot Error", err);
        toast.error("Current prices not fetch. please try after some time.");
      });
  }

  function handleModifyOrder(data) {
    let { ticker, conid } = data;

    if (!conid) {
      toast.error("Shares details not fetch. please try again.");
      console.log("Contract id missing.")
      return 0;
    }

    history.push(`/Dashboard?conid=${conid}&symbol=${ticker}`);
    setSelectedStock({ conid, symbol: ticker, type: "modify_order" });

    modifyIBOrderSnapshotFun(data);
    setModifyOrderData(data);

    modifyOrderRef.current.scrollIntoView({
      behavior: "smooth"
    });

  }

  function modifyIBOrderSnapshotFun(data) {
    let { conid, side, totalSize, remainingQuantity } = data;
    fetchIBSnapshotApi(conid, "31,84,86")
      .then((response) => {
        if (!(+response?.[0]?.[84]) || !(+response?.[0]?.[86])) {
          modifyIBOrderSnapshotFun(data);
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

        // let accountBal = portfolioSummary?.["availablefunds-s"]?.amount || 0;
        let shares = Math.round(totalSize || remainingQuantity);
        let existingValue = shares * bid;
        existingValue = +existingValue.toFixed(2);
        let liveAccPercentage = 0;
        // if (+formData?.stockPosition && accountBal && bid) {
        //   existingValue = (+formData.stockPosition * accountBal) / 100;
        //   existingValue = +existingValue.toFixed(2);
        //   shares = existingValue / bid;
        //   shares = +shares.toFixed(2);
        //   liveAccPercentage = +formData.stockPosition;
        // }

        setFormData({
          ...formData,
          tif: "DAY",
          shareType: side,
          orderType: "LMT",
          shares: shares,
          limitPrice: bid,
          stockPosition: 0,
          existingValue,
          liveAccPercentage,
          submitType: "modify_order"
        });
      })
      .catch((err) => {
        console.log("IB Snapshot Error", err);
        toast.error("Current prices not fetch. please try after some time.");
      });
  }

  function handleCloseOrder(data) {
    let { contractDesc, conid } = data;

    if (!conid) {
      toast.error("Shares details not fetch. please try again.");
      console.log("Contract id missing.")
      return 0;
    }

    history.push(`/Dashboard?conid=${conid}&symbol=${contractDesc}`);
    setSelectedStock({ conid, symbol: contractDesc, type: "close_order" });

    closeIBOrderSnapshotFun(data);

    modifyOrderRef.current.scrollIntoView({
      behavior: "smooth"
    });

  }

  function closeIBOrderSnapshotFun(data) {
    let { conid, position } = data;
    fetchIBSnapshotApi(conid, "31,84,86")
      .then((response) => {
        if (!(+response?.[0]?.[84]) || !(+response?.[0]?.[86])) {
          closeIBOrderSnapshotFun(data);
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

        // let accountBal = portfolioSummary?.["availablefunds-s"]?.amount || 0;
        let shares = Math.round(position);
        let existingValue = shares * bid;
        existingValue = +existingValue.toFixed(2);
        let liveAccPercentage = 0;
        // if (+formData?.stockPosition && accountBal && bid) {
        //   existingValue = (+formData.stockPosition * accountBal) / 100;
        //   existingValue = +existingValue.toFixed(2);
        //   shares = existingValue / bid;
        //   shares = +shares.toFixed(2);
        //   liveAccPercentage = +formData.stockPosition;
        // }

        setFormData({
          ...formData,
          tif: "DAY",
          shareType: "BUY",
          orderType: "LMT",
          shares: shares,
          limitPrice: bid,
          stockPosition: 0,
          existingValue,
          liveAccPercentage,
          submitType: ""
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
    // let filtersVal = `?Filters=inactive,pending_submit,pre_submitted,filled,submitted,pending_cancel,cancelled,warn_state,sort_by_time`;
    let filtersVal = `?Filters=inactive,pending_submit,pre_submitted,submitted,pending_cancel,warn_state,sort_by_time&force=true`;
    fetchIBOpenOders(filtersVal)
      .then((response) => {
        if (!response?.snapshot) {
          fetchIBOpenOdersFun();
        } else {
          setOpenOrderList(response?.orders || []);
        }
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
        let midPrice = +value || +snapshot.bid || 0;
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
        let midPrice = +formData?.limitPrice || +snapshot.bid || 0;
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
    let midPrice = +snapshot.bid || 0;
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
        limitPrice: snapshot.bid,
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
      let midPrice = +formData?.limitPrice || +snapshot.bid || 0;
      let shares = 0;
      let existingValue = 0;
      let liveAccPercentage = 0;
      if (+value && accountBal && midPrice) {
        existingValue = (+value * accountBal) / 100;
        existingValue = +existingValue.toFixed(2);
        shares = existingValue / midPrice;
        shares = +shares.toFixed(2);
        shares = Math.round(shares);
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

  function handleSubmitButton() {
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
    }
    // else if (
    //   formData?.orderType == "LMT" &&
    //   formData.limitPrice &&
    //   (+formData.limitPrice < snapshot.bid ||
    //     +formData.limitPrice > snapshot.ask)
    // ) {
    //   toast.error(
    //     "Limit price should be greater than bid price and less than ask price.",
    //     {
    //       toastId: "form-error",
    //     }
    //   );
    //   checkValidation = false;
    // }

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

    if (formData?.submitType == "modify_order") {
      modifyOrderFun();
      return 0;
    }

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
          price: +formData?.limitPrice || snapshot.bid || 0,
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
      price: +formData?.limitPrice || snapshot.bid || 0,
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

        if (response?.error) {
          toast.error(response.error);
          setPlaceOrderBtt(true);
          return 0;
        }

        if (orderId) {
          orderConfirmationFun(orderId, {
            confirmed: true
          }, orderStoreObj);
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

  function orderConfirmationFun(orderId, payload, orderStoreObj) {
    orderConfirmApi(orderId, payload).then((response) => {
      if (response?.error) {
        toast.error(response.error);
      } else {
        let result = response?.[0] || {};
        let tempOrderId = result?.id || "";
        let order_id = result?.order_id || "";
        let order_status = result?.order_status || "";
        if (order_id && order_status) {
          let tempOrderStoreObj = { ...orderStoreObj, ...result };
          orderSuccessPlaceMsg(tempOrderStoreObj);
          setPlaceOrderBtt(true);
        }
        else if (tempOrderId) {
          orderConfirmationFun(tempOrderId, payload, orderStoreObj);
        }
        else {
          toast.error("Something went wrong. please try again");
          setPlaceOrderBtt(true);
        }
      }
    }).catch((err) => {
      console.log("Order Confirmation Error:", err.message);
      toast.error("Something went wrong. please try again.");
      setPlaceOrderBtt(true);
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

  function cancelOrderFun(odData) {
    let accId = accountDetail?.selectedAccount || "";
    if (accId) {
      cancelOrderApi(accId, odData?.orderId).then((response) => {
        if (response?.error) {
          toast.error(response.error);
        } else {
          toast.success("order cancelled successfully.");
          setCnlOdShow(-1);

          fetchPortfolioSummaryFun(accId);
          fetchPortfolioPositionFun(accId);
          fetchIBOpenOdersFun();
        }
      }).catch((err) => {
        console.log("Cancel Order Api Error:", err);
        toast.error(err?.response?.data?.error || "Someting went worng. please try again.");
        setCnlOdShow(-1);
      })
    } else {
      toast.error("Interactive broker account detail not found. please login interactive broker acoount first", { toastId: "form-error" });
    }
  }

  function modifyOrderFun() {
    if (!modifyOrderData?.orderId) {
      toast.error("Please select modify order first.");
      setPlaceOrderBtt(true);
      setOpen1(false);
      return 0
    }
    let accId = accountDetail?.selectedAccount || "";
    if (accId) {
      let modifyPayload = {
        acctId: accId,
        conid: contractInfo?.con_id,
        orderType: formData.orderType,
        outsideRTH: true,
        price: +formData?.limitPrice || snapshot.bid || 0,
        side: formData.shareType,
        ticker: contractInfo.symbol,
        tif: formData.tif,
        quantity: +formData.shares || 1,
        // auxPrice: 0,
        // listingExchange: "string", // optional
        // deactivated: true
      }

      fetchIBAccountDetailFun().then((resp) => {
        modifyOrderApi(accId, modifyOrderData?.orderId, modifyPayload).then((response) => {
          setPlaceOrderBtt(true);
          if (response?.error) {
            toast.error(response.error);
          } else {
            toast.success("order modify successfully.");

            fetchPortfolioSummaryFun(accId);
            fetchPortfolioPositionFun(accId);
            fetchIBOpenOdersFun();
            setOpen1(false);
          }
        }).catch((err) => {
          console.log("Modify Order Api Error:", err);
          toast.error(err?.message || "Someting went worng. please try again.");
          setOpen1(false);
          setPlaceOrderBtt(true);
        });
      }).catch((err) => {
        console.log("Modify Order Account Details Error:", err.message);
        toast.error(err?.message || "Someting went worng. please try again.");
        setOpen1(false);
        setPlaceOrderBtt(true);
      });
    } else {
      toast.error("Interactive broker account detail not found. please login interactive broker acoount first", { toastId: "form-error" });
      setOpen1(false);
      setPlaceOrderBtt(true);
    }
  }

  function handleSearchInput(e) {
    let value = e.target.value;
    setSearchInput(value);

    if (!value) {
      setStockList([]);
      return 0;
    }

    if (stockSize > 0) stockPayload["pageSize"] = stockSize;
    if (stockPage > 0) stockPayload["pageNumber"] = stockPage;
    let tempSearch = "";
    if (value) tempSearch = value.toUpperCase().trim();
    stockPayload["productSymbol"] = (tempSearch);

    setStockPayload({ ...stockPayload });

    fetchIBStockList(stockPayload).then((response) => {
      setStockList(response?.products || []);
    }).catch((err) => {
      console.log("Stock List Search Error:", err.message);
      toast.error("Stock list not fetch. please try again.", {
        toastId: "stock-list-search-error"
      });
    })
  }

  function handleStockListCLick(stockData) {
    let { symbol, conid } = stockData;
    history.push(`/Dashboard?conid=${conid}&symbol=${symbol}`);
    setSearchInput(symbol);
    setSelectedStock({ conid, symbol });
    setFormData((prev)=>({...prev, submitType: ""}));
    setStockList([]);
  }

  function percentageVal(percentage, type) {
    let midPrice = +formData?.limitPrice || +snapshot.bid || 0;
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
      <div className="app-main" ref={modifyOrderRef}>
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
                        <span className="digit text-success">{pnlInfo?.["upnl"]?.[`${accountDetail?.selectedAccount}.Core`]?.["dpl"]?.toFixed(2) || 0}</span>
                      </li>
                      <li>
                        Unrealized PnL
                        <span className="digit text-success">{pnlInfo?.["upnl"]?.[`${accountDetail?.selectedAccount}.Core`]?.["upl"]?.toFixed(2) || 0}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <div className="col-lg-9 col-md-12 col-12 pt-2">
                <Card className="cardDesign" sx={{ paddingBlockStart: "40px" }}>
                  <CardContent className="cardContent">
                    <div className="row">
                      <div className="dropdown">
                        <div className="col-auto dropdown-content" id="myDropdown">
                          <input type="text" placeholder="Search Stocks..." id="searchInput" value={searchInput} onChange={handleSearchInput} />

                        </div>
                        <div className="position-absolute top-100 start-0 p-2 rounded-2 z-index-2" style={{
                          background: "#f6f6f6", marginInlineStart: "20px", zIndex: "2",
                          boxShadow: "0 0 10px #0404047", width: "180px"
                        }}>
                          {searchInput && stockList.map((dt, ind) => {
                            return (
                              <div key={ind}>
                                <a style={{
                                  marginBlockEnd: "3px",
                                  color: "rgb(51, 51, 51)",
                                  background: "rgb(229 229 229)",
                                  padding: "3px 10px",
                                  width: "100%",
                                  display: "block",
                                  lineHeight: "1.5",
                                }} href="javascript:void(0)" onClick={() => handleStockListCLick(dt)}>{dt?.symbol}</a>
                              </div>
                            )
                          })}
                        </div>
                      </div>

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
                                        {/*<div class="form-check p-0 d-flex align-items-center justify-content-between">
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
                                        </div>*/}
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
                            Stock / Option
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
                                <Button onClick={() => handleCloseOrder(row)}>Close</Button>
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
                            align="left"
                            className="table_head tableRow1"
                          >
                            Order Status
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
                              {cnlOdShow > -1 ? <CancelOrder data={row} index={ind} cnlOdShow={cnlOdShow} setCnlOdShow={setCnlOdShow} cancelOrderFun={cancelOrderFun} /> : <></>}
                              {/* {modifyOdShow > -1 ? <ModifyOrder data={row} index={ind} modifyOdShow={modifyOdShow} setModifyOdShow={setModifyOdShow} modifyOrderFun={modifyOrderFun} /> : <></>} */}
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
                                {row?.filledQuantity || row?.totalSize}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row?.remainingQuantity}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row?.price || row?.avgPrice}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                {row?.order_ccp_status}
                              </TableCell>
                              <TableCell className="table_content tableRow1">
                                <Button onClick={() => setCnlOdShow(ind)}><DeleteOutlinedIcon /></Button>
                                {/* <Button onClick={() => setModifyOdShow(ind)}><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="28px" viewBox="0 0 20 20" width="28px" fill="#1976d2"><rect fill="none" height="20" width="20" /><path d="M3,5h9v1.5H3V5z M3,11.25h6v1.5H3V11.25z M3,8.12h9v1.5H3V8.12z M16.78,11.99l0.65-0.65c0.29-0.29,0.29-0.77,0-1.06 l-0.71-0.71c-0.29-0.29-0.77-0.29-1.06,0l-0.65,0.65L16.78,11.99z M16.19,12.58L11.77,17H10v-1.77l4.42-4.42L16.19,12.58z" /></svg></Button> */}
                                <Button onClick={() => handleModifyOrder(row)}><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 20 20" height="28px" viewBox="0 0 20 20" width="28px" fill="#1976d2"><rect fill="none" height="20" width="20" /><path d="M3,5h9v1.5H3V5z M3,11.25h6v1.5H3V11.25z M3,8.12h9v1.5H3V8.12z M16.78,11.99l0.65-0.65c0.29-0.29,0.29-0.77,0-1.06 l-0.71-0.71c-0.29-0.29-0.77-0.29-1.06,0l-0.65,0.65L16.78,11.99z M16.19,12.58L11.77,17H10v-1.77l4.42-4.42L16.19,12.58z" /></svg></Button>
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
          midPrice: +formData?.limitPrice || snapshot?.bid || 0,
          existingValue: formData.existingValue,
          shareType: formData?.shareType || ""
        }}
      /> : <></>}
    </Fragment>
  );
}


function CancelOrder(props) {
  const {
    data,
    index,
    cnlOdShow,
    setCnlOdShow,
    cancelOrderFun
  } = props;

  const handleClose = () => {
    setCnlOdShow(-1);
  };

  const handleSubmit = () => {
    cancelOrderFun(data);
  };

  return (
    <Fragment>
      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={index == cnlOdShow}
        keepMounted
        // onClose={handleClose}
        // TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="modal-header py-4 px-3 text-center">
          Cancel Order
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h6"
            component="h6"
            className="text-center text-gray fs-6 mb-3"
          >
            Are You sure You want to cancel order of {data?.ticker}
          </Typography>
        </DialogContent>
        <DialogActions className="dialog-actions-dense justify-content-center my-4">
          <Box className="d-flex align-item-center justify-content-center gap-3 btn-box ">
            <button
              className="btn btn-lg w-auto btn-outline-purple"
              onClick={handleClose}
            >
              No
            </button>
            <button
              className="btn btn-lg w-auto btn-purple"
              onClick={handleSubmit}
            >
              Yes
            </button>
          </Box>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};


function ModifyOrder(props) {
  const {
    data,
    index,
    modifyOdShow,
    setModifyOdShow,
    modifyOrderFun
  } = props;
  const [formData, setFormData] = useState({});

  const handleClose = () => {
    setModifyOdShow(-1);
  };

  const handleSubmit = () => {
    if (!formData?.tif) {
      toast.error("Please select tif", {
        toastId: "modify-order-form-error"
      });
      return 0;
    }
    if (!formData?.orderType) {
      toast.error("Please select order type", {
        toastId: "modify-order-form-error"
      });
      return 0;
    }
    modifyOrderFun(data, formData);
  };

  return (
    <Fragment>
      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={index == modifyOdShow}
        keepMounted
        // onClose={handleClose}
        // TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="modal-header py-4 px-3 text-center">
          Modify Order
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h6"
            component="h6"
            className="text-center text-gray fs-6 mb-3"
          >
            Are You sure You want to modify order of {data?.ticker}
          </Typography>
          <div className="text-center text-gray fs-6 mb-3">
            <label>TIF</label>
            <select name="tif" value={formData?.tif} onChange={(e) => setFormData((prev) => ({ ...prev, tif: e.target.value }))}>
              <option value="">Select</option>
              <option value="DAY">DAY</option>
              <option value="GTC">GTC</option>
              <option value="OPG">OPG</option>
              <option value="IOC">IOC</option>
            </select>

            <label>Order Type</label>
            <select name="orderType" value={formData?.orderType} onChange={(e) => setFormData((prev) => ({ ...prev, orderType: e.target.value }))}>
              <option value="">Select</option>
              <option value="LMT">LMT</option>
              <option value="MKT">MKT</option>
              <option value="STP">STP</option>
              <option value="STOP_LIMIT">STOP LIMIT</option>
              <option value="MIDPRICE">MIDPRICE</option>
              <option value="TRAIL">TRAIL</option>
              <option value="TRAILLMT">TRAILLMT</option>
            </select>
          </div>
        </DialogContent>
        <DialogActions className="dialog-actions-dense justify-content-center my-4">
          <Box className="d-flex align-item-center justify-content-center gap-3 btn-box ">
            <button
              className="btn btn-lg w-auto btn-outline-purple"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-lg w-auto btn-purple"
              onClick={handleSubmit}
            >
              Modify
            </button>
          </Box>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
