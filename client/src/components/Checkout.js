import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Container, Box, Heading, TextField, Text } from "gestalt";
import { Elements, StripeProvider, CardElement, injectStripe } from "react-stripe-elements";
import Strapi from "strapi-sdk-javascript/build/main";

import ConfirmationModal from "./ConfirmationModal";
import ToastMessage from "./ToastMessage";

// prettier-ignore
import { calculatePrice, calculateAmount, getCartFromLocalStorage , clearCartFromLocalStorage } from "../utils";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

// наш вспомогательный компонент с разметкой, сюда же добавили stripe-credit-card-input
// stripe приходит в пропсы после injectStripe https://github.com/stripe/react-stripe-elements#setting-up-your-payment-form-injectstripe
const _CheckoutForm = ({ stripe, history }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState({
    address: "",
    postalCode: "",
    city: "",
    confirmationEmailAddress: ""
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [modal, setModal] = useState(false);

  // получить значения из localStorage при загрузке/перезагрузке страницы
  useEffect(() => {
    const items = getCartFromLocalStorage();
    setCartItems(items);
  }, []);

  const handleChange = ({ event, value }) => {
    const { name } = event.target;

    setOrderInfo((prevOrderInfo) => ({ ...prevOrderInfo, [name]: value }));
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();

    // если поля формы пустые
    if (isFormEmpty(orderInfo)) {
      showToast("Fill in all fields");
      return;
    }
    // console.log(orderInfo);
    // если поля заполнены, то открываем диалоговое окно
    setModal(true);
  };

  const handleSubmitOrder = async () => {
    const amount = calculateAmount(cartItems); // total price

    setOrderProcessing(true);

    try {
      // create stripe token
      const response = await stripe.createToken();
      const token = response.token.id;

      const { address, postalCode, city, confirmationEmailAddress } = orderInfo;

      // create order with strapi sdk (make request to backend)
      await strapi.createEntry("orders", {
        address,
        postalCode,
        city,
        brews: cartItems,
        amount,
        token
      });

      // send email to client confirmationEmailAddress
      await strapi.request("POST", "/email", {
        data: {
          to: confirmationEmailAddress,
          subject: `Order Confirmation — BrewHaha ${new Date(Date.now())}`,
          text: "Your order has been processed",
          html: "<bold>Expect your order to arrive in 2-3 shipping days</bold>"
        }
      });

      // set orderProcessing - false, set modal - false
      setOrderProcessing(false);
      setModal(false);

      // clear user card of brews
      clearCartFromLocalStorage();

      // show success toast and than redirect to "/"
      showToast("Your order has been successfully submitted!", true);
    } catch (error) {
      // set order processing - false, modal - false
      setOrderProcessing(false);
      setModal(false);
      // show error toast with error message
      showToast(error.message);
    }
  };

  const closeModal = () => setModal(false);

  const isFormEmpty = ({ address, postalCode, city, confirmationEmailAddress }) =>
    !address || !postalCode || !city || !confirmationEmailAddress;

  const showToast = (msg, redirect = false) => {
    setToastVisible(true);
    setToastMessage(msg);

    setTimeout(() => {
      setToastVisible(false);
      setToastMessage("");
      // if true is passed to 'redirect' argument, redirect home
      if (redirect) {
        history.push("/");
      }
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
              onSubmit={handleConfirmOrder}
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
              {/* Stripe Credit Card Element Input */}
              <CardElement id="stripe__input" onReady={(input) => input.focus()} />

              <button id="stripe__button" type="submit">
                Submit
              </button>
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
      {/* Confirmation Modal */}
      {modal && (
        <ConfirmationModal
          cartItems={cartItems}
          orderProcessing={orderProcessing}
          closeModal={closeModal}
          handleSubmitOrder={handleSubmitOrder}
        />
      )}
      {/* ToastMessage */}
      <ToastMessage show={toastVisible} message={toastMessage} />
    </Container>
  );
};

// проинжектили наш вспомогательный компонент
const CheckoutForm = withRouter(injectStripe(_CheckoutForm));

// наш экспортируемый по-умолчанию компонент
const Checkout = () => (
  <StripeProvider apiKey="pk_test_0FvZKOX93M2PW3lLdvxnp09Y00R1TmWhEJ">
    <Elements>
      <CheckoutForm />
    </Elements>
  </StripeProvider>
);

export default Checkout;
