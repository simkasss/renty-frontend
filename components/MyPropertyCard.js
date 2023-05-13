import React from "react"

export function MyPropertyCard({ id, rentalPrice, onClick, rentStatus }) {
    return (
        <div className="property-card" role="button" tabIndex={0} onClick={onClick}>
            {/*<img src={imageSrc} alt="Property" />*/}
            <div className="property-details">
                <div className="property-rental-price">Property Nft ID: {id}</div>
                <div className="property-rental-price">{rentalPrice} ETH/month</div>
                <div className="property-status">Status: {rentStatus ? <>Rented</> : <>Vacant</>}</div>
            </div>
        </div>
    )
}

export function MyPropertyDetails({ property, onBack }) {
    const [numberOfRooms, setNumberOfRooms] = React.useState("")
    const [area, setArea] = React.useState("")
    const [floor, setFloor] = React.useState("")
    const [buildYear, setBuildYear] = React.useState("")
    console.log(property)

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

    return (
        <div>
            <div className="property-details">
                {/* <div>
                    {property.imageSrc.map((imageSrc) => (
                        <img className="property-details-image" key={imageSrc} src={imageSrc} alt={`Property ${property.id}`} />
                    ))}
                </div> */}
                <div className="property-info">
                    <h2>{` ${property.name}`}</h2>
                    <p>{`Property Id: ${property.propertyNftId}`}</p>
                    <p>{`Status: ${property.isRented === true ? "Rented" : "Vacant"}`}</p>
                    <p>{`Rental Price: ${property.rentalPrice} ETH/month`}</p>
                    <p>{`Rental Term: ${property.rentalTerm}`}</p>
                    <p>{`Deposit Amount: ${property.depositAmount} ETH`}</p>
                    <p>{`Number of rooms: ${numberOfRooms}`}</p>
                    <p>{`Area: ${area}`}</p>
                    <p>{`Floor: ${floor}`}</p>
                    <p>{`Build Year: ${buildYear}`}</p>
                    <p>{`Description: ${property.description}`}</p>
                    <p>{`Hash of Rent Contract Terms and Conditions: ${property.hashOfRentalAggreement}`}</p>
                </div>
                <button className="back-button" onClick={onBack}>
                    Back
                </button>
            </div>
        </div>
    )
}
