// import React, { Fragment, Component, useState, useEffect } from "react";

// import Slider from "react-slick";
// // import {Button} from "@mui/material";
// import bg1 from "../../../assets/utils/images/originals/city.jpg";
// import bg2 from "../../../assets/utils/images/originals/citydark.jpg";
// import bg3 from "../../../assets/utils/images/originals/citynights.jpg";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// import {
//   Col,
//   Row,
//   Button,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   TextField,
// } from "reactstrap";
// import { Link, useHistory } from "react-router-dom";
// import "./index.scss";
// import { useDispatch } from "react-redux";
// import { loginAction } from "../../../redux/Actions";
// import {
//   FormControl,
//   InputAdornment,
//   InputLabel,
//   OutlinedInput,
// } from "@mui/material";
// import { IconButton } from "material-ui";
// import { Visibility, VisibilityOff } from "@mui/icons-material";

// const Login = () => {
//   const history = useHistory();
//   const [showPassword, setShowPassword] = useState(false);
//   const dispatch = useDispatch();
//   const [isError, setError] = useState({ email: false, password: false });
//   const [data, setData] = useState({
//     email: "",
//     password: "",
//   });
//   let settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     arrows: true,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     fade: true,
//     initialSlide: 0,
//     autoplay: true,
//     adaptiveHeight: true,
//   };

