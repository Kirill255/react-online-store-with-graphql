import React, { useState } from "react";
import { Container, Box, Button, Heading, Text, TextField } from "gestalt";
import Strapi from "strapi-sdk-javascript/build/main";

import ToastMessage from "./ToastMessage";

import { setTokenToLocalStorage } from "../utils";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

// history приходит из роута
const Signup = ({ history }) => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // it's gestalt input -> e.value, not e.target.value, e -> {event: SyntheticEvent, value: "yourvalue"}
  const handleChange = ({ event, value }) => {
    const { name } = event.target;
    // event.persist(); // это не нужно, так как name у нас кэшируется в переменую, если бы использовали значение напрямую setUser((prevUser) => ({ ...prevUser, [event.target.name]: value })); то нужно было бы вызвать event.persist();

    // setUser({ ...user, [name]: value }); // можно так
    setUser((prevUser) => ({ ...prevUser, [name]: value })); // или так
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // если поля формы пустые
    if (isFormEmpty(user)) {
      showToast("Fill in all fields");
      return;
    }

    // sign up user
    try {
      setLoading(true);
      const response = await strapi.register(user.name, user.email, user.password);
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

  const isFormEmpty = ({ name, email, password }) => !name || !email || !password;

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
            backgroundColor: "#ebe2da"
          }
        }}
        shape="rounded"
        display="flex"
        justifyContent="center"
        margin={4}
        padding={4}
      >
        {/* Sign Up Form */}
        <form
          style={{
            diplay: "inlineBlock",
            textAlign: "center",
            maxWidth: 450
          }}
          onSubmit={handleSubmit}
        >
          {/* Sign Up Form Heading */}
          <Box diplay="flex" direction="column" alignItems="center" marginBottom={2}>
            <Heading color="midnight"> Let's Get Started</Heading>
            <Text italic color="orchid" align="center">
              Sign up to order some brews!
            </Text>
          </Box>
          {/* Username Input */}
          <TextField
            id="name"
            type="text"
            name="name"
            placeholder="Username"
            onChange={handleChange}
          />
          {/* Email Address Input */}
          <TextField
            id="email"
            type="email"
            name="email"
            placeholder="Email Adress"
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

export default Signup;

/*
https://stackoverflow.com/questions/56076246/react-hooks-with-form

https://rangle.io/blog/simplifying-controlled-inputs-with-hooks/
https://medium.com/free-code-camp/how-to-get-started-with-react-hooks-controlled-forms-826c99943b92
https://reactjs.org/docs/hooks-reference.html#functional-updates

https://codesandbox.io/s/6wvjz6xl1z
https://hiddentao.com/archives/2019/03/22/react-usereducer-hook-for-form-handling
*/
