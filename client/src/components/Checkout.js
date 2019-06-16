import React, { useState, useEffect } from "react";
import { Container, Box, Heading, TextField, Text, Button } from "gestalt";

import ToastMessage from "./ToastMessage";

import { calculatePrice, getCartFromLocalStorage } from "../utils";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState({
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: ""
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // получить значения из localStorage при загрузке/перезагрузке страницы
  useEffect(() => {
    const items = getCartFromLocalStorage();
    setCartItems(items);
  }, []);

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
        direction="column"
        justifyContent="center"
        alignItems="center"
        margin={4}
        padding={4}
      >
        {/* Checkout Form Heading */}
        <Box diplay="flex" direction="column" alignItems="center" marginBottom={2}>
          <Heading color="midnight"> Checkout</Heading>
        </Box>
        {cartItems.length ? (
          <>
            {/* User Cart */}
            <Box
              display="flex"
              direction="column"
              justifyContent="center"
              alignItems="center"
              marginTop={2}
              marginBottom={6}
            >
              <Text color="darkGray" italic>
                {cartItems.length} Items for Checkout
              </Text>
              <Box padding={2}>
                {cartItems.map((item) => (
                  <Box key={item.id} padding={1}>
                    <Text color="midnight">
                      {item.name} x {item.quantity} — $ {(item.quantity * item.price).toFixed(2)}
                    </Text>
                  </Box>
                ))}
              </Box>
              <Text bold> Total Amount: {calculatePrice(cartItems)} </Text>
            </Box>
            {/* Checkout Form */}
            <form
              style={{
                diplay: "inlineBlock",
                textAlign: "center",
                maxWidth: 450
              }}
              onSubmit={handleSubmit}
            >
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
          </>
        ) : (
          /* Default Text if No Items in Cart */
          <Box color="darkWash" shape="rounded" padding={4}>
            <Heading align="center" color="watermelon" size="xs">
              Your Cart is Empty
            </Heading>
            <Text align="center" color="green" italic>
              Add Some Brews!
            </Text>
          </Box>
        )}
      </Box>
      {/* ToastMessage */}
      <ToastMessage show={toastVisible} message={toastMessage} />
    </Container>
  );
};

export default Checkout;
