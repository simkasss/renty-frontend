import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import PropertyCard from "@/components/PropertyCard"
import ListPropertyCard from "@/components/ListPropertyCard"

export default function listProperty() {
    const [selectedProperty, setSelectedProperty] = useState(null)
    const [mintNftForm, setMintNftForm] = useState(false)

    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [countryCode, setCountryCode] = useState("")
    //should instead read data from blockchain
    const properties = [
        {
            id: 1,
            propertyNftId: 1,
            name: "Flat",
            imageSrc: ["https://i0.wp.com/theadroitjournal.org/wp-content/uploads/2019/11/image2.jpg?resize=648%2C364&ssl=1"],
            rentalPrice: "1200",
            availableStartDate: "06-01",
            rentalTerm: "12 months",
            depositAmount: "2000",
            numberOfRooms: "3",
            squareMeters: "80",
            description: "some flat",
            status: "Rented",
            rentContractsAccepted: "5",
            hashOfRentalAgreement: "OxSIFK334...",
        },
        {
            id: 2,
            propertyNftId: 2,
            imageSrc: [
                "https://assets-news.housing.com/news/wp-content/uploads/2021/01/27132610/Everything-you-need-to-know-about-condominiums-FB-1200x700-compressed.jpg",
            ],
            rentalPrice: "1500",
            availableStartDate: "07-01",
            depositAmount: "2000",
            numberOfRooms: "3",
            squareMeters: "80",
            description: "some flat",
            status: "Vacant",
            rentApplicationsCount: "5",
        },
    ]
    const handlePropertyClick = (property) => {
        setSelectedProperty(property)
    }
    const handleBackClick = () => {
        setSelectedProperty(null)
    }
    const handleMintNftClick = () => {
        setMintNftForm(!mintNftForm)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        // Send form data to backend
    }
    return (
        <div>
            <div>
                {selectedProperty ? (
                    <div>
                        <ListPropertyCard property={selectedProperty} onBack={handleBackClick} />
                    </div>
                ) : (
                    <div>
                        <Link href="/myproperties" className="back-button">
                            Back
                        </Link>
                        <button className="button-standart" onClick={handleMintNftClick}>
                            Mint Property NFT
                        </button>
                        {mintNftForm && (
                            <form onSubmit={handleSubmit} className="form">
                                <div className="form-field">
                                    <label>
                                        Name:
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                    </label>
                                </div>
                                <label>
                                    Address:
                                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                                </label>
                                <label>
                                    Country Code:
                                    <input type="text" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} />
                                </label>
                                <button type="submit" className="button-standart">
                                    Submit
                                </button>
                            </form>
                        )}
                        <div>After Minting an NFT a property is added to my properties list below</div>
                        <div className="properties-grid">
                            <div className="standartbolded">Select from my properties:</div>
                            {properties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    imageSrc={property.imageSrc[0]}
                                    rentalPrice={property.rentalPrice}
                                    availableStartDate={property.availableStartDate}
                                    status={property.status}
                                    onClick={() => handlePropertyClick(property)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
