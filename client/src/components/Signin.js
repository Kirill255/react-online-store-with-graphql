import React, { useState } from "react";
import { Container, Box, Button, Heading, TextField } from "gestalt";
import Strapi from "strapi-sdk-javascript/build/main";

import ToastMessage from "./ToastMessage";

import { setTokenToLocalStorage } from "../utils";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

// history приходит из роута
const Signin = ({ history }) => {
  const [user, setUser] = useState({
    name: "",
    password: ""
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // it's gestalt input -> e.value, not e.target.value, e -> {event: SyntheticEvent, value: "yourvalue"}
  const handleChange = ({ event, value }) => {
    const { name } = event.target;

    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // если поля формы пустые
    if (isFormEmpty(user)) {
      showToast("Fill in all fields");
      return;
    }

    // sign in user
    try {
      setLoading(true);
      const response = await strapi.login(user.name, user.password);
      // console.log(response);

      setLoading(false);
      // put token (to manage user session) in localStorage
      setTokenToLocalStorage(response.jwt);
      redirectUser("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
      showToast(error.message);
    }
  };

  const isFormEmpty = ({ name, password }) => !name || !password;

  const showToast = (msg) => {
    setToastVisible(true);
    setToastMessage(msg);

    setTimeout(() => {
      setToastVisible(false);
      setToastMessage("");
    }, 3000);
  };

  const redirectUser = (path) => history.push(path);

  return (
    <Container>
      <Box
        dangerouslySetInlineStyle={{
          __style: {
            backgroundColor: "#d6a3b1"
          }
        }}
        shape="rounded"
        display="flex"
        justifyContent="center"
        margin={4}
        padding={4}
      >
        {/* Sign In Form */}
        <form
          style={{
            diplay: "inlineBlock",
            textAlign: "center",
            maxWidth: 450
          }}
          onSubmit={handleSubmit}
        >
          {/* Sign In Form Heading */}
          <Box diplay="flex" direction="column" alignItems="center" marginBottom={2}>
            <Heading color="midnight"> Welcome Back!</Heading>
          </Box>
          {/* Username Input */}
          <TextField
            id="name"
            type="text"
            name="name"
            placeholder="Username"
            onChange={handleChange}
          />
          {/* Password Input */}
          <TextField
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <Box marginTop={1}>
            <Button type="submit" text="Submit" color="blue" inline disabled={loading} />
          </Box>
        </form>
      </Box>
      {/* ToastMessage */}
      <ToastMessage show={toastVisible} message={toastMessage} />
    </Container>
  );
};

export default Signin;
