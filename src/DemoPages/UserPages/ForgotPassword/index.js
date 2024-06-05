import React, { Fragment } from "react";
import Carousel from "react-material-ui-carousel";
import bg1 from "../../../assets/utils/images/originals/city.jpg";
import bg2 from "../../../assets/utils/images/originals/citydark.jpg";
import bg3 from "../../../assets/utils/images/originals/citynights.jpg";
import { Box, Button, Grid, TextField, Typography, Link, Container } from "@mui/material";
import { useHistory } from "react-router-dom";
import "./index.scss";

const Forget = () => {
  let settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    initialSlide: 0,
    autoplay: true,
    adaptiveHeight: true,
  };
  let history = useHistory();
  
  const items = [
    {
      image: bg1,
      title: "Perfect Balance",
      description: "ArchitectUI is like a dream. Some think it's too good to be true! Extensive collection of unified React Bootstrap Components and Elements.",
    },
    {
      image: bg3,
      title: "Scalable, Modular, Consistent",
      description: "Easily exclude the components you don't require. Lightweight, consistent Bootstrap based styles across all elements and components.",
    },
    {
      image: bg2,
      title: "Complex, but lightweight",
      description: "We've included a lot of components that cover almost all use cases for any type of application.",
    },
  ];

  return (
    <Fragment>
      <Box height="100vh" display="flex" flexDirection="row">
        <Grid container>
          <Grid item lg={4} className="d-none d-lg-block">
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
          <Grid item lg={8} md={12} display="flex" bgcolor="white" justifyContent="center" alignItems="center">
            <Container maxWidth="xs">
              <Box textAlign="center">
                <Box mb={4}>
                  <Typography variant="h4" gutterBottom>
                    Forgot your Password?
                  </Typography>
                  <Typography variant="body1">
                    Use the form below to recover it.
                  </Typography>
                </Box>
                <form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        required
                        type="email"
                        name="email"
                        label="Email"
                        placeholder="Email here..."
                      />
                    </Grid>
                  </Grid>
                  <Box mt={4} display="flex" alignItems="center">
                    <Typography variant="body1">
                      <Link onClick={() => history.push("/login")} style={{ cursor: "pointer", color: "#1976d2" }}>
                        Sign in existing account
                      </Link>
                    </Typography>
                    <Box ml="auto">
                      <Button variant="contained" color="primary" size="small">
                        Recover Password
                      </Button>
                    </Box>
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

export default Forget;
