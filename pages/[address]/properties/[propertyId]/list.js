import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { ethers } from "ethers"
import React from "react"
import { useRouter } from "next/router"
import networkMapping from "../../../../constants/networkMapping.json"
import rentAppAbi from "../../../../constants/RentApp.json"
import { structureProperties } from "../../../../utilities/structureStructs"

export default function listProperty() {
    const router = useRouter()
    const { propertyId: id } = router.query
    const [properties, setProperties] = React.useState([])
    const [alert, setAlert] = useState(false)
    let provider, signer, userAddress, rentAppAddress, contractAbi, contract

    const [description, setDescription] = React.useState("")
    const [rentalTerm, setRentalTerm] = React.useState("")
    const [rentalPrice, setRentalPrice] = React.useState("")
    const [depositAmount, setDepositAmount] = React.useState("")
    const [hashOfRentalAggreement, setHashOfRentalAggreement] = React.useState("")

    const [rentalTermSeconds, setRentalTermSeconds] = React.useState("year")
    const [numDays, setNumDays] = React.useState("")

    const [selectedPhotos, setSelectedPhotos] = React.useState([])
    const [file, setFile] = React.useState(null)

    React.useEffect(() => {
        async function getUserProperties() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                provider = new ethers.providers.Web3Provider(ethereum)
                signer = provider.getSigner()
                userAddress = await signer.getAddress()
                rentAppAddress = networkMapping["11155111"].RentApp[0]
                contractAbi = rentAppAbi
                contract = new ethers.Contract(rentAppAddress, contractAbi, provider)
                const [listedPropertiesResponse, userPropertiesResponse] = await Promise.all([
                    contract.getListedProperties(),
                    contract.getUserProperties(userAddress),
                ])
                const listedProperties = structureProperties(listedPropertiesResponse)
                const userProperties = structureProperties(userPropertiesResponse).map((userProperty) => {
                    userProperty.isListed = false
                    listedProperties.forEach((listedProperty) => {
                        if (listedProperty.propertyNftId === userProperty.propertyNftId) {
                            userProperty.isListed = true
                        }
                    })
                    return userProperty
                })
                return userProperties
            }
        }

        getUserProperties().then((properties) => {
            setProperties(properties)
        })
    }, [])

    async function listProperty(_description, _propertyNftId, _rentalTerm, _rentalPrice, _depositAmount, /*_hashOfPhotos*/ _hashOfRentalAggreement) {
        provider = new ethers.providers.Web3Provider(ethereum)
        signer = provider.getSigner()
        userAddress = await signer.getAddress()
        rentAppAddress = networkMapping["11155111"].RentApp[0]
        contractAbi = rentAppAbi
        contract = new ethers.Contract(rentAppAddress, contractAbi, signer)
        const propertyTx = await contract.listProperty(
            _description,
            _propertyNftId,
            _rentalTerm,
            _rentalPrice,
            _depositAmount,
            //_hashOfPhotos,
            _hashOfRentalAggreement
        )
        // Wait for the transaction to be confirmed
        const propertyTxReceipt = await propertyTx.wait()
        // Get the property ID from the event emitted by the contract
        const events = propertyTxReceipt.events
        const propertyListedEvent = events.find((e) => e.event === "PropertyListed")
        const propertyId = propertyListedEvent.args[1]

        console.log(`Property is listed. Property ID: ${propertyId}`)
        setAlert(true)
        return propertyId
    }

    const property = properties.find((property) => property.propertyNftId === parseInt(id))
    if (!property) {
        return <div>Property not found</div>
    }
    console.log("Property", property)

    console.log(description, property.propertyNftId, rentalTerm, rentalPrice, depositAmount, hashOfRentalAggreement)
    const handleSubmit = async (e) => {
        e.preventDefault()
        let seconds = 0
        if (rentalTermSeconds === "month") {
            seconds = 30 * 24 * 60 * 60
        } else if (rentalTermSeconds === "three-months") {
            seconds = 3 * 30 * 24 * 60 * 60
        } else if (rentalTermSeconds === "six-months") {
            seconds = 6 * 30 * 24 * 60 * 60
        } else if (rentalTermSeconds === "year") {
            seconds = 12 * 30 * 24 * 60 * 60
        } else if (rentalTermSeconds === "custom") {
            seconds = numDays * 24 * 60 * 60
        }

        setRentalTerm(seconds)

        //Fix this
        const formData = new FormData()
        selectedPhotos.forEach((file, index) => {
            formData.append(`file_${index}`, file, `photo${index}.jpg`)
        })
        console.log(formData.get("file_0"))
        const response = await fetch("/api/upload-property-photos", {
            method: "POST",
            body: formData,
            contentType: "multipart/form-data",
        }).then((response) => {
            response.json()
            console.log("Response: ", response)
        })

        //until here
        // update hashofrentalagreement and add hashofphotos
        await listProperty(description, property.propertyNftId, rentalTerm, rentalPrice, depositAmount, hashOfRentalAggreement)
    }

    const handleRentalTermChange = (event) => {
        setRentalTermSeconds(event.target.value)
    }

    const handleNumDaysChange = (event) => {
        setNumDays(event.target.value)
    }
    const handlePhotosChange = (e) => {
        console.log("e.target.files: ", e.target.files)
        const files = Array.from(e.target.files)
        console.log("files: ", files)
        setSelectedPhotos(files)
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setFile(file)
    }

    return (
        <div>
            <div>
                <div>
                    <Link href="/myproperties" className="back-button">
                        Back
                    </Link>

                    <div>
                        <div>Property ID: {property.propertyNftId}</div>
                        <div>Property Name: {property.name}</div>
                        <div> Status: {property.isRented === "true" ? "Rented" : "Vacant"}</div>
                        {property.isRented === "true" ? <div> Rent Contract Id: {property.rentContractId} </div> : <></>}
                        <form onSubmit={handleSubmit} className="form" enctype="multipart/form-data">
                            <label>
                                Description:
                                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </label>
                            <label>
                                Rental Term:
                                <select value={rentalTermSeconds} onChange={handleRentalTermChange}>
                                    <option value="year">Year</option>
                                    <option value="month">Month</option>
                                    <option value="three-months">Three Months</option>
                                    <option value="six-months">Six Months</option>

                                    <option value="custom">Select Number of Days</option>
                                </select>
                            </label>
                            {rentalTermSeconds === "custom" && (
                                <label>
                                    Number of Days:
                                    <input type="number" value={numDays} onChange={handleNumDaysChange} />
                                </label>
                            )}

                            <label>
                                Rental Price (WEI):
                                <input type="number" value={rentalPrice} onChange={(e) => setRentalPrice(e.target.value)} />
                            </label>
                            <label>
                                Deposit Amount (WEI):
                                <input type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                            </label>
                            <label>
                                Photos:
                                <input type="file" multiple onChange={handlePhotosChange} />
                            </label>
                            <label>
                                Rental Terms and Agreements:
                                <input type="file" onChange={handleFileChange} />
                            </label>

                            <button type="submit" className="button-standart">
                                List Property
                            </button>
                        </form>
                        {alert ? <> Property is Listed! </> : <></>}
                    </div>
                </div>
            </div>
        </div>
    )
}
