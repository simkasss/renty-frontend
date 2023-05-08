import React, { useState, useEffect } from "react"
import Web3Modal from "web3modal"
import { ethers } from "ethers"
import propertyNftAbi from "./PropertyNft.json"
import tenantSoulboundTokenAbi from "./TenantSoulboundToken.json"
import rentAppAbi from "./RentApp.json"
import networkMapping from "./networkMapping.json"

const rentAppAddress = networkMapping["11155111"].RentApp[0]

// Fetchin smart contract
const fetchContract = (signerOrProvider) => new ethers.Contract(rentAppAddress, rentAppAbi, signerOrProvider)

export const RentAppContext = React.createContext()

export const RentAppProvider = ({ children }) => {
    const titleData = "Rent App Contract"
    const [currentAccount, setCurrentAccount] = useState("")

    const mintNft = async (_tokenURI) => {
        console.log("minting property Nft..")
        const tokenURI = _tokenURI
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const contract = fetchContract(signer)

        console.log(currentAccount)
        try {
            const transaction = await contract.mintPropertyNFT(tokenURI)
            await transaction.wait()
            console.log("success")
        } catch (error) {
            console.log(erro)
        }
    }
}
