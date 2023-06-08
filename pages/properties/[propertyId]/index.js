import { useRouter } from "next/router"
import { PropertyDetails } from "@/components/PropertyDetails"
import React from "react"
import { ethers } from "ethers"
import networkMapping from "../../../constants/networkMapping.json"
import mainContractAbi from "../../../constants/MainContract.json"
import { useSelector } from "react-redux"
import { structureProperties } from "../../../utilities/structureStructs"

export default function Property() {
    const router = useRouter()
    const { propertyId: id } = router.query
    const [showContactDetails, setShowContactDetails] = React.useState(false)
    const { conversionChecked } = useSelector((states) => states.globalStates)
    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [selectedProperty, setSelectedProperty] = React.useState("")

    React.useEffect(() => {
        if (typeof window == "undefined" || id == undefined) {
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

        async function getPropertyOwner(contract, property) {
            const owner = await contract.getPropertyOwner(property.propertyNftId)
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
            setPhoneNumber(number)
        }
        async function getSelectedProperty(contract) {
            const listedProperties = structureProperties(await contract.getListedProperties())
            const selectedProperty = listedProperties.find((property) => property.propertyNftId === parseInt(id))
            setSelectedProperty(selectedProperty)
            return selectedProperty
        }

        getContract().then((contract) => {
            getSelectedProperty(contract).then((property) =>
                getPropertyOwner(contract, property).then((owner) => {
                    getEmail(owner)
                    getPhoneNumber(owner)
                })
            )
        })
    }, [id])

    if (!selectedProperty) {
        return
    }
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
