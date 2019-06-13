import React, { useState, useEffect } from "react";
// prettier-ignore
import { Container, Box, Heading, Card, Image, Text, SearchField, Icon /* , Spinner */ } from "gestalt";
import { Link } from "react-router-dom";
import Strapi from "strapi-sdk-javascript/build/main";

import Loader from "./Loader ";

const apiUrl = process.env.API_URL || "http://localhost:1337";
const strapi = new Strapi(apiUrl);

function App() {
  const [brands, setBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingBrands, setLoadingBrands] = useState(true);

  async function fetchAPI() {
    try {
      const { data } = await strapi.request("POST", "/graphql", {
        data: {
          query: `query {
            brands {
              _id
              name
              description
              image {
                url
              }
            }
          }`
        }
      });

      setBrands(data.brands);
      setLoadingBrands(false);
    } catch (error) {
      console.log(error);
      setLoadingBrands(false);
    }
  }

  useEffect(() => {
    fetchAPI();
  }, []);

  const handleChange = ({ value }) => setSearchTerm(value); // e.value, not e.target.value, it's gestalt input

  const filteredBrands = () => {
    return brands.filter((brand) => {
      return (
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  return (
    <Container>
      {/* Brands Search Field */}
      <Box display="flex" justifyContent="center" marginTop={4}>
        <SearchField
          id="searchField"
          accessibilityLabel="Brands Search Field"
          placeholder="Search Brands"
          onChange={handleChange}
          value={searchTerm}
        />
        <Box margin={3}>
          <Icon
            icon="filter"
            color={searchTerm ? "orange" : "gray"}
            size={20}
            accessibilityLabel="Filter"
          />
        </Box>
      </Box>
      {/* Brands Section */}
      <Box display="flex" justifyContent="center" marginBottom={2}>
        {/* Brands Header */}
        <Heading color="midnight" size="md">
          Brew Brands
        </Heading>
      </Box>
      {/* Brands */}
      <Box
        dangerouslySetInlineStyle={{
          __style: {
            backgroundColor: "#d6c8ec"
          }
        }}
        shape="rounded"
        display="flex"
        justifyContent="around"
        wrap
      >
        {filteredBrands().map((brand) => (
          <Box width={200} margin={2} paddingY={4} key={brand._id}>
            <Card
              image={
                <Box width={200} height={200}>
                  <Image
                    src={`${apiUrl}${brand.image.url}`}
                    alt="Brand"
                    fit="cover"
                    naturalWidth={1}
                    naturalHeight={1}
                  />
                </Box>
              }
            >
              <Box display="flex" direction="column" justifyContent="center" alignItems="center">
                <Text bold size="xl">
                  {brand.name}
                </Text>
                <Text>{brand.description}</Text>
                <Text bold size="xl">
                  <Link to={`/${brand._id}`}>See Brews</Link>
                </Text>
              </Box>
            </Card>
          </Box>
        ))}
      </Box>
      {/* Spinner */}
      {/* <Spinner show={loadingBrands} accessibilityLabel="Loading Spinner" /> */}
      <Loader show={loadingBrands} />
    </Container>
  );
}

export default App;
