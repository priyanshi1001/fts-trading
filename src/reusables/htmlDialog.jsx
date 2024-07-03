// ** React Imports
import { forwardRef, Fragment, useState, useEffect } from "react";

// ** MUI Imports
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Slide from "@mui/material/Slide";
import DialogContentText from "@mui/material/DialogContentText";
import axios from "axios";
import "./reusables.scss";
import { Box, Input, Typography } from "@mui/material";
import { importContent } from "../redux/Actions";
import { async } from "q";
import { useDispatch } from "react-redux";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = (props) => {
  const [isError, setError] = useState(false);

  const {
    open,
    apiCall,
    Heading,
    deleteItems,
    setOpen,
    idData,
    dispatch,
    response,
    getList,
    fileData,
    setFileData,
  } = props;
  // ** State

  const handleClose = () => {
    setFileData(null);
    setOpen(false);
    console.log(fileData, open, "djfhnvd");
  };

  const handleDelete = async () => {
    deleteItems(idData);
    setOpen(false);
  };

  const handleSubmit = () => {
    // const file = fileData;
    // if (file === undefined || file === "") {
    //   setError(true);
    // } else {
    //   setError(false);
    //   const reader = new FileReader();
    //   reader.readAsBinaryString(file);
    //   // reader.onloadend = () => {
    //   const binaryString = reader.result; // Binary string.
    //   // const newFile = new File([binaryString], file.name, { type: file.type }) // Re-create file from binary data.
    //   // }
    //   const formData = new FormData();
    //   formData.append("formFile", fileData);
    //   apiCall(formData);
    // }
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
            Placing an Order to BUY
          </Typography>
          <Typography
            variant="h6"
            component="h6"
            className="text-center text-gray fs-6 mb-3"
          >
            <strong className="text-dark"> 1257 Shares </strong> of AAPL at
            <strong className="text-dark"> $150.15 / shr </strong>
          </Typography>
          <Typography
            variant="h6"
            component="h6"
            className="text-center text-gray fs-6 mb-3"
          >
            Total after Order AAPL
            <strong className="text-dark"> $298,739 or 28% of equity </strong>
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
