import React, { useState, useEffect, useCallback } from "react";
import { Container, Box, Heading, Text, Image, Card, Button } from "gestalt";
import Strapi from "strapi-sdk-javascript/build/main";

import Loader from "./Loader ";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

const Brews = ({ match }) => {
  const [brews, setBrews] = useState([]);
  const [brand, setBrand] = useState("");
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

  // просто посмотреть что приходит
  // useEffect(() => {
  //   console.log(match.params.brandId);
  // }, [match.params.brandId]);

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
                            onClick={() => this.addItemToCart(brew)}
                          />
                        </Text>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
      {/* Spinner */}
      <Loader show={loadingBrand} />
    </Container>
  );
};

export default Brews;
