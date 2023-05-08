import React from "react"

export function ListedPropertyCard({ imageSrc, id, rentalPrice, availableStartDate, onClick, status }) {
    return (
        <div className="property-card" role="button" tabIndex={0} onClick={onClick}>
            {/*<img src={imageSrc} alt="Property" />*/}
            <div className="property-details">
                <div className="property-rental-price">Property Nft ID: {id}</div>
                <div className="property-rental-price">${rentalPrice} ETH/month</div>
                <div className="property-available-start-date">Available from {availableStartDate}</div>
                <div className="property-status">{status}</div>
            </div>
        </div>
    )
}

export function ListedPropertyDetails({ property, onBack }) {
    return (
        <div>
            <button className="button-standart">Screen Rent Applications</button>
            <button className="button-standart">Rent History</button>
            <div className="property-details">
                <div>
                    {property.imageSrc.map((imageSrc) => (
                        <img className="property-details-image" key={imageSrc} src={imageSrc} alt={`Property ${property.id}`} />
                    ))}
                </div>
                <div className="property-info">
                    <h2>{`Property ${property.id}`}</h2>

                    <p>{`Rental Price: ${property.rentalPrice}/month`}</p>
                    <p>{`Deposit: ${property.depositAmount}`}</p>
                    <p>{`Number of rooms: ${property.numberOfRooms}`}</p>
                    <p>{`Square meters: ${property.squareMeters}`}</p>
                    <p>{`Description: ${property.description}`}</p>
                </div>
                <button className="back-button" onClick={onBack}>
                    Back
                </button>
            </div>
        </div>
    )
}
