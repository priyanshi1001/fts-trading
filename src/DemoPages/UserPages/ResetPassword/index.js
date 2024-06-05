import React, { Fragment, useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import bg1 from "../../../assets/utils/images/originals/city.jpg";
import bg2 from "../../../assets/utils/images/originals/citydark.jpg";
import bg3 from "../../../assets/utils/images/originals/citynights.jpg";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import {
  Box,
  Button,
  TextField,
  IconButton,
  Typography,
  Container,
  Grid,
  InputAdornment,
} from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import "./index.scss";
import { useDispatch } from "react-redux";
import { loginAction } from "../../../redux/Actions";

const Login = () => {
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [isError, setError] = useState({ password: false, ConfirmPassword: false });
  const [data, setData] = useState({
    password: "",
    ConfirmPassword: "",
  });

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { password, ConfirmPassword } = data;
    if (password.trim() !== "" && ConfirmPassword.trim() !== "") {
      if (password === ConfirmPassword) {
        history.push("/Dashboard");
        // dispatch(
        //   loginAction(data, () => {
        //     history.push("/Dashboard");
        //     window.location.reload();
        //   })
        // );
      } else {
        setError({ password: true, ConfirmPassword: true });
      }
    } else {
      setError({ password: password.trim() === "", ConfirmPassword: ConfirmPassword.trim() === "" });
    }
  };

  const items = [
    {
      image: bg1,
      title: "Perfect Balance",
      description:
        "ArchitectUI is like a dream. Some think it's too good to be true! Extensive collection of unified React Bootstrap Components and Elements.",
    },
    {
      image: bg3,
      title: "Scalable, Modular, Consistent",
      description:
        "Easily exclude the components you don't require. Lightweight, consistent Bootstrap based styles across all elements and components",
    },
    {
      image: bg2,
      title: "Complex, but lightweight",
      description:
        "We've included a lot of components that cover almost all use cases for any type of application.",
    },
  ];

  return (
    <Fragment style={{ overflow: "hidden" }}>
      <Box height="100vh" display="flex" flexDirection="row" style={{ overflow: "hidden" }}>
        <Grid container>
          <Grid item lg={6} md={6} sm={12}>
            <Carousel>
              {items.map((item, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100vh"
                  style={{ backgroundImage: `url(${item.image})` }}
                  className="slider-content"
                >
                  <Box textAlign="center" color="#fff">
                    <Typography variant="h3">{item.title}</Typography>
                    <Typography>{item.description}</Typography>
                  </Box>
                </Box>
              ))}
            </Carousel>
          </Grid>
          <Grid
            item
            lg={6}
            md={6}
            sm={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="white"
          >
            <Container maxWidth="xs">
              <Box textAlign="center">
                <Box mb={4}>
                  <Typography variant="h6">Welcome back!</Typography>
                  <Typography variant="body1">Login to your account</Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        autoComplete="off"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        label="Password"
                        value={data.password}
                        onChange={handleChange}
                        error={isError.password}
                        helperText={
                          isError.password ? "Please enter password." : ""
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <AiOutlineEye />
                                ) : (
                                  <AiOutlineEyeInvisible />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        autoComplete="off"
                        type={showPassword ? "text" : "password"}
                        name="ConfirmPassword"
                        label="Confirm Password"
                        value={data.ConfirmPassword}
                        onChange={handleChange}
                        error={isError.ConfirmPassword}
                        helperText={
                          isError.ConfirmPassword ? "Passwords must match." : ""
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <AiOutlineEye />
                                ) : (
                                  <AiOutlineEyeInvisible />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                   
                  </Grid>
                  <Box mt={2}>
                   
                    <Button type="submit" color="primary" variant="contained">
                    Set New Password
                    </Button>
                  </Box>
                </form>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};

export default Login;
