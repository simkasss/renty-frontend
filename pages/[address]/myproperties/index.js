import React from "react"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import networkMapping from "../../../constants/networkMapping.json"
import mainContractAbi from "../../../constants/MainContract.json"
import { structureProperties } from "../../../utilities/structureStructs"
import { useSelector } from "react-redux"
import MyProperties from "../../../components/MyProperties"

export default function MyPropertiesPage() {
    const [properties, setProperties] = React.useState([])
    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const { wallet } = useSelector((states) => states.globalStates)
    const { conversionChecked } = useSelector((states) => states.globalStates)

    React.useEffect(() => {
        if (typeof window == "undefined") {
            return
        }
        async function getUserProperties() {
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
        async function getUserEmail() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const userAddress = await signer.getAddress()
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                const contractAbi = mainContractAbi
                const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
                const email = await contract.getUserEmail(userAddress)
                setEmail(email)
            }
        }
        async function getUserPhoneNumber() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const userAddress = await signer.getAddress()
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                const contractAbi = mainContractAbi
                const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
                const number = await contract.getUserPhoneNumber(userAddress)
                setPhoneNumber(number)
            }
        }

        getUserProperties().then((properties) => {
            setProperties(properties)
        })
        getUserEmail()
        getUserPhoneNumber()
    }, [wallet])
    const router = useRouter()
    const handlePropertyClick = (property) => {
        router.push(`/${wallet}/myproperties/${property.propertyNftId}`)
    }
    const handleLinkClick = (path) => {
        router.push(path)
    }

    return (
        <MyProperties
            properties={properties}
            handlePropertyClick={handlePropertyClick}
            wallet={wallet}
            conversionChecked={conversionChecked}
            handleLinkClick={handleLinkClick}
            email={email}
            phoneNumber={phoneNumber}
        />
    )
}
