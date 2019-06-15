import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { Box, Text, Heading, Image, Button } from "gestalt";

import {
  getTokenFromLocalStorage,
  clearTokenFromLocalStorage,
  clearCartFromLocalStorage
} from "../utils";

const Navbar = ({ history }) => {
  const handleSigout = () => {
    clearCartFromLocalStorage();
    clearTokenFromLocalStorage();
    history.push("/");
  };

  // prettier-ignore
  return getTokenFromLocalStorage() !== null ? <AuthNav handleSigout={handleSigout} /> : <UnAuthNav />;
};

const AuthNav = ({ handleSigout }) => (
  <Box
    display="flex"
    justifyContent="around"
    alignItems="center"
    height={70}
    padding={1}
    color="midnight"
    shape="roundedBottom"
  >
    {/*Checkout Link */}
    <NavLink to="/checkout" activeClassName="active">
      <Text size="xl" color="white">
        Checkout
      </Text>
    </NavLink>

    {/* Title & Logo */}
    <NavLink to="/" exact activeClassName="active">
      <Box display="flex" alignItems="center">
        <Box width={50} height={50} margin={2}>
          <Image src="./icons/logo.svg" naturalWidth={1} naturalHeight={1} alt="BreHaha Logo" />
        </Box>
        <Heading size="xs" color="orange">
          BrewHaha
        </Heading>
      </Box>
    </NavLink>

    {/*Signout Button */}
    <Button text="Sign Out" size="md" color="transparent" inline onClick={handleSigout} />
  </Box>
);

const UnAuthNav = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="around"
      height={70}
      color="midnight"
      padding={1}
      shape="roundedBottom"
    >
      {/* Signin Link */}
      <NavLink to="/signin" activeClassName="active">
        <Text size="xl" color="white">
          Sign In
        </Text>
      </NavLink>

      {/* Title & Logo */}
      <NavLink to="/" exact activeClassName="active">
        <Box display="flex" alignItems="center">
          <Box width={50} height={50} margin={2}>
            <Image src="./icons/logo.svg" naturalWidth={1} naturalHeight={1} alt="BreHaha Logo" />
          </Box>
          <Heading size="xs" color="orange">
            BrewHaha
          </Heading>
        </Box>
      </NavLink>

      {/* Signiup Link */}
      <NavLink to="/signup" activeClassName="active">
        <Text size="xl" color="white">
          Sign Up
        </Text>
      </NavLink>
    </Box>
  );
};

export default withRouter(Navbar);
