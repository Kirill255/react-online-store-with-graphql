This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# react-online-store-with-graphql

https://coursehunters.net/course/sozdayte-internet-magazin-s-react-i-graphql-za-90-minut

https://github.com/reedbarger/ecommerce-react-graphql-stripe

https://github.com/simotae14/EcommerceReactGraphqlStripe

https://github.com/mariobermudezjr/ecommerce-react-graphql-stripe

https://blog.strapi.io/building-a-static-website-using-gatsby-and-strapi/

## Related

https://strapi.io/ — The open source Headless CMS Front-End Developers love.

https://stripe.com/ — The new standard in online payments

## Strapi

### Install

1. `npm install strapi@alpha -g` or `npm install -g strapi@beta` or try `npm install -g strapi@beta --unsafe-perm` https://github.com/strapi/strapi/issues/3386, также возникли проблемы с установкой на node v12, в данный момент strapi работает только на node v10 https://github.com/strapi/strapi/issues/3342, пришлось ставить node v10 и юзать strapi@alpha

2. Then create project `strapi new server` and select `custom` -> It's a database connection setup:

- mLab https://github.com/strapi/strapi/issues/2013

```
// (for example: mongo connection string "mongodb://<dbuser>:<password>@ds062807.mlab.com:62807/react-online-store-with-graphql")

Choose your installation type Custom (manual settings):
- Choose your main database: MongoDB
- Database name: react-online-store-with-graphql
- Host: ds062807.mlab.com
- +srv connection: false
- Port (It will be ignored if you enable +srv): 62807
- Username: dbuser
- Password: password
- Authentication database (Maybe "admin" or blank): react-online-store-with-graphql
- Enable SSL connection: false
```

- MongoDB Atlas https://strapi.io/documentation/3.0.0-beta.x/guides/databases.html#mongodb-installation

```
// (for example: mongo connection string "mongodb+srv://<dbuser>:<password>@testcluster-yemab.mongodb.net/test?retryWrites=true&w=majority")

Choose your installation type Custom (manual settings):
- Choose your main database: MongoDB
- Database name: (Default your_name_proj) press enter
- Host: testcluster-yemab.mongodb.net
- +srv connection: true
- Port (It will be ignored if you enable +srv): (Default 27017) press enter
- Username: dbuser
- Password: password
- Authentication database (Maybe "admin" or blank): press enter
- Enable SSL connection: true
```

3. `cd server` and `strapi start`

4. Go to Admin panel: http://localhost:1337/admin

5. Create a root(admin) user

6. Welcome on board! This will also create several collections in your database.

### GraphQL

1. Install GraphQL plugin on admin dashboard from "Marketplace" or `strapi install graphql`

![gql](https://user-images.githubusercontent.com/24504648/59390694-b42ec000-8d7a-11e9-8543-dafe1a5fd9c0.png)

2. Go to playground http://localhost:1337/graphql

3. Create on dashboard new Content Types: `Brand` with 3 fields: `name`, `description`, `image`

![type](https://user-images.githubusercontent.com/24504648/59390497-1f2bc700-8d7a-11e9-995e-ca2f930895a3.png)

4. Add several new Brands

![brand](https://user-images.githubusercontent.com/24504648/59390612-7e89d700-8d7a-11e9-9b4d-1cfe11ecc8ea.png)

![brand](https://user-images.githubusercontent.com/24504648/59439955-d702b800-8dfe-11e9-8ffd-c85f31d17185.png)

5. Add on dashboard Roles & Permissions for Brand type in Public and Authenticated: find(brands) and findone(brand(id)) with ratelimit

![roles](https://user-images.githubusercontent.com/24504648/59390437-e4299380-8d79-11e9-9f12-3920e7b2ec34.png)

6. Make requests

```gql
query {
  brands {
    _id
    name
    description
    image {
      _id
      name
      mime
      url
    }
  }
}
```

```gql
query {
  brand(id: "5d014f2d4eb948169c086fda") {
    _id
    name
    description
    image {
      _id
      name
      mime
      url
    }
  }
}
```

7. Create on dashboard new Content Types: `Brew` with 5 fields: `name`, `description`, `image`, `price` and relation with Brand

![brews](https://user-images.githubusercontent.com/24504648/59439656-5643bc00-8dfe-11e9-811f-49983a6b35cd.png)

8. Add several new Brews

![brew](https://user-images.githubusercontent.com/24504648/59439996-e8e45b00-8dfe-11e9-8c51-27df2367db6b.png)

9. Add on dashboard Roles & Permissions for Brew type in Public and Authenticated: find(brews) and findone(brew(id)) with ratelimit

![permis](https://user-images.githubusercontent.com/24504648/59441394-3235aa00-8e01-11e9-96e0-cfa4aaa98770.png)

10. Make requests

```gql
query {
  brews {
    _id
    createdAt
    updatedAt
    name
    description
    image {
      url
    }
    price
    brand {
      _id
      name
    }
  }
}
```

```gql
query {
  brew(id: "5d02566f82ac160bb8db835a") {
    _id
    createdAt
    name
    description
    image {
      url
    }
    price
  }
}
```

11. Create on dashboard new Content Types: `Order` with 4 fields: `address`, `postalCode`, `city`, `brews`

![ordertype](https://user-images.githubusercontent.com/24504648/59567486-2521f080-9077-11e9-9287-0f3d50f42b93.png)

12. Add on dashboard Roles & Permissions for Order type in Authenticated: create

![permorder](https://user-images.githubusercontent.com/24504648/59567518-85b12d80-9077-11e9-9039-b34194f52829.png)

## Stripe

https://stripe.com/docs/development

https://stripe.com/docs/recipes/elements-react

```
You may test your Stripe.js integration over HTTP. However, live Stripe.js integrations must use HTTPS.
```
