import propertyNftAbi from "./PropertyNft.json"
import tenantSoulboundTokenAbi from "./TenantSoulboundToken.json"
import rentAppAbi from "./RentApp.json"
import networkMapping from "./networkMapping.json"
export const rentAppAddress = networkMapping["11155111"].RentApp[0]
import { store } from "@/store"
import { ethers } from "ethers"
import { globalActions } from "@/store/globalSlices"

const { setWallet } = globalActions
let tx, ethereum

if (typeof window !== "undefined") {
    ethereum = window.ethereum
}

const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

const serversideEthereumContract = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_APP_RPC_URL)
    const wallet = ethers.Wallet.createRandom()
    const signer = provider.getSigner(wallet.address)
    const contract = new ethers.Contract(rentAppAddress, rentAppAbi, signer)
    return contract
}
//this is gonna use metamask
const clientSideEthereumContract = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, contractAbi, signer)
    return contract
}

const getListedProperties = async () => {
    const contract = await serversideEthereumContract()
    const listedProperties = await contract.getListedProperties()
    return structureProperties(listedProperties)
}
// FIX THIS
const getUserProperties = async () => {
    try {
        const wallet = store.getState().globalStates.wallet
        console.log("wallet", wallet)
        const contract = await serversideEthereumContract()
        const userProperties = await contract.getUserProperties("0x526566ee13Ec5a1f92075C72908879Ccadf2AB61")
        return structureProperties(userProperties)
    } catch (error) {
        console.log(error)
    }
}

const mintPropertyNft = async (tokenURI) => {
    try {
        if (!ethereum) return reportError("Please install Metamask")
        const wallet = store.getState().globalStates.wallet
        const contract = await clientSideEthereumContract()
        tx = await contract.mintPropertyNFT(tokenURI, {
            from: wallet,
        })
        tx.wait()
    } catch (error) {
        reportError(error)
    }
}

const structureProperties = (properties) =>
    properties.map((property) => ({
        propertyNftId: Number(property.propertyNftId),
        owner: property.owner.toLowerCase(),
        name: property.name,
        description: property.description,
        rentalTerm: property.rentalTerm,
        rentalPrice: fromWei(property.rentalPrice),
        depositAmount: fromWei(property.depositAmount),
        hashOfRentalAgreement: property.hashOfRentalAgreement,
        rentContractsAccepted: Number(property.rentContractsAccepted),
        isRented: property.isRented,
        rentContractId: Number(property.rentContractId),
    }))

const connectWallet = async () => {
    try {
        if (!ethereum) return reportError("Please install Metamask")
        const accounts = await ethereum.request({ method: "eth_requestAccounts" })
        store.dispatch(setWallet(accounts[0]))
    } catch (error) {
        reportError(error)
    }
}

const truncate = (text, startChars, endChars, maxLength) => {
    if (text.length > maxLength) {
        let start = text.substring(0, startChars)
        let end = text.substring(text.length - endChars, text.length)
        while (start.length + end.length < maxLength) {
            start = start + "."
        }
        return start + end
    }
    return text
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

export { connectWallet, truncate, monitorWalletConnection, getListedProperties, getUserProperties, mintPropertyNft }
