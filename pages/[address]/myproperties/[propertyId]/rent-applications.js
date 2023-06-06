import { ethers } from "ethers"
import React from "react"
import Head from "next/head"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import networkMapping from "../../../../constants/networkMapping.json"
import mainContractAbi from "../../../../constants/MainContract.json"
import { structureRentContracts, structureProperties } from "../../../../utilities/structureStructs"
import { RentApplicationCard } from "../../../../components/RentApplicationCard"
import Alert from "@mui/material/Alert"
import CheckIcon from "@mui/icons-material/Check"
import CircularProgress from "@mui/material/CircularProgress"
import Grid from "@mui/material/Grid"

export default function PropertyRentApplications() {
    const router = useRouter()

    const { propertyId } = router.query
    const { wallet } = useSelector((states) => states.globalStates)

    const [rentContracts, setRentContracts] = React.useState([])
    const [propertyListed, setPropertyListed] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [alert, setAlert] = React.useState(false)
    const [conversionChecked, setConversionChecked] = React.useState(true)

    React.useEffect(() => {
        if (typeof window == "undefined") {
            return
        }
        if (propertyId === undefined) {
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

        async function getPropertyRentApplications(contract) {
            const propertyRentContracts = structureRentContracts(await contract.getPropertyRentContracts(propertyId))
            console.log("propertyRentContracts: ", propertyRentContracts)
            return propertyRentContracts
        }
        async function getProperty(contract) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const userAddress = await signer.getAddress()
            const [listedPropertiesResponse, userPropertiesResponse] = await Promise.all([
                contract.getListedProperties(),
                contract.getUserProperties(userAddress),
            ])
            console.log("first", listedPropertiesResponse, userPropertiesResponse)
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

        getContract().then((contract) => {
            getPropertyRentApplications(contract).then((contracts) => {
                setRentContracts(contracts)
                console.log(contracts)
            })
            getProperty(contract).then((property) => {
                setPropertyListed(property.isListed)
            })
        })
    }, [propertyId])

    const acceptContract = async (rentContract) => {
        console.log(rentContract)
        if (typeof window !== "undefined") {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            console.log(rentContract)
            const accept = await contract.acceptRentContract(rentContract.propertyNftId, rentContract.id)
            await accept.wait()
            setAlert(true)
            router.push(`/${wallet}/myproperties/${propertyId}/rent-contract`)
        }
    }

    const handleAcceptClick = async (rentContract) => {
        setLoading(true)
        await acceptContract(rentContract)
        console.log("Contract ", rentContract.id, " accepted!")
    }
    const nowTimestampInSeconds = Math.floor(Date.now() / 1000)

    return (
        <div>
            <Head>
                <title>Rent Applications</title>
            </Head>

            {propertyListed == true ? (
                <>
                    {rentContracts.filter((contract) => contract.status == 0).length == 0 ? (
                        <Typography gutterBottom variant="h6" component="div" color="primary" sx={{ m: 2 }}>
                            {" "}
                            This property do not have rent applications yet!
                        </Typography>
                    ) : (
                        <></>
                    )}
                    {!alert ? (
                        <>{loading ? <CircularProgress size="2rem" sx={{ ml: 2, mt: 2 }} /> : <></>}</>
                    ) : (
                        <Alert sx={{ ml: 2, mt: 2 }} icon={<CheckIcon fontSize="inherit" />}>
                            Rent Contract is signed!
                        </Alert>
                    )}

                    <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 4, sm: 8, md: 16 }}>
                        {rentContracts
                            .filter((contract) => contract.status == 0)
                            .map((contract) => (
                                <>
                                    <Grid item xs={2} sm={4} md={4}>
                                        <RentApplicationCard
                                            rentContract={contract}
                                            handleAcceptClick={() => handleAcceptClick(contract)}
                                            nowTimestampInSeconds={nowTimestampInSeconds}
                                        />
                                    </Grid>
                                </>
                            ))}
                    </Grid>
                </>
            ) : (
                <Typography gutterBottom variant="h6" component="div" sx={{ m: 1 }}>
                    This property is not listed!
                </Typography>
            )}
        </div>
    )
}
