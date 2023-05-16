import Head from "next/head"
import Link from "next/link"
import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../constants/networkMapping.json"
import rentAppAbi from "../../constants/RentApp.json"

export default function createProperty() {
    const [alert, setAlert] = React.useState(false)
    const [propertyName, setPropertyName] = React.useState("")
    const [propertyFormData, setPropertyFormData] = React.useState({
        area: null,
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
            const rentAppAddress = networkMapping["11155111"].RentApp[0]
            const contractAbi = rentAppAbi
            const contract = new ethers.Contract(rentAppAddress, contractAbi, signer)

            const propertyTx = await contract.createProperty(_nftTokenURI, _propertyName, _hashOfMetaData)
            // Wait for the transaction to be confirmed
            const propertyTxReceipt = await propertyTx.wait()
            // Get the property ID from the event emitted by the contract
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
        <div>
            <div className="container mx-auto px-4 py-5">
                <Link href="/myproperties" className="back-button">
                    Back
                </Link>
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-field">
                        <label>
                            Owner Name:
                            <input
                                type="text"
                                value={propertyNftData.ownerName}
                                onChange={(e) =>
                                    setPropertyNftData((data) => {
                                        data.ownerName = e.target.value
                                        return data
                                    })
                                }
                            />
                        </label>
                    </div>
                    <div className="form-field">
                        <label>
                            Property Name:
                            <input type="text" value={propertyName} onChange={(e) => setPropertyName(e.target.value)} />
                        </label>
                    </div>
                    <label>
                        Address:
                        <input
                            type="text"
                            value={propertyNftData.address}
                            onChange={(e) =>
                                setPropertyNftData((data) => {
                                    data.address = e.target.value
                                    return data
                                })
                            }
                        />
                    </label>
                    <label>
                        Country Code:
                        <input
                            type="text"
                            value={propertyNftData.countryCode}
                            onChange={(e) =>
                                setPropertyNftData((data) => {
                                    data.countryCode = e.target.value
                                    return data
                                })
                            }
                        />
                    </label>
                    <label>
                        Number of Rooms:
                        <input
                            type="text"
                            value={propertyFormData.numberOfRooms}
                            onChange={(e) =>
                                setPropertyFormData((data) => {
                                    data.numberOfRooms = e.target.value
                                    return data
                                })
                            }
                        />
                    </label>
                    <label>
                        Area:
                        <input
                            type="text"
                            value={propertyFormData.area}
                            onChange={(e) =>
                                setPropertyFormData((data) => {
                                    data.area = e.target.value
                                    return data
                                })
                            }
                        />
                    </label>
                    <label>
                        Floor:
                        <input
                            type="text"
                            value={propertyFormData.floor}
                            onChange={(e) =>
                                setPropertyFormData((data) => {
                                    data.floor = e.target.value
                                    return data
                                })
                            }
                        />
                    </label>
                    <label>
                        Build Year:
                        <input
                            type="text"
                            value={propertyFormData.buildYear}
                            onChange={(e) =>
                                setPropertyFormData((data) => {
                                    data.buildYear = e.target.value
                                    return data
                                })
                            }
                        />
                    </label>
                    <button type="submit" className=" bg-violet-900 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded max-w-xs">
                        Create New Property
                    </button>
                </form>
                {alert ? <>Property is Created! </> : <></>}
            </div>
        </div>
    )
}
