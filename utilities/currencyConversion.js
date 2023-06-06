import networkMapping from "../constants/networkMapping.json"
import mainContractAbi from "../constants/MainContract.json"
import { ethers } from "ethers"

export const getWEIAmountInUSD = async (ethAmount) => {
    if (typeof window !== "undefined") {
        ethereum = window.ethereum
        const provider = new ethers.providers.Web3Provider(ethereum)
        const mainContractAddress = networkMapping["11155111"].MainContract[0]
        const contractAbi = mainContractAbi
        const contract = new ethers.Contract(mainContractAddress, contractAbi, provider)
        const amountInWei = ethers.BigNumber.from(ethers.utils.parseUnits(ethAmount, 18))
        const amountInUsd = await contract.getWEIAmountInUSD(amountInWei)
        return amountInUsd
    }
}
