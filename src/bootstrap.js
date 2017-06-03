'use strict';
const fs = require('fs');

const check = path => {

};

class Boot {

  static bootstrapSync(src, recursive) {
    // console.log(src, recursive);
    console.log(__filename);
  }

  static bootstrap(src, recursive) {
    console.log(src, recursive);
    return new Promise((resolve, reject) => {

    });
  }
}

module.exports = Boot;
