import Router from "next/router"
import React from "react"
import { MyPropertyDetails } from "@/components/MyPropertyDetails"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import Link from "next/link"
import { useSelector } from "react-redux"
import networkMapping from "../../../../constants/networkMapping.json"
import mainContractAbi from "../../../../constants/MainContract.json"
import { structureProperties } from "../../../../utilities/structureStructs"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

export default function Property() {
    const router = useRouter()
    const { propertyId: id } = router.query
    const [properties, setProperties] = React.useState([])
    const { wallet } = useSelector((states) => states.globalStates)
    const [alert, setAlert] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [conversionChecked, setConversionChecked] = React.useState(true)
    React.useEffect(() => {
        async function getUserProperties() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const userAddress = await signer.getAddress()
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                const contractAbi = mainContractAbi
                const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)

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
    const handleLinkClick = (path) => {
        router.push(path)
    }

    const handleUnlist = async () => {
        setLoading(true)
        if (typeof window !== "undefined") {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const unlinst = await contract.removePropertyFromList(id)
            await unlinst.wait()
            setAlert(true)
        }
    }
    const handleChange = () => {
        setConversionChecked(!conversionChecked)
    }

    return (
        <>
            <Stack direction="row" alignItems="center" sx={{ ml: 12, mt: 1 }}>
                <AttachMoneyIcon fontSize="small" />
                <Switch checked={conversionChecked} onClick={handleChange} />
                <Typography>ETH</Typography>
            </Stack>
            <MyPropertyDetails
                key={property.propertyNftId}
                property={property}
                wallet={wallet}
                id={id}
                handleLinkClick={handleLinkClick}
                handleUnlist={handleUnlist}
                alert={alert}
                loading={loading}
                conversionChecked={conversionChecked}
            />
        </>
    )
}
