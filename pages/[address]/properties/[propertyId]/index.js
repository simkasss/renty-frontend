import Router from "next/router"
import React from "react"
import { MyPropertyDetails } from "@/components/MyPropertyCard"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import Link from "next/link"
import { useSelector } from "react-redux"
import networkMapping from "../../../../constants/networkMapping.json"
import mainContractAbi from "../../../../constants/MainContract.json"
import { structureProperties } from "../../../../utilities/structureStructs"

export default function Property() {
    const router = useRouter()
    const { propertyId: id } = router.query
    const [properties, setProperties] = React.useState([])
    const { wallet } = useSelector((states) => states.globalStates)

    React.useEffect(() => {
        async function getUserProperties() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const userAddress = await signer.getAddress()
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                const contractAbi = mainContractAbi
                const contract = new ethers.Contract(mainContractAddress, contractAbi, provider)

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
    const property = properties.find((property) => property.propertyNftId === parseInt(id))
    if (!property) {
        return <div>Property not found</div>
    }
    console.log(property)

    return (
        <>
            <Link className="button-standart" href={`/${wallet}/properties/${id}/rent-history`}>
                Rent History
            </Link>
            {!property.isListed ? (
                <Link className="button-standart" href={`/${wallet}/properties/${id}/list`}>
                    List property
                </Link>
            ) : (
                <Link className="button-standart" href={`/${wallet}/properties/${id}/rent-applications`}>
                    Screen Rent Applications
                </Link>
            )}
            {property.isRented ? (
                <Link className="button-standart" href={`/${wallet}/properties/${id}/rent-contract`}>
                    Current Rent Contract
                </Link>
            ) : (
                <></>
            )}
            <MyPropertyDetails key={property.propertyNftId} property={property} />
        </>
    )
}
