import Head from "next/head"
import React from "react"
import { ListedPropertyCard } from "@/components/ListedPropertyCard"
import { ListedPropertyDetails } from "@/components/ListedPropertyCard"
import Link from "next/link"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import networkMapping from "../../constants/networkMapping.json"
import rentAppAbi from "../../constants/RentApp.json"
import { structureProperties } from "../../utilities/structureProperties"

export default function Property() {
    const [properties, setProperties] = React.useState([])
    const [selectedProperty, setSelectedProperty] = React.useState(null)
    let userProperties
    React.useEffect(() => {
        async function getUserProperties() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const userAddress = await signer.getAddress()
                const rentAppAddress = networkMapping["11155111"].RentApp[0]
                const contractAbi = rentAppAbi
                const contract = new ethers.Contract(rentAppAddress, contractAbi, provider)

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

    const router = useRouter()
    const handlePropertyClick = (property) => {
        setSelectedProperty(property)
        router.push(`${wallet}/properties/${property.propertyNftId}`)
    }

    return (
        <div>
            <Head>
                <title>My Properties</title>
            </Head>
            <div>
                <div>
                    {selectedProperty ? (
                        selectedProperty.status == "Vacant" ? (
                            <div>
                                <ListedPropertyDetails property={selectedProperty} onBack={handleBackClick} />
                            </div>
                        ) : (
                            <div>
                                <ListedPropertyDetails property={selectedProperty} onBack={handleBackClick} />
                                <RentContract property={selectedProperty} onBack={handleBackClick} />
                            </div>
                        )
                    ) : (
                        <div>
                            After signing up, this page will allow registered property owners to request for property’s NFT and list a property (when
                            NFT is minted). The page will show owners listings (rented and not rented). After selecting a listing an owner can check
                            rental history and if the property is not rented an owner can screen tenants and sign rental agreements, if the property
                            is rented an owner will se rental agreement page.
                            <Link href="/listProperty" className="button-standart">
                                List property for rent
                            </Link>
                            <button className="button-standart">Not Listed Properties</button>
                            <div className="properties-grid">
                                <div className="standartbolded">Properties listed for rent:</div>
                                {properties
                                    .filter((property) => property.isListed)
                                    .map((property) => (
                                        <ListedPropertyCard
                                            key={property.propertyNftId}
                                            id={property.propertyNftId}
                                            //imageSrc={property.imageSrc[0]}
                                            rentalPrice={property.rentalPrice}
                                            //availableStartDate={property.availableStartDate}
                                            status={property.status}
                                            onClick={() => handlePropertyClick(property)}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
