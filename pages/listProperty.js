import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/router"
import PropertyCard from "@/components/PropertyCard"
import ListPropertyCard from "@/components/ListPropertyCard"
import { getUserProperties } from "@/constants/blockchain"

export default function listProperty({ userProperties }) {
    const [selectedProperty, setSelectedProperty] = useState(null)
    const [mintNftForm, setMintNftForm] = useState(false)

    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [countryCode, setCountryCode] = useState("")
    //should instead read data from blockchain
    const properties = userProperties

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
                            {/* {properties.map((property) => (
                                <PropertyCard
                                    key={property.propertyNftId}
                                    id={property.propertyNftId}
                                    rentalPrice={property.rentalPrice}
                                    rentalTerm={property.rentalTerm}
                                    onClick={() => handlePropertyClick(property)}
                                />
                            ))} */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
export const getServerSideProps = async () => {
    const data = await getUserProperties()
    if (data == null) {
        console.log("getUserProperties returned null or undefined")
        return { props: {} }
    }
    return {
        props: { userProperties: JSON.parse(JSON.stringify(data)) },
    }
}
