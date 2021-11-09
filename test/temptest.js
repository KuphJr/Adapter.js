const jsonString = JSON.stringify("1234567890");
console.log("!!!!!!!!!!!!!!JSONstring: ",jsonString, " jsonStringLength: ", jsonString.length);
if (jsonString.length-2 > 32) {
  throw "The returned value is larger than 32 bytes but the specified return type is bytes32."
}