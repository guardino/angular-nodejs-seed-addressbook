# MEAN Stack for angular2 2.4.5

* "start": start node
* "build:dev":build a DEV version using WEBPACK
* "build:prod":build a AOT version using WEBPACK
* "clear": clean all constructed files

# Known compatibility issues

* Safari: Can not authenticate
* IE: needs upgrade to Edge 13
* Firefox: needs upgrade to 45.8.0. 
    TODO: grab all remote resource back to local to fix some loading issues.
* Chrome: newest version

# Babel
Babel is used to compile ES6 to ES5 which may enhance the compatibility. 
* npm i -g babel-cli
* babel ./public/js/main.bundle.js --out-file ./public/js/main.bundle.js
