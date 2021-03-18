const express = require('express');
const app = express();
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.post('/', (req, res) => {
  
  const operators = {
    '+': (a, b) => a + b,
    '*': (a, b) => a * b,
    '-': (a, b) => a - b,
    '/': (a, b) => a / b,
    '^': (a, b) => Math.pow(a, b),
  };

  const operators_regex = /[+\-*/]/;
  
  const general_regex = /[+\-*/]*(\.\d+|\d+(\.\d+)?)/g;
  
  let myStr = req.body.op;
  myStr = myStr.match(general_regex).join("");

  let str_op = myStr.match(general_regex);
  let total = 0;

  for (let i = 0; i < str_op.length; i++) {
    if (i == 0 && parseFloat(str_op[i])) {
      total = parseFloat(str_op[i]);
    }else{
      let op = str_op[i].match(operators_regex);
      if(op){
        total = operators[op[0]](total, parseFloat(str_op[i].replace(op[0], "")));
      }
    }
  }
  
  res.status(200).json({
    status: "ok",
    result: total,
    message: myStr,
  });
});
 
app.listen(3000);