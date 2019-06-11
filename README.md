This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# react-online-store-with-graphql

https://coursehunters.net/course/sozdayte-internet-magazin-s-react-i-graphql-za-90-minut

https://github.com/reedbarger/ecommerce-react-graphql-stripe

https://github.com/simotae14/EcommerceReactGraphqlStripe

https://blog.strapi.io/building-a-static-website-using-gatsby-and-strapi/

## Strapi

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
