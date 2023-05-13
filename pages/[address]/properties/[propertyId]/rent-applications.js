import Link from "next/link"
import { ethers } from "ethers"
import React from "react"
import { useRouter } from "next/router"
import networkMapping from "../../../../constants/networkMapping.json"
import rentAppAbi from "../../../../constants/RentApp.json"
import { useSelector } from "react-redux"
import { structureRentContracts, structureProperties } from "../../../../utilities/structureStructs"
import { RentContractApplicationCard } from "../../../../components/RentContractApplicationCard"

export default function PropertyRentApplications() {
    const [rentContracts, setRentContracts] = React.useState([])
    const [propertyListed, setPropertyListed] = React.useState(false)
    const router = useRouter()
    const { propertyId } = router.query
    const { wallet } = useSelector((states) => states.globalStates)

    React.useEffect(() => {
        async function getPropertyRentApplications() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const rentAppAddress = networkMapping["11155111"].RentApp[0]
                const contractAbi = rentAppAbi
                const contract = new ethers.Contract(rentAppAddress, contractAbi, signer)
                const propertyRentContracts = structureRentContracts(await contract.getPropertyRentContracts(propertyId))
                return propertyRentContracts
            }
        }
        async function getProperty() {
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

                const properties = userProperties.filter((property) => property.propertyNftId == propertyId)
                const property = properties[0]

                console.log(property)
                return property
            }
        }

        getProperty().then((property) => {
            setPropertyListed(property.isListed)
        })

        getPropertyRentApplications().then((contracts) => {
            setRentContracts(contracts)
            console.log(contracts)
        })
    }, [])

    return (
        <div>
            {propertyListed == true ? (
                <>
                    {rentContracts.length == 0 ? <>There are no rent applications yet</> : <></>}
                    {rentContracts.map((contract) => (
                        <>
                            <RentContractApplicationCard key={contract.id} rentContract={contract} />
                        </>
                    ))}
                </>
            ) : (
                <>This property is not listed!</>
            )}
        </div>
    )
}
