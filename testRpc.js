import { ethers } from "ethers";

const provider = new ethers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/82e4170c97b144b3b7ffad28ce899058"
);

const block = await provider.getBlockNumber();
console.log(block);


// #docker compose down    
// docker system prune -f 
// docker compose build --no-cache 
// docker compose up 
// docker ps