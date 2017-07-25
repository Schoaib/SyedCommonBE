# Express & ES6 REST API
This project is created to serve as backend api for SyedBrand1FE and SyedBrand2FE projects.

The projects supports the following:<br>
ES6 support via [babel-register](https://babeljs.io/docs/usage/babel-register/)<br>
Body Parsing via [body-parser](https://www.npmjs.com/package/body-parser)<br>
CORS support via [cors](https://www.npmjs.com/package/cors)<br>
Promise support via [bluebird](https://www.npmjs.com/package/bluebird)<br>
Redis Client via [redis](https://www.npmjs.com/package/redis)<br>
Promise based HTTP client via [axios](https://www.npmjs.com/package/axios)<br><br>


Below you will find some information on how to perform common tasks.<br>

## Folder Structure
README.md
  node_modules/
  package.json
  src/
    routes/
    utils/
  app.js
  index.js
  redis.js
  server.js
  
# Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:8080](http://localhost:8080)

### `npm run forever`

Runs the app for production.<br>

## Docker Support

#### Create Image
### `docker build -t syedcommonbe:1.0 .`

#### Create Container
### `docker run -p 8080:8080 --name syedcommonbe syedcommonbe:1.0`




