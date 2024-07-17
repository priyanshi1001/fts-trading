import { Route, Redirect } from "react-router-dom";
import React, { Suspense, lazy, Fragment } from "react";
import Loader from "react-loaders";
// import PrivateRoute from "./privateRoute";
import { ToastContainer } from "react-toastify";
import { Help } from "@mui/icons-material";

const login = lazy(() => import("../../DemoPages/UserPages/Login"))
const Forget = lazy(() => import("../../DemoPages/UserPages/ForgotPassword"))
const Register = lazy(() => import("../../DemoPages/UserPages/Register"))
const ResetPassword = lazy(() => import("../../DemoPages/UserPages/ResetPassword"))
const Accounts = lazy(() => import("../../Administrator/Accounts/Accounts"));

const Stocks_Details = lazy(() => import("../../Administrator/StockDetails/Stocks"));
const RealTimeStock = lazy(() => import("../../Administrator/StockDetails/Stocks/realTimeStock"));
const HistoricalPrice = lazy(() => import("../../Administrator/StockDetails/Stocks/historicalPrice"));
const OrderHistory = lazy(()=> import("../../Administrator/OrderHistory/index"));
const Screens = lazy(() => import("../../Administrator/PreBuildScreens/Screens"));
const Report = lazy(() => import("../../Administrator/Report/Reports"));
const WatchList = lazy(() => import("../../Administrator/WatchList/WatchLists"));
const OtherFunctions = lazy(() => import("../../Administrator/OtherFunction/Function"));
const Dashboard = lazy(() => import("../../Administrator/Dashboard/Dashboard"));

const Dashboard_details = lazy(() =>
  import("../../Administrator/Dashboard/DashBoard_details")
);

const Logout = lazy(() => import("../../Administrator/LogOut"))


const AppMain = () => {
  function isAuth() {
    if (localStorage.getItem("accessToken") && localStorage.getItem("accessToken") !== "") {
      return true;
    }
    else return true;
  }
  return (

    <Fragment>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
            </div>
          </div>
        }
      >
        <Route path="/resetPassword" component={ResetPassword} />
      </Suspense>

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
            </div>
          </div>
        }
      >
        <Route path="/register" component={Register} />
      </Suspense>

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
            </div>
          </div>
        }
      >
        <Route path="/forget" component={Forget} />
      </Suspense>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
            </div>
          </div>
        }
      >
        <Route path="/login" component={isAuth() ? login : login} />
      </Suspense>



      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all Stocks
                {/* <small>Because this is a demonstration we load at once all the Elements examples. This wouldn't happen in a real live app!</small> */}
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/logout" component={isAuth() ? Logout : login} />
      </Suspense>


      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all Dashboard
                {/* <small>Because this is a demonstration we load at once all the Elements examples. This wouldn't happen in a real live app!</small> */}
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/Dashboard" component={isAuth() ? Dashboard : login} />
      </Suspense>



      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all Dashboard
                {/* <small>Because this is a demonstration we load at once all the Elements examples. This wouldn't happen in a real live app!</small> */}
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/Dashboard_details" component={isAuth() ? Dashboard_details : login} />
      </Suspense>

      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all Stocks
                {/* <small>Because this is a demonstration we load at once all the Elements examples. This wouldn't happen in a real live app!</small> */}
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/OtherFunctions" component={isAuth() ? OtherFunctions : login} />
      </Suspense>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all Stocks
                {/* <small>Because this is a demonstration we load at once all the Elements examples. This wouldn't happen in a real live app!</small> */}
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/WatchList" component={isAuth() ? WatchList : login} />
      </Suspense>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all Stocks
                {/* <small>Because this is a demonstration we load at once all the Elements examples. This wouldn't happen in a real live app!</small> */}
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/Report" component={isAuth() ? Report : login} />
      </Suspense>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all Stocks
                {/* <small>Because this is a demonstration we load at once all the Elements examples. This wouldn't happen in a real live app!</small> */}
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/Screens" component={isAuth() ? Screens : login} />
      </Suspense>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all Stocks
                {/* <small>Because this is a demonstration we load at once all the Elements examples. This wouldn't happen in a real live app!</small> */}
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/Stocks_Details" component={isAuth() ? Stocks_Details : login} />
      </Suspense>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all orders
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/Order_History" component={isAuth() ? OrderHistory : login} />
      </Suspense>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all real time stock
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/Get_real_time_stock/:conid" component={isAuth() ? RealTimeStock : login} />
      </Suspense>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all historical price
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/Get_historical_price/:conid" component={isAuth() ? HistoricalPrice : login} />
      </Suspense>
      <Suspense
        fallback={
          <div className="loader-container">
            <div className="loader-container-inner">
              <div className="text-center">
                <Loader type="line-scale" />
              </div>
              <h6 className="mt-3">
                Please wait while we load all Stocks
                {/* <small>Because this is a demonstration we load at once all the Elements examples. This wouldn't happen in a real live app!</small> */}
              </h6>
            </div>
          </div>
        }
      >
        <Route path="/Accounts" component={isAuth() ? Accounts : login} />
      </Suspense>


      <Route exact path="/" render={() => <Redirect to="/login" />} />
      <ToastContainer />
    </Fragment>
  );
};

export default AppMain;
