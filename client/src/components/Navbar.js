import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Text, Heading, Image } from "gestalt";

const Navbar = () => {
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

export default Navbar;
