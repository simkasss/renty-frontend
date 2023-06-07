import Head from "next/head"
import Link from "next/link"
import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../../constants/networkMapping.json"
import mainContractAbi from "../../../constants/MainContract.json"
import { CreateProperty } from "../../../components/CreateProperty"

export default function Create() {
    const [alert, setAlert] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [propertyName, setPropertyName] = React.useState("")
    const [propertyFormData, setPropertyFormData] = React.useState({
        area: null,
        address: null,
        numberOfRooms: null,
        floor: null,
        buildYear: null,
    })
    const [propertyNftData, setPropertyNftData] = React.useState({
        ownerName: null,
        address: null,
        countryCode: null,
    })

    async function createProperty(_nftTokenURI, _propertyName, _hashOfMetaData) {
        if (typeof window !== "undefined") {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const userAddress = await signer.getAddress()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)

            const propertyTx = await contract.createProperty(_nftTokenURI, _propertyName, _hashOfMetaData)

            const propertyTxReceipt = await propertyTx.wait()

            const events = propertyTxReceipt.events
            const propertyCreatedEvent = events.find((e) => e.event === "PropertyCreated")
            const propertyId = propertyCreatedEvent.args[1]

            console.log(`Property is created. Property ID: ${propertyId}`)
            setAlert(true)
            return propertyId
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Send form data to backend
        setLoading(true)

        const hashOfPropertyMetadata = await fetch("/api/create-property-metadata", {
            method: "POST",
            body: JSON.stringify(propertyFormData),
        }).then((response) => response.json())

        console.log("hash of property metadata: ", hashOfPropertyMetadata.propertyDataHash)

        const nftTokenURI = await fetch("/api/create-property-nft", {
            method: "POST",
            body: JSON.stringify(propertyNftData),
        }).then((response) => response.json())
        console.log("nft token URI: ", nftTokenURI.nftTokenURI)

        await createProperty(nftTokenURI.nftTokenURI, propertyName, hashOfPropertyMetadata.propertyDataHash)
    }
    return (
        <CreateProperty
            alert={alert}
            loading={loading}
            propertyName={propertyName}
            setPropertyName={setPropertyName}
            propertyFormData={propertyFormData}
            setPropertyFormData={setPropertyFormData}
            propertyNftData={propertyNftData}
            setPropertyNftData={setPropertyNftData}
            handleSubmit={handleSubmit}
        />
    )
}
