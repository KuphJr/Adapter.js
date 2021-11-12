const jsonString = JSON.stringify("1234567890");
console.log("!!!!!!!!!!!!!!JSONstring: ",jsonString, " jsonStringLength: ", jsonString.length);
if (jsonString.length-2 > 32) {
  throw "The returned value is larger than 32 bytes but the specified return type is bytes32."
}
let ext = {};
ext = (() => {return 1;})();
console.log(ext);

const { VM, VMScript } = require('vm2');
const vm = new VM({
  timeout: 1000,
  sandbox: {}
});
script = new VMScript("(() => {" + "return 1;" + "})();").compile();
let result = vm.run(script);
console.log("res",result);