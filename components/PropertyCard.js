import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
export function PropertyCard({ id, name, rentalPrice, rentalTerm, onClick }) {
    return (
        <Link href={`/properties/${id}`}>
            <div
                className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                role="button"
                tabIndex={0}
                onClick={onClick}
            >
                <div>
                    <div className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</div>
                    <span className="font-normal text-gray-700 dark:text-gray-400">Rental Price:</span>{" "}
                    <span className="text-gray-200 text-xs font-extrabold tracking-tight">{rentalPrice} ETH</span>
                    <div className="font-normal text-gray-700 dark:text-gray-400">Rental Term: {rentalTerm / 60 / 60 / 24} days</div>
                </div>
            </div>
        </Link>
    )
}

export function PropertyDetails({ property, onBack }) {
    const [numberOfRooms, setNumberOfRooms] = React.useState("")
    const [area, setArea] = React.useState("")
    const [floor, setFloor] = React.useState("")
    const [buildYear, setBuildYear] = React.useState("")

    async function getPropertyData() {
        const url = `https://gateway.pinata.cloud/ipfs/${property.hashOfMetaData}`
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setNumberOfRooms(data.numberOfRooms)
                setArea(data.area)
                setFloor(data.floor)
                setBuildYear(data.buildYear)
            })
            .catch((error) => console.error(error))
    }
    getPropertyData()
    const router = useRouter()

    const handleApplyClick = () => {
        router.push(`/properties/${property.propertyNftId}/apply-for-rent`)
    }

    return (
        <div className="container mx-auto px-4 py-5">
            <div className="flex">
                <div className="w-1/2">{/* Place your photo component here */}</div>
                <div className="w-1/2">
                    <div className="flex items-start justify-end mb-4">
                        <button className=" bg-violet-900 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded" onClick={handleApplyClick}>
                            Apply for Rent
                        </button>
                    </div>
                    <div className="property-info">
                        <h2>{property.name}</h2>
                        <p className="standartbolded">Rental Price</p>
                        <p>${property.rentalPrice} ETH/month</p>
                        <p className="standartbolded">Deposit:</p>
                        <p>{property.depositAmount} ETH</p>
                        <p className="standartbolded">Rental Term:</p>
                        <p>{property.rentalTerm / 60 / 60 / 24} days</p>
                        <p className="standartbolded">Number of rooms:</p>
                        <p>{numberOfRooms}</p>
                        <p className="standartbolded">Area:</p>
                        <p>{area}</p>
                        <p className="standartbolded">Floor:</p>
                        <p>{floor}</p>
                        <p className="standartbolded">Build Year:</p>
                        <p>{buildYear}</p>
                        <p className="standartbolded">Property NFT id:</p>
                        <p>{property.propertyNftId}</p>
                        <p className="standartbolded">Hash of Terms and Conditions:</p>
                        <p>{property.hashOfRentalAgreement}</p>
                    </div>
                </div>
            </div>
            <div className="description-section">
                <p className="standartbolded">Description:</p>
                <p>{property.description}</p>
            </div>

            <button className="back-button" onClick={onBack}>
                Back
            </button>
        </div>
    )
}
