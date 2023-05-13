import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"

export function PropertyCard({ id, name, rentalPrice, rentalTerm, onClick }) {
    return (
        <>
            <Link href={`/properties/${id}`}>
                <div className="property-card" role="button" tabIndex={0} onClick={onClick}>
                    {/* <img src={imageSrc} alt="Property" /> */}
                    <div className="property-details">
                        <div className="property-rental-price">{name}</div>
                        <div className="property-rental-price">{rentalPrice} ETH</div>
                        <div className="property-available-start-date">Rental Term: {rentalTerm / 60 / 60 / 24} days </div>
                    </div>
                </div>
            </Link>
        </>
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
        <div className="property-details">
            <button className="button-standart" onClick={handleApplyClick}>
                Apply for Rent
            </button>
            <div className="property-info">
                <h2>{`${property.name}`}</h2>
                <p className="standartbolded">Rental Price </p>
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
                <p className="standartbolded">Description:</p>
                <p>{property.description}</p>
                <p className="standartbolded">Property NFT id:</p>
                <p>{property.propertyNftId}</p>
                <p className="standartbolded">Hash of Terms and Conditions:</p>
                <p>{property.hashOfRentalAgreement}</p>
                <div className="review-section">
                    <div className="title">Reviews:</div>
                    <div className="review-card">
                        <div className="author">John Doe</div>
                        <p>Some review of past tenant.</p>

                        <div className="date">May 1, 2023</div>
                    </div>
                    <div className="review-card">
                        <div className="author">Ben Hoe</div>
                        <p>Some review of past tenant.</p>

                        <div className="date">April 1, 2023</div>
                    </div>
                </div>
            </div>
            <button className="back-button" onClick={onBack}>
                Back
            </button>
        </div>
    )
}
