import React from "react"
import { ethers } from "ethers"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Alert from "@mui/material/Alert"
import CheckIcon from "@mui/icons-material/Check"
import CircularProgress from "@mui/material/CircularProgress"
import SendIcon from "@mui/icons-material/Send"
import networkMapping from "../constants/networkMapping.json"
import mainContractAbi from "../constants/MainContract.json"
import { structureProperty } from "../utilities/structureStructs"

function convertTimestampToDate(timestampInSeconds) {
    const date = new Date(timestampInSeconds * 1000)
    const year = date.getFullYear()
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    return `${year}/${month}/${day}`
}

export function RentApplicationCardTenant({ rentContract, nowTimestampInSeconds, handleCancelClick, alert, loading, conversionChecked }) {
    let status
    if (rentContract.status === 0) {
        status = "Waiting"
    } else if (rentContract.status === 1) {
        status = "Confirmed"
    } else {
        status = "Canceled"
    }

    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [showContactDetails, setShowContactDetails] = React.useState(false)
    const [property, setProperty] = React.useState("")
    const [rentalPriceInUsd, setRentalPriceInUsd] = React.useState("")
    const [depositInUsd, setDepositInUsd] = React.useState("")

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
            const owner = await contract.getPropertyOwner(rentContract.propertyNftId)
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
        async function getProperty() {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const property = structureProperty(await contract.getProperty(rentContract.propertyNftId))
            return property
        }
        async function getWEIAmountInUSD(ethAmount) {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                const contractAbi = mainContractAbi
                const contract = new ethers.Contract(mainContractAddress, contractAbi, provider)
                const amountInWei = ethers.BigNumber.from(ethers.utils.parseUnits(ethAmount, 18))
                const amountInUsd = await contract.getWEIAmountInUSD(amountInWei)
                return amountInUsd
            }
        }

        console.log("conversionchecked", conversionChecked)

        getContract().then((contract) => {
            getPropertyOwner(contract).then((owner) => {
                getEmail(owner)
                getPhoneNumber(owner)
            })
        })
        getWEIAmountInUSD(rentContract.rentalPrice).then((amountInUsd) => setRentalPriceInUsd(amountInUsd))
        getWEIAmountInUSD(rentContract.depositAmount).then((amountInUsd) => setDepositInUsd(amountInUsd))

        getProperty().then((property) => {
            setProperty(property)
        })
    }, [])
    console.log("conversionchecked", conversionChecked)
    return (
        <>
            <Card sx={{ maxWidth: 345, m: 2 }}>
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        Rent Application No. {rentContract.id}
                    </Typography>
                    <Typography variant="body2" color="primary">
                        Rental Price: {conversionChecked ? `${property.rentalPrice} ETH/month` : `${rentalPriceInUsd} USD/month`}
                    </Typography>
                    {rentContract.validityTerm < nowTimestampInSeconds ? (
                        <Typography variant="body2" color="primary">
                            Status: Application is expired
                        </Typography>
                    ) : (
                        <Typography variant="body2" color="primary">
                            Status: {status}
                        </Typography>
                    )}
                    <Typography variant="body2" component="div" color="text.secondary">
                        Property ID: {rentContract.propertyNftId}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Rental Term: {rentContract.rentalTerm / 24 / 60 / 60} days
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Deposit Amount:
                        {conversionChecked ? ` ${rentContract.depositAmount} ETH` : ` ${depositInUsd} USD`}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Start Date: {convertTimestampToDate(rentContract.startTimestamp)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Application valid until: {convertTimestampToDate(rentContract.validityTerm)}
                    </Typography>

                    {property.hashOfRentalAgreement ? (
                        <Button
                            size="small"
                            variant="outlined"
                            target="_blank"
                            sx={{ mt: 1 }}
                            href={`https://gateway.pinata.cloud/ipfs/${property.hashOfRentalAgreement}`}
                        >
                            Terms and Conditions (PDF)
                        </Button>
                    ) : (
                        <></>
                    )}
                    <Button
                        startIcon={<SendIcon />}
                        sx={{ mt: 1, mr: 1 }}
                        variant="outlined"
                        size="small"
                        onClick={() => setShowContactDetails(!showContactDetails)}
                    >
                        Landlord
                    </Button>

                    {showContactDetails ? (
                        <>
                            <Typography variant="body1" component="div" color="primary" sx={{ mt: 1 }}>
                                Contact Details:
                            </Typography>
                            <Typography component="div" variant="body2">
                                {email}
                            </Typography>
                            <Typography variant="body2" component="div">
                                {phoneNumber}
                            </Typography>
                        </>
                    ) : (
                        <>
                            {rentContract.validityTerm < nowTimestampInSeconds ? (
                                <></>
                            ) : (
                                <>
                                    {!alert && status === "Waiting" ? (
                                        <>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleCancelClick(rentContract.propertyNftId, rentContract.id)}
                                                sx={{ mt: 1 }}
                                            >
                                                Cancel
                                            </Button>
                                            {loading ? <CircularProgress size="2rem" /> : <></>}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {alert && status == "Canceled" ? (
                                        <Alert icon={<CheckIcon fontSize="inherit" />}>Application is canceled!</Alert>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </>
    )
}
