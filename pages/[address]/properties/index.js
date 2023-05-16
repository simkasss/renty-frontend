import Head from "next/head"
import React from "react"
import { MyPropertyCard } from "@/components/MyPropertyCard"
import Link from "next/link"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import networkMapping from "../../../constants/networkMapping.json"
import rentAppAbi from "../../../constants/RentApp.json"
import { structureProperties } from "../../../utilities/structureStructs"
import { useSelector } from "react-redux"

export default function Property() {
    const [properties, setProperties] = React.useState([])

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
            console.log(properties)
        })
    }, [])
    const { wallet } = useSelector((states) => states.globalStates)
    const router = useRouter()
    const handlePropertyClick = (property) => {
        router.push(`/${wallet}/properties/${property.propertyNftId}`)
    }

    return (
        <div>
            <Head>
                <title>My Properties</title>
            </Head>
            <div>
                <div>
                    <div>
                        <Link
                            href={`/${wallet}/create`}
                            className="bg-violet-900 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded max-w-xs"
                        >
                            Create Property
                        </Link>
                        {properties.length == 0 ? <div>You haven't create any property yet</div> : <></>}
                        <div className="properties-grid">
                            <div className="standartbolded">Listed properties:</div>
                            {properties
                                .filter((property) => property.isListed)
                                .map((property) => (
                                    <MyPropertyCard
                                        key={property.propertyNftId}
                                        id={property.propertyNftId}
                                        //imageSrc={property.imageSrc[0]}
                                        rentalPrice={property.rentalPrice}
                                        rentStatus={property.isRented}
                                        onClick={() => handlePropertyClick(property)}
                                    />
                                ))}
                        </div>
                        <div className="properties-grid">
                            <div className="standartbolded">Not listed properties:</div>
                            {properties
                                .filter((property) => !property.isListed)
                                .map((property) => (
                                    <MyPropertyCard
                                        key={property.propertyNftId}
                                        id={property.propertyNftId}
                                        //imageSrc={property.imageSrc[0]}
                                        rentalPrice={property.rentalPrice}
                                        rentStatus={property.isRented}
                                        onClick={() => handlePropertyClick(property)}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
