import mainContractAbi from "./MainContract.json"
import networkMapping from "./networkMapping.json"
import { store } from "../store"
import { ethers } from "ethers"
import { globalActions } from "../store/globalSlices"
import { structureProperties } from "../utilities/structureStructs"
export const mainContractAddress = networkMapping["11155111"].MainContract[0]

const { setWallet } = globalActions
let tx, ethereum

const serversideEthereumContract = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_APP_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = provider.getSigner(wallet.address)
    const contract = new ethers.Contract(mainContractAddress, mainContractAbi, signer)
    return contract
}

const getListedProperties = async () => {
    const contract = await serversideEthereumContract()
    const listedProperties = await contract.getListedProperties()
    return structureProperties(listedProperties)
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

export { monitorWalletConnection, getListedProperties }
