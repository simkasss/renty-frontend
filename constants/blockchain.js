import propertyNftAbi from "./PropertyNft.json"
import tenantSoulboundTokenAbi from "./TenantSoulboundToken.json"
import rentAppAbi from "./RentApp.json"
import networkMapping from "./networkMapping.json"
export const rentAppAddress = networkMapping["11155111"].RentApp[0]
import { store } from "../store"
import { ethers } from "ethers"
import { globalActions } from "../store/globalSlices"
import { structureProperties } from "../utilities/structureStructs"

const { setWallet } = globalActions
let tx, ethereum

if (typeof window !== "undefined") {
    ethereum = window.ethereum
}

const serversideEthereumContract = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_APP_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = provider.getSigner(wallet.address)
    const contract = new ethers.Contract(rentAppAddress, rentAppAbi, signer)
    return contract
}

const getListedProperties = async () => {
    const contract = await serversideEthereumContract()
    const listedProperties = await contract.getListedProperties()
    return structureProperties(listedProperties)
}

const connectWallet = async () => {
    try {
        if (!ethereum) return reportError("Please install Metamask")
        const accounts = await ethereum.request({ method: "eth_requestAccounts" })
        store.dispatch(setWallet(accounts[0]))
    } catch (error) {
        reportError(error)
    }
}

const monitorWalletConnection = async () => {
    try {
        if (!ethereum) return reportError("Install Metamask")
        const accounts = await ethereum.request({ method: "eth_accounts" })

        window.ethereum.on("chainChanged", (chainId) => {
            window.location.reload()
        })

        window.ethereum.on("accountsChanged", async () => {
            store.dispatch(setWallet(accounts[0]))
            await monitorWalletConnection()
        })

        if (accounts.length) {
            store.dispatch(setWallet(accounts[0]))
        } else {
            store.dispatch(setWallet(""))
            reportError("Connect your wallet.")
        }
    } catch (error) {
        reportError(error)
    }
}

export { connectWallet, monitorWalletConnection, getListedProperties }
