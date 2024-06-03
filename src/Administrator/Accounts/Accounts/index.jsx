import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
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
} from "@mui/material";
import ThemeOptions from "../../../Layout/ThemeOptions/";
import { Fragment } from "react";
import AppSidebar from "../../../Layout/AppSidebar/";


export default function Accounts() {
 
  return (
    <Card>
      <Fragment>
        <ThemeOptions />

        <div className="app-main">
          <AppSidebar />
          <div className="app-main__outer">
            <div className="app-main__inner">
              <div role="presentation" className="bread_crumbs">
                <Breadcrumbs aria-label="breadcrumb">
                  <Link
                    underline="hover"
                    color="#0c62a8"
                   
                  >
                    Content Block
                  </Link>
                  <p underline="hover" color="#000000">
                    Content Management Languages
                  </p>
                </Breadcrumbs>
              </div>
              <div
                className=" row m-1 border p-3 box_style"
                style={{ height: "900px" }}
              >
               Accountss
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </Card>
  );
}
