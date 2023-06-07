import { useRouter } from "next/router"
import Router from "next/router"
import { PropertyDetails } from "@/components/PropertyDetails"
import { getListedProperties } from "@/constants/blockchain"
import React from "react"
import { ethers } from "ethers"
import networkMapping from "../../../constants/networkMapping.json"
import mainContractAbi from "../../../constants/MainContract.json"
import { useSelector } from "react-redux"

export default function Property({ listedProperties }) {
    const router = useRouter()
    const { propertyId: id } = router.query
    const [showContactDetails, setShowContactDetails] = React.useState(false)
    const { conversionChecked } = useSelector((states) => states.globalStates)

    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    // Find the selected property from the properties array using the id parameter.
    const selectedProperty = listedProperties.find((property) => property.propertyNftId === parseInt(id))
    console.log(selectedProperty)
    // If the selected property is not found, show a message.
    if (!selectedProperty) {
        return <div>Property not found</div>
    }
    React.useEffect(() => {
        if (typeof window == "undefined") {
            return
        }
        async function getContract() {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const userAddress = await signer.getAddress()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            return contract
        }

        async function getPropertyOwner(contract) {
            const owner = await contract.getPropertyOwner(selectedProperty.propertyNftId)
            return owner
        }
        async function getEmail(owner) {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const userAddress = await signer.getAddress()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const email = await contract.getUserEmail(owner)
            console.log(`Email: `, email)
            setEmail(email)
        }
        async function getPhoneNumber(owner) {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const userAddress = await signer.getAddress()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const number = await contract.getUserPhoneNumber(owner)
            console.log(`Phone Number: `, number)
            setPhoneNumber(number)
        }
        getContract().then((contract) => {
            getPropertyOwner(contract).then((owner) => {
                getEmail(owner)
                getPhoneNumber(owner)
            })
        })
    }, [])

    return (
        <>
            <PropertyDetails
                property={selectedProperty}
                setShowContactDetails={setShowContactDetails}
                showContactDetails={showContactDetails}
                email={email}
                phoneNumber={phoneNumber}
                conversionChecked={conversionChecked}
            />
        </>
    )
}

export const getServerSideProps = async () => {
    const data2 = await getListedProperties()
    return {
        props: { listedProperties: JSON.parse(JSON.stringify(data2)) },
    }
}
