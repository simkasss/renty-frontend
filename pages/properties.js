import Head from "next/head"
import React from "react"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import { PropertyCard } from "../components/PropertyCard"
import { useSelector } from "react-redux"
import { structureProperties } from "../utilities/structureStructs"
import networkMapping from "../constants/networkMapping.json"
import mainContractAbi from "../constants/MainContract.json"
import Card from "@mui/material/Card"
import Button from "@mui/material/Button"
import { store } from "../store"
import { globalActions } from "../store/globalSlices"

const connectWallet = async () => {
    const { setWallet } = globalActions

    try {
        if (!ethereum) return reportError("Please install Metamask")
        const accounts = await ethereum.request({ method: "eth_requestAccounts" })
        store.dispatch(setWallet(accounts[0]))
    } catch (error) {
        reportError(error)
    }
}

export default function ListedProperties() {
    const [listedProperties, setListedProperties] = React.useState([])
    const { conversionChecked } = useSelector((states) => states.globalStates)
    const { wallet } = useSelector((states) => states.globalStates)

    const router = useRouter()

    React.useEffect(() => {
        if (typeof window === "undefined" || !wallet) {
            return
        }
        console.log("wallet: ", wallet)
        const getListedProperties = async () => {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contract = new ethers.Contract(mainContractAddress, mainContractAbi, signer)
            const listedProperties = structureProperties(await contract.getListedProperties())
            return listedProperties
        }

        getListedProperties().then((properties) => {
            setListedProperties(properties)
        })
    }, [wallet])

    const handlePropertyClick = (property) => {
        router.push(`/properties/${property.propertyNftId}`)
    }

    return (
        <div>
            <Head>
                <title>Listed Properties</title>
            </Head>
            {!wallet ? (
                <Card variant="outlined" align="center" sx={{ ml: 2, mt: 2, mr: 2 }}>
                    <Button onClick={connectWallet}>Please connect with your Metamask wallet</Button>
                </Card>
            ) : (
                <></>
            )}
            <div className="container mx-auto px-4 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {listedProperties.map((property) => (
                        <PropertyCard
                            key={property.propertyNftId}
                            name={property.name}
                            id={property.propertyNftId}
                            rentalPrice={property.rentalPrice}
                            rentalTerm={property.rentalTerm}
                            hashesOfPhotos={property.hashesOfPhotos}
                            hashOfMetaData={property.hashOfMetaData}
                            conversionChecked={conversionChecked}
                            onClick={() => handlePropertyClick(property)}
                        />
                    ))}
                </div>
                <div className="flex justify-center mt-4"></div>
            </div>
        </div>
    )
}
