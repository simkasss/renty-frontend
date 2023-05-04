import React from "react"
import { useState } from "react"
import Link from "next/link"

export function PropertyCard({ id, imageSrc, rentalPrice, availableStartDate, onClick }) {
    return (
        <>
            <Link href={`/properties/${id}`}>
                <div className="property-card" role="button" tabIndex={0} onClick={onClick}>
                    <img src={imageSrc} alt="Property" />
                    <div className="property-details">
                        <div className="property-rental-price">${rentalPrice}/month</div>
                        <div className="property-available-start-date">Available from {availableStartDate}</div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export function PropertyDetails({ property, onBack }) {
    const [applyForm, setApplyForm] = useState(false)
    const [name, setName] = useState("")
    const [startDate, setStartDate] = useState(property.startDate)
    const [rentalPrice, setRentalPrice] = useState(property.rentalPrice)
    const [depositAmount, setDepositAmount] = useState(property.depositAmount)

    const handleApplyClick = () => {
        setApplyForm(!applyForm)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // Send form data to backend
    }

    return (
        <div className="property-details">
            <button className="button-standart" onClick={handleApplyClick}>
                Apply for Rent
            </button>
            {applyForm && (
                <form onSubmit={handleSubmit} className="form">
                    <div className="form-field">
                        <label>
                            Name:
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </label>
                    </div>
                    <label>
                        Start Date:
                        <input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </label>
                    <label>
                        Rental Price:
                        <input type="text" value={rentalPrice} onChange={(e) => setRentalPrice(e.target.value)} />
                    </label>
                    <label>
                        Deposit Amount:
                        <input type="text" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                    </label>
                    <button type="submit" className="button-standart">
                        Submit
                    </button>
                </form>
            )}
            <div>
                {property.imageSrc.map((imageSrc) => (
                    <img className="property-details-image" key={imageSrc} src={imageSrc} alt={`Property ${property.id}`} />
                ))}
            </div>
            <div className="property-info">
                <h2>{`Property ${property.id}`}</h2>
                <p className="standartbolded">Rental Price </p>
                <p>${property.rentalPrice}/month</p>
                <p className="standartbolded">Deposit:</p>
                <p>{property.depositAmount}</p>
                <p className="standartbolded">Number of rooms:</p>
                <p>{property.numberOfRooms}</p>
                <p className="standartbolded">Square meters:</p>
                <p>{property.squareMeters}</p>
                <p className="standartbolded">Description:</p>
                <p>{property.description}</p>
                <p className="standartbolded">Hash of Terms and Conditions:</p>
                <p>Ox87K23JKjs</p>
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
