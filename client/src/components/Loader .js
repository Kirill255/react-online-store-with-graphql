import React from "react";
import { Box } from "gestalt";
import { GridLoader } from "react-spinners";

const Loader = ({ show }) =>
  show && (
    <Box
      position="fixed"
      dangerouslySetInlineStyle={{
        __style: {
          bottom: 300,
          left: "50%",
          transform: "translateX(-50%)"
        }
      }}
    >
      <GridLoader sizeUnit={"px"} size={25} color="darkorange" margin="3px" />
    </Box>
  );

export default Loader;

/*
const Loader = ({ show }) => (
  <GridLoader sizeUnit={"px"} size={25} color="darkorange" margin="5px" loading={show} />
);
*/

/*
const Loader = ({ show }) => (
  <Box
    position="fixed"
    dangerouslySetInlineStyle={{
      __style: {
        bottom: 300,
        left: "50%",
        transform: "translateX(-50%)"
      }
    }}
  >
    <GridLoader sizeUnit={"px"} size={25} color="darkorange" margin="3px" loading={show} />
  </Box>
);
*/
