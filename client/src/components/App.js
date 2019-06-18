import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const isMounted = useRef(true);

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

      // https://www.robinwieruch.de/react-warning-cant-call-setstate-on-an-unmounted-component/
      // https://stackoverflow.com/questions/54954385/react-useeffect-causing-cant-perform-a-react-state-update-on-an-unmounted-comp
      // https://toster.ru/q/605261
      // т.к. запрос асинхронный, то ответ может прийти когда компонент уже размонтирован, и попытаться изменить стейт, нужно предотвратить такое поведение, тоесть менять стейт только если компонент всё ещё смонтирован
      if (isMounted.current) {
        setBrands(data.brands);
        setLoadingBrands(false);
      }
    } catch (error) {
      console.log(error);
      if (isMounted.current) {
        setLoadingBrands(false);
      }
    }
  }

  useEffect(() => {
    fetchAPI();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // e.value, not e.target.value, it's gestalt input
  const handleChange = ({ value }) => {
    setSearchTerm(value); // после того как строка поиска изменилась, вызвать searchBrands
    // searchBrands(); // не знаю будут ли баги, т.к. у хуков нет коллбэка, а стейт всё-таки асинхронный, с rcc было бы так this.setState({ searchTerm: value }, () => this.searchBrands());

    // upd: так точно будут баги! вводите символ поиска и нет перерендера, вводите второй символ поиска и отображается результат поиска с предыдущего раза и т.д
    // вводите "s" -> ничего
    // продолжаете ввод "so" -> показывает результат поиска для "s"
    // продолжаете ввод "sol" -> показывает результат поиска для "so"

    // вариант1: переписать на react-class-component
    // вариант2: засунул вызов searchBrands() не в хэндлер handleChange, а в useEffect и слушаю изменения searchTerm, ну и в useCallback завернул
  };

  // const filteredBrands = () => {
  //   return brands.filter((brand) => {
  //     return (
  //       brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       brand.description.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   });
  // };

  // используем graphql поиск вместо поиска на клиенте с помощью filter метода
  // const searchBrands = async () => {
  const searchBrands = useCallback(async () => {
    setLoadingBrands(true);

    const { data } = await strapi.request("POST", "/graphql", {
      data: {
        query: `query{
          brands(where: {
            name_contains: "${searchTerm}"
          }){
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

    if (isMounted.current) {
      setBrands(data.brands);
      setLoadingBrands(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    searchBrands();
  }, [searchBrands, searchTerm]);

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
        {brands.map((brand) => (
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
