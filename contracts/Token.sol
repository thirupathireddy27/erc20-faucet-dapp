// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FaucetToken is ERC20, Ownable {
    /// @notice Maximum token supply (in base units)
    uint256 public constant MAX_SUPPLY = 1_000_000 * 1e18;

    /// @notice Address allowed to mint tokens (Faucet contract)
    address public faucet;

    constructor(
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) Ownable(msg.sender) {}

    /**
     * @notice Set faucet address (only owner)
     */
    function setFaucet(address _faucet) external onlyOwner {
        require(_faucet != address(0), "Invalid faucet address");
        faucet = _faucet;
    }

    /**
     * @notice Mint tokens (only faucet)
     */
    function mint(address to, uint256 amount) external {
        require(msg.sender == faucet, "Caller is not faucet");
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");

        _mint(to, amount);
    }
}
