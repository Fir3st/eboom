# eboom

[Boom](https://www.npmjs.org/package/boom) responses implementation for [ExpressJS](https://expressjs.com/).
For list of all methods that Boom provides, see [Boom documentation](https://github.com/hapijs/boom#readme).

## Install

```
yarn add eboom
(or npm install eboom)
```

## Usage

```
const express = require('express');
const eboom = require('eboom');

const app = express();
app.use(eboom());

app.use('/', (req, res) => {
  return res.boom.notImplemented();
});

app.listen(3000);
```
