// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Token.sol";

contract TokenFaucet {
    /*//////////////////////////////////////////////////////////////
                                CONSTANTS
    //////////////////////////////////////////////////////////////*/

    uint256 public constant FAUCET_AMOUNT = 100 * 1e18;
    uint256 public constant COOLDOWN_TIME = 24 hours;
    uint256 public constant MAX_CLAIM_AMOUNT = 1_000 * 1e18;

    /*//////////////////////////////////////////////////////////////
                                STATE
    //////////////////////////////////////////////////////////////*/

    FaucetToken public immutable token;
    address public admin;
    bool private paused;

    mapping(address => uint256) public lastClaimAt;
    mapping(address => uint256) public totalClaimed;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event TokensClaimed(address indexed user, uint256 amount, uint256 timestamp);
    event FaucetPaused(bool paused);

    /*//////////////////////////////////////////////////////////////
                              MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier onlyAdmin() {
        require(msg.sender == admin, "Caller is not admin");
        _;
    }

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address tokenAddress) {
        require(tokenAddress != address(0), "Invalid token address");
        token = FaucetToken(tokenAddress);
        admin = msg.sender;
    }

    /*//////////////////////////////////////////////////////////////
                            FAUCET LOGIC
    //////////////////////////////////////////////////////////////*/

    function requestTokens() external {
        require(!paused, "Faucet is paused");
        require(canClaim(msg.sender), "Cooldown period not elapsed");

        uint256 remaining = remainingAllowance(msg.sender);
        require(remaining >= FAUCET_AMOUNT, "Lifetime claim limit reached");

        // Effects
        lastClaimAt[msg.sender] = block.timestamp;
        totalClaimed[msg.sender] += FAUCET_AMOUNT;

        // Interaction
        token.mint(msg.sender, FAUCET_AMOUNT);

        emit TokensClaimed(msg.sender, FAUCET_AMOUNT, block.timestamp);
    }

    function canClaim(address user) public view returns (bool) {
        if (paused) return false;
        if (block.timestamp < lastClaimAt[user] + COOLDOWN_TIME) return false;
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) return false;
        return true;
    }

    function remainingAllowance(address user) public view returns (uint256) {
        if (totalClaimed[user] >= MAX_CLAIM_AMOUNT) {
            return 0;
        }
        return MAX_CLAIM_AMOUNT - totalClaimed[user];
    }

    /*//////////////////////////////////////////////////////////////
                          ADMIN CONTROLS
    //////////////////////////////////////////////////////////////*/

    function setPaused(bool _paused) external onlyAdmin {
        paused = _paused;
        emit FaucetPaused(_paused);
    }

    function isPaused() external view returns (bool) {
        return paused;
    }
}
