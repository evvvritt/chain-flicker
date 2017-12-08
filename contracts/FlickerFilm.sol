pragma solidity ^0.4.0;

contract FlickerFilmContract {
  bytes4[] public colors;
  function getCount() public constant returns(uint count) {
    return colors.length;
  }
  function getColor(uint index) public constant returns(bytes4) {
    return colors[index];
  }
  function addColor(bytes4 colorAndLength) public {
    colors.push(colorAndLength);
  }
  function changeColor(bytes4 colorAndLength, uint index) public {
    colors[index] = colorAndLength;
  }
}