import { ethers } from "ethers"

export const getWeb3Provider = async () => {
  const RPC_URL = 'https://data-seed-prebsc-1-s3.binance.org:8545'
  return new ethers.providers.JsonRpcProvider(RPC_URL)
}