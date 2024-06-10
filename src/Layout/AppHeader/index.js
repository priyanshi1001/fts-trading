import React, { Fragment } from "react";
import cx from "classnames";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import HeaderLogo from "../AppLogo";
import UserBox from "./Components/UserBox";
import userImg from "../../assets/utils/images/avatars/2.jpg";

class Header extends React.Component {
  getPageName = () => {
    const { location } = this.props;
    if (!location || !location.pathname) return "";
    const path = location.pathname.split("/")[1]; // get the first part of the path after '/'
    if (path === "Stocks_Details") {
      return "Stock Details";
    }
    else if (path === "Screens") {
     return "Pre Build Screens";
    }
    else if (path === "WatchList"){
      return "Watch List";
  }
  else if (path === "OtherFunctions"){
    return "Other Functions";
}
    return path.charAt(0).toUpperCase() + path.slice(1); // capitalize the first letter
  };
  render() {
    let { headerBackgroundColor, enableMobileMenuSmall, enableHeaderShadow } = this.props;

    return (
      <Fragment>
        <TransitionGroup>
          <CSSTransition
            style={{ justifyContent: "space-between" }}
            component="div"
            className={cx("app-header", headerBackgroundColor, {
              "header-shadow": enableHeaderShadow,
            })}
            appear={true}
            timeout={1500}
            enter={false}
            exit={false}
          >
            <div
              className={cx("app-header__content", {
                "header-mobile-open": enableMobileMenuSmall,
              })}
            >
              <div className="leftLogoHeader">
                <HeaderLogo />
              </div>
              <div className="rightHeader flex-grow-1">
                <div className="headerTop">
                  <div className="d-flex align-items-center justify-content-between gap-3">
                    <div className="app-header-left">
                      <Typography variant="h5" className="pageName">
                        {this.getPageName()}
                      </Typography>
                    </div>
                    <div className="app-header-right">
                      <div className="notificationIcon">
                        <svg
                          width="16"
                          height="18"
                          viewBox="0 0 16 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.4746 8.7044C13.8658 7.99354 13.5892 7.3775 13.5892 6.33092V5.97507C13.5892 4.61124 13.2753 3.73251 12.5929 2.85379C11.541 1.48912 9.77031 0.666626 8.03685 0.666626H7.96313C6.26612 0.666626 4.55088 1.45135 3.48082 2.76063C2.7611 3.65698 2.41076 4.57347 2.41076 5.97507V6.33092C2.41076 7.3775 2.15236 7.99354 1.5254 8.7044C1.06408 9.22812 0.916656 9.90122 0.916656 10.6297C0.916656 11.359 1.15601 12.0498 1.63638 12.6113C2.26334 13.2844 3.1487 13.7141 4.05312 13.7888C5.36253 13.9382 6.67194 13.9944 8.0004 13.9944C9.32804 13.9944 10.6375 13.9004 11.9477 13.7888C12.8513 13.7141 13.7366 13.2844 14.3636 12.6113C14.8431 12.0498 15.0833 11.359 15.0833 10.6297C15.0833 9.90122 14.9359 9.22812 14.4746 8.7044Z"
                            fill="#5570F1"
                          />
                          <path
                            opacity="0.4"
                            d="M9.6739 15.0236C9.25731 14.9347 6.71882 14.9347 6.30223 15.0236C5.9461 15.1059 5.56097 15.2972 5.56097 15.7169C5.58168 16.1172 5.81607 16.4706 6.14073 16.6946L6.1399 16.6955C6.5598 17.0228 7.05259 17.2309 7.56857 17.3056C7.84354 17.3434 8.12348 17.3417 8.40839 17.3056C8.92354 17.2309 9.41633 17.0228 9.83623 16.6955L9.83541 16.6946C10.1601 16.4706 10.3945 16.1172 10.4152 15.7169C10.4152 15.2972 10.03 15.1059 9.6739 15.0236Z"
                            fill="#5570F1"
                          />
                        </svg>
                      </div>
                      <div className="userIcon">
                        <img src={userImg} alt="" />
                      </div>
                      <UserBox />
                    </div>
                  </div>
                </div>
                <div className="headerBottom">
                  <Breadcrumbs aria-label="breadcrumb">
                    <Link className="p-0 fs-7" to="/Dashboard">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.09584 12.8548V10.8102C5.09583 10.2921 5.51713 9.87118 6.03898 9.86792H7.95509C8.47927 9.86792 8.9042 10.2898 8.9042 10.8102V12.8489C8.90419 13.2982 9.26937 13.6634 9.72198 13.6667H11.0292C11.6398 13.6683 12.2259 13.4286 12.6581 13.0005C13.0904 12.5725 13.3334 11.9912 13.3334 11.3851V5.57727C13.3333 5.08763 13.1147 4.62318 12.7364 4.30904L8.29534 0.782886C7.51903 0.166122 6.41027 0.186046 5.65695 0.830297L1.31136 4.30904C0.915181 4.61392 0.678389 5.07975 0.666687 5.57727V11.3791C0.666687 12.6425 1.69827 13.6667 2.9708 13.6667H4.24821C4.46614 13.6683 4.67568 13.5834 4.83034 13.431C4.98499 13.2786 5.07197 13.0711 5.07196 12.8548H5.09584Z"
                          fill="#5570F1"
                        />
                      </svg>
                    </Link>
                    <p className="currentPage">{this.getPageName()}</p>
                  </Breadcrumbs>
                </div>
              </div>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  enableHeaderShadow: state.ThemeOptions.enableHeaderShadow,
  closedSmallerSidebar: state.ThemeOptions.closedSmallerSidebar,
  headerBackgroundColor: state.ThemeOptions.headerBackgroundColor,
  enableMobileMenu : state.ThemeOptions.enableMobileMenuSmall,
});

  const mapDispatchToProps = (dispatch) => ({});
  
  
  export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Header));