import React, { useState } from "react";
import { Container, Box, Heading, TextField, Button } from "gestalt";

import ToastMessage from "./ToastMessage";

const Checkout = () => {
  const [orderInfo, setOrderInfo] = useState({
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: ""
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = ({ event, value }) => {
    const { name } = event.target;

    setOrderInfo((prevOrderInfo) => ({ ...prevOrderInfo, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // если поля формы пустые
    if (isFormEmpty(orderInfo)) {
      showToast("Fill in all fields");
      return;
    }
    console.log(orderInfo);
  };

  const isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) =>
    !address || !postalCode || !city || !confirmationEmailAddress;

  const showToast = (msg) => {
    setToastVisible(true);
    setToastMessage(msg);

    setTimeout(() => {
      setToastVisible(false);
      setToastMessage("");
    }, 3000);
  };

  return (
    <Container>
      <Box
        color="darkWash"
        shape="rounded"
        display="flex"
        justifyContent="center"
        margin={4}
        padding={4}
      >
        {/* Checkout Form */}
        <form
          style={{
            diplay: "inlineBlock",
            textAlign: "center",
            maxWidth: 450
          }}
          onSubmit={handleSubmit}
        >
          {/* Checkout Form Heading */}
          <Box diplay="flex" direction="column" alignItems="center" marginBottom={2}>
            <Heading color="midnight"> Checkout</Heading>
          </Box>
          {/* Shipping Address Input */}
          <TextField
            id="address"
            type="text"
            name="address"
            placeholder="Shipping Address"
            onChange={handleChange}
          />
          {/* Postal Code Input */}
          <TextField
            id="postalCode"
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            onChange={handleChange}
          />
          {/* City Input */}
          <TextField
            id="city"
            type="text"
            name="city"
            placeholder="City of Residence"
            onChange={handleChange}
          />
          {/* Confirmation Email Address Input */}
          <TextField
            id="confirmationEmailAddress"
            type="email"
            name="confirmationEmailAddress"
            placeholder="Confirmation Email Address"
            onChange={handleChange}
          />
          <Box marginTop={1}>
            <Button type="submit" text="Submit" color="blue" inline />
          </Box>
        </form>
      </Box>
      {/* ToastMessage */}
      <ToastMessage show={toastVisible} message={toastMessage} />
    </Container>
  );
};

export default Checkout;