//   useEffect(() => {
//     localStorage.clear();
//   }, []);
//   const handleChange = (e) => {
//     setData({ ...data, [e.target.name]: e.target.value });
//   };
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (data.email.trim() !== "" && data.password.trim() !== "") {
//       dispatch(
//         loginAction(data, () => {
//           history.push("/Dashboard");
//           window.location.reload();
//         })
//       );
//     } else {
//       if (data.email.trim() === "") {
//         setError({ ...isError, email: true });
//       } else {
//         setError({ ...isError, password: true });
//       }
//     }
//   };
//   return (
//     <Fragment>
//       <div className="h-100">
//         <Row className="h-100 g-0 row">
//           <Col lg="6" md="6" sm="12">
//             <div className="slider-light">
//               <Slider {...settings}>
//                 <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
//                   <div
//                     className="slide-img-bg"
//                     style={{
//                       backgroundImage: "url(" + bg1 + ")",
//                     }}
//                   />
//                   <div className="slider-content">
//                     <h3>Perfect Balance</h3>
//                     <p>
//                       ArchitectUI is like a dream. Some think it's too good to
//                       be true! Extensive collection of unified React Boostrap
//                       Components and Elements.
//                     </p>
//                   </div>
//                 </div>
//                 <div className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
//                   <div
//                     className="slide-img-bg"
//                     style={{
//                       backgroundImage: "url(" + bg3 + ")",
//                     }}
//                   />
//                   <div className="slider-content">
//                     <h3>Scalable, Modular, Consistent</h3>
//                     <p>
//                       Easily exclude the components you don't require.
//                       Lightweight, consistent Bootstrap based styles across all
//                       elements and components
//                     </p>
//                   </div>
//                 </div>
//                 <div className="h-100 d-flex justify-content-center align-items-center bg-sunny-morning">
//                   <div
//                     className="slide-img-bg opacity-6"
//                     style={{
//                       backgroundImage: "url(" + bg2 + ")",
//                     }}
//                   />
//                   <div className="slider-content">
//                     <h3>Complex, but lightweight</h3>
//                     <p>
//                       We've included a lot of components that cover almost all
//                       use cases for any type of application.
//                     </p>
//                   </div>
//                 </div>
//               </Slider>
//             </div>
//           </Col>
//           <Col
//             lg="6"
//             md="6"
//             sm="12"
//             className="h-100 bg-white d-flex justify-content-center align-items-center"
//           >
//             <div className="app-login-box px-3 text-center">
//               <div className="logoBox">
//                 <div className="app-logo" />
//                 <div className="authSlogen">
//                   <h6>Welcome back!</h6>
//                   <p className="authSlogenText">Login to your account</p>
//                 </div>
//               </div>

//               <div className="loginSignupForm">
//                 <form onSubmit={handleSubmit}>
//                   <Row>
//                     <Col md={12}>
//                       <FormGroup>
//                         <Input
//                           required
//                           autoComplete="off"
//                           type="email"
//                           name="email"
//                           id="exampleEmail"
//                           value={data.email}
//                           placeholder="Email here..."
//                           onChange={handleChange}
//                         />
//                       </FormGroup>
//                       {isError.email ? (
//                         <small className="errorClass">
//                           Please Enter Email.
//                         </small>
//                       ) : (
//                         ""
//                       )}
//                     </Col>
//                     <Col md={12}>
//                       <FormGroup className="position-relative">
//                         <Input
//                           required
//                           autoComplete="off"
//                           type={showPassword ? "text" : "password"}
//                           name="password"
//                           id="examplePassword"
//                           placeholder="Password here..."
//                           value={data.password}
//                           onChange={handleChange}
//                         />
//                         <div
//                           className="position-absolute d-flex top-50 translate-middle-y"
//                           style={{ cursor: "pointer", right: "10px" }}
//                         >
//                           {showPassword ? (
//                             <AiOutlineEye
//                               onClick={() => setShowPassword(false)}
//                               aria-hidden="true"
//                             />
//                           ) : (
//                             <AiOutlineEyeInvisible
//                               onClick={() => setShowPassword(true)}
//                               aria-hidden="true"
//                             />
//                           )}
//                         </div>
//                       </FormGroup>

//                       {/* <FormControl
//                         sx={{ m: 1, width: "25ch" }}
//                         variant="outlined"
//                       >
//                         <OutlinedInput
//                           id="outlined-adornment-password"
//                           type={showPassword ? "text" : "password"}
//                           endAdornment={
//                             <InputAdornment position="end">
//                               <IconButton
//                                 aria-label="toggle password visibility"
//                                 onClick={() => setShowPassword(false)}
//                                 onMouseDown={() => setShowPassword(false)}
//                                 edge="end"
//                               >
//                                 {showPassword ? (
//                                   <VisibilityOff />
//                                 ) : (
//                                   <Visibility />
//                                 )}
//                               </IconButton>
//                             </InputAdornment>
//                           }
//                           placeholder="Password"
//                           value={data.password}
//                           onChange={handleChange}
//                         />
//                       </FormControl> */}
//                       {isError.password ? (
//                         <small className="errorClass">
//                           Please Enter Password.
//                         </small>
//                       ) : (
//                         ""
//                       )}
//                     </Col>
//                     <Col md={12} className="text-end">
//                       <Link
//                         to="/forget"
//                         className=" btn btn-link m-auto px-0"
//                         onClick={() => {
//                           history.push("/forget");
//                         }}
//                       >
//                         Forget Password
//                       </Link>
//                     </Col>
//                   </Row>

//                   <div className="d-flex align-items-center">
//                     <div className="ms-auto">
//                       <Button type="submit" color="primary" size="small">
//                         Login
//                       </Button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </div>
//     </Fragment>
//   );
// };
// export default Login;
import React, { Fragment, useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import bg1 from "../../../assets/utils/images/originals/shareChart.png";
import bg2 from "../../../assets/utils/images/originals/shareChart.png";
import bg3 from "../../../assets/utils/images/originals/shareChart.png";
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
import { loginAction, setBackgroundColor } from "../../../redux/Actions";

const Login = () => {
  const history = useHistory();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const [isError, setError] = useState({ email: false, password: false });
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.email.trim() !== "" && data.password.trim() !== "") {
      dispatch(
        loginAction(data, () => {
          history.push("/Dashboard");
          window.location.reload();
        })
      );
    } else {
      if (data.email.trim() === "") {
        setError({ ...isError, email: true });
      } else {
        setError({ ...isError, password: true });
      }
    }
  };

  const items = [
    {
      image: bg1,
      title: " ",
      description: " ",
    },
    {
      image: bg3,
      title: " ",
      description: " ",
    },
    {
      image: bg2,
      title: " ",
      description: " ",
    },
  ];

  return (
    <Fragment>
      <Box
        height="100vh"
        display="flex"
        flexDirection="row"
       
      >
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
                  style={{
                    // backgroundImage: `url(${item.image})`,
                    backgroundColor: "rgba(184, 195, 249, 1)",
                  }}
                  className="slider-content"
                >
                  <Box textAlign="center" color="#fff">
                    {/* <Typography variant="h3">{item.title}</Typography>
                    <Typography>{item.description}</Typography> */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="img-fluid"
                    />
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
                <div className="logoBox">
                  <div className="app-logo" />
                  <div className="authSlogen">
                    <h6>Welcome back!</h6>
                    <p className="authSlogenText">Login to your account</p>
                  </div>
                </div>
                <Box component={"div"} className="loginSignupForm">
                  <form onSubmit={handleSubmit}>
                    <Box component={"div"} className="loginInputBox">
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <TextField
                            className="loginInput"
                            fullWidth
                            required
                            autoComplete="off"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={handleChange}
                            error={isError.email}
                            helperText={
                              isError.email ? "Please Enter Email." : ""
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <svg
                                    width="22"
                                    height="20"
                                    viewBox="0 0 22 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M16.9026 6.85107L12.4593 10.4641C11.6198 11.1301 10.4387 11.1301 9.59921 10.4641L5.11843 6.85107"
                                      stroke="#6E7079"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      fill-rule="evenodd"
                                      clip-rule="evenodd"
                                      d="M15.9089 19C18.9502 19.0084 21 16.5095 21 13.4384V6.57001C21 3.49883 18.9502 1 15.9089 1H6.09114C3.04979 1 1 3.49883 1 6.57001V13.4384C1 16.5095 3.04979 19.0084 6.09114 19H15.9089Z"
                                      stroke="#6E7079"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            className="loginInput"
                            fullWidth
                            required
                            autoComplete="off"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={handleChange}
                            error={isError.password}
                            helperText={
                              isError.password ? "Please Enter Password." : ""
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <svg
                                    width="18"
                                    height="20"
                                    viewBox="0 0 18 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M13.4234 7.4478V5.3008C13.4234 2.7878 11.3854 0.7498 8.8724 0.7498C6.3594 0.7388 4.3134 2.7668 4.3024 5.2808V5.3008V7.4478"
                                      stroke="#6E7079"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      fill-rule="evenodd"
                                      clip-rule="evenodd"
                                      d="M12.6832 19.2496H5.0422C2.9482 19.2496 1.2502 17.5526 1.2502 15.4576V11.1686C1.2502 9.07359 2.9482 7.37659 5.0422 7.37659H12.6832C14.7772 7.37659 16.4752 9.07359 16.4752 11.1686V15.4576C16.4752 17.5526 14.7772 19.2496 12.6832 19.2496Z"
                                      stroke="#6E7079"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M8.8629 12.2028V14.4238"
                                      stroke="#6E7079"
                                      stroke-width="1.5"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
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
                      <Box mt={1} display="flex" justifyContent="end">
                        <Link
                          to="/forget"
                          className="btn textPurpal px-0 link-text"
                          onClick={() => {
                            history.push("/forget");
                          }}
                        >
                          Forgot Password
                        </Link>
                      </Box>
                    </Box>
                    <Box component={"div"}>
                      <Typography variant="subtitle1">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="textPurpal">
                          Sign Up
                        </Link>
                      </Typography>
                    </Box>
                    <Box mt={2}>
                      <Button type="submit" color="primary" variant="contained">
                        Login
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Box>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
};
export default Login;
