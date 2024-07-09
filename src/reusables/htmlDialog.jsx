// ** React Imports
import { forwardRef, Fragment, useState, useEffect } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import "./reusables.scss";
import { Box, Input, Typography } from "@mui/material";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = (props) => {
  const {
    open,
    setOpen,
    placeOrderBtt,
    apiCall,
    Heading,
    data
  } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    apiCall();
  };

  return (
    <Fragment>
      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={open}
        keepMounted
        // onClose={handleClose}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="modal-header py-4 px-3 text-center">
          {Heading}
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h6"
            component="h6"
            className="text-center dark-gray fs-6 mb-3"
          >
            Placing an Order to {data?.shareType}
          </Typography>
          <Typography
            variant="h6"
            component="h6"
            className="text-center text-gray fs-6 mb-3"
          >
            <strong className="text-dark"> {data?.shares || 0} Shares </strong> of {data?.stockSymbol || "--"} at
            <strong className="text-dark"> ${data?.midPrice} / shr </strong>
          </Typography>
          <Typography
            variant="h6"
            component="h6"
            className="text-center text-gray fs-6 mb-3"
          >
            Total after Order {data?.stockSymbol || "--"}
            <strong className="text-dark"> ${data?.existingValue} {/*or 28% of equity*/} </strong>
          </Typography>
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
              className="btn btn-lg w-auto btn-outline-purple"
              onClick={handleClose}
            >
              Modify
            </button>
            <button
              className="btn btn-lg w-auto btn-purple"
              onClick={handleSubmit}
              disabled={placeOrderBtt ? "" : "true"}
            >
              Place Order
            </button>
          </Box>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default Modal;
