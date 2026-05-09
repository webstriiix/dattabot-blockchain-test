// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract Bereitstellen {
    string public color;
    address public deployer;
    event ColorChanged(address indexed by, string color);

    constructor() {
        deployer = msg.sender;
        color = "white"; // default color on first deployment
    }

    function setColor(string memory _yourNewColor) public {
        require(msg.sender == deployer, "Can only be called by deployer");
        color = _yourNewColor;
        emit ColorChanged(msg.sender, _yourNewColor);
    }
}
