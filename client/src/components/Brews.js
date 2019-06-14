import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Container, Box, Heading, Text, Image, Card, Button, Mask, IconButton } from "gestalt";
import Strapi from "strapi-sdk-javascript/build/main";

import Loader from "./Loader ";

import { calculatePrice, getCartFromLocalStorage, setCartToLocalStorage } from "../utils";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

const Brews = ({ match }) => {
  const [brews, setBrews] = useState([]);
  const [brand, setBrand] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [loadingBrand, setLoadingBrand] = useState(true);

  const fetchAPI = useCallback(async () => {
    try {
      const { data } = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
            brand(id: "${match.params.brandId}"){
              id
              name
              brews {
                id
                name
                description
                price
                image {
                  url
                }
              }
            }
          }`
        }
      });
      // console.log(data);
      setBrews(data.brand.brews);
      setBrand(data.brand.name);
      setLoadingBrand(false);
    } catch (error) {
      console.log(error);
      setLoadingBrand(false);
    }
  }, [match.params.brandId]);

  useEffect(() => {
    fetchAPI();
  }, [fetchAPI]);

  // https://stackoverflow.com/questions/54954091/how-to-use-callback-with-usestate-hook-in-react
  // https://www.robinwieruch.de/react-usestate-callback/
  // https://github.com/the-road-to-learn-react/use-state-with-callback
  // суть в том что нам нужно чтобы значение корзины не обнулялось при перезагрузке страницы, для этого будет использовать localStorage
  // с react-class-component мы могли бы сделать что-то вроде того:
  // this.setState({ cartItems: updatedItems }, () => setCartToLocalStorage(updatedItems)); и this.setState({ cartItems: filteredItems }, () => setCartToLocalStorage(filteredItems));
  // но у хука useState нет коллбэка, поэтому придёться сделать примерно так

  // получить значения из localStorage при загрузке/перезагрузке страницы
  useEffect(() => {
    const items = getCartFromLocalStorage();
    setCartItems(items);
  }, []);

  // обновить значения в localStorage при изменении cartItems, тоесть добавили/удалили item
  useEffect(() => {
    setCartToLocalStorage(cartItems);
  }, [cartItems]);

  // просто посмотреть что приходит
  // useEffect(() => {
  //   console.log(match.params.brandId);
  // }, [match.params.brandId]);

  const addItemToCart = (brew) => {
    const alreadyInCart = cartItems.findIndex((item) => item.id === brew.id);

    if (alreadyInCart === -1) {
      // если ещё нет товара в корзине
      const updatedItems = cartItems.concat({
        ...brew,
        quantity: 1
      });

      setCartItems(updatedItems);
    } else {
      // если есть, то нужно увеличить кол-во
      const updatedItems = [...cartItems];

      updatedItems[alreadyInCart].quantity += 1;
      setCartItems(updatedItems);
    }
  };

  const deleteItemFromCart = (itemToDeleteId) => {
    const filteredItems = cartItems.filter((item) => item.id !== itemToDeleteId);

    setCartItems(filteredItems);
  };

  return (
    <Container>
      {!loadingBrand && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="start"
          marginTop={4}
          dangerouslySetInlineStyle={{
            __style: {
              flexWrap: "wrap-reverse"
            }
          }}
        >
          {/* Brews Section */}
          <Box display="flex" direction="column" alignItems="center">
            {/* Brews Heading */}
            <Box margin={2} align="center">
              <Heading color="orchid">{brand}</Heading>
            </Box>
            {/* Brews */}
            <Box
              dangerouslySetInlineStyle={{
                __style: {
                  backgroundColor: "#bdcdd9"
                }
              }}
              shape="rounded"
              display="flex"
              justifyContent="center"
              wrap
              padding={4}
            >
              {brews.map((brew) => (
                <Box width={210} margin={2} paddingY={4} key={brew.id}>
                  <Card
                    image={
                      <Box width={200} height={250}>
                        <Image
                          src={`${apiUrl}${brew.image.url}`}
                          alt="Brand"
                          fit={"cover"}
                          naturalWidth={1}
                          naturalHeight={1}
                        />
                      </Box>
                    }
                  >
                    <Box
                      display="flex"
                      direction="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box marginBottom={2}>
                        <Text size="xl" bold>
                          {brew.name}
                        </Text>
                      </Box>
                      <Text>{brew.description}</Text>
                      <Text color="orchid">$ {brew.price}</Text>
                      <Box marginTop={2}>
                        <Text size="xl" bold>
                          <Button
                            text="Add to Cart"
                            color="blue"
                            onClick={() => addItemToCart(brew)}
                          />
                        </Text>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
          {/* User Cart */}
          <Box alignSelf="end" marginTop={2} marginLeft={8}>
            <Mask shape="rounded" wash>
              <Box display="flex" direction="column" alignItems="center" padding={2}>
                {/* User Cart Heading */}
                <Heading align="center" size="sm">
                  Your Cart
                </Heading>
                <Text color="gray" italic>
                  {cartItems.length} items selected
                </Text>
                {/* Cart Items */}
                {cartItems.map((item) => (
                  <Box key={item.id} display="flex" alignItems="center">
                    <Text>
                      {item.name} x {item.quantity} — $ {(item.quantity * item.price).toFixed(2)}
                    </Text>
                    <IconButton
                      accessibilityLabel="Delete Item"
                      icon="cancel"
                      size="sm"
                      iconColor="red"
                      onClick={() => deleteItemFromCart(item.id)}
                    />
                  </Box>
                ))}
                {/* Total Price of Cart Items */}
                <Box display="flex" direction="column" justifyContent="center" alignItems="center">
                  <Box margin={2}>
                    {cartItems.length === 0 && <Text color="red">Please select some items</Text>}
                  </Box>
                  <Text size="lg">Total: {calculatePrice(cartItems)}</Text>
                  <Text>
                    <Link to="/checkout">Checkout</Link>
                  </Text>
                </Box>
              </Box>
            </Mask>
          </Box>
        </Box>
      )}
      {/* Spinner */}
      <Loader show={loadingBrand} />
    </Container>
  );
};

export default Brews;
