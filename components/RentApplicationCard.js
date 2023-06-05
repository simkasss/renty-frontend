import React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import CheckIcon from "@mui/icons-material/Check"
import networkMapping from "../constants/networkMapping.json"
import mainContractAbi from "../constants/MainContract.json"
import tenantManagerAbi from "../constants/TenantManager.json"
import { structureRentContracts } from "../utilities/structureStructs"
import { ethers } from "ethers"
import { RentHistoryCard } from "./RentHistoryCard"
import SendIcon from "@mui/icons-material/Send"
import PersonIcon from "@mui/icons-material/Person"

function convertTimestampToDate(timestampInSeconds) {
    const date = new Date(timestampInSeconds * 1000)
    const year = date.getFullYear()
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    return `${year}/${month}/${day}`
}

export function RentApplicationCard({
    rentContract,
    nowTimestampInSeconds,
    handleAcceptClick,
    showTenantRentHistory,
    setShowTenantRentHistory,
    setShowContactDetails,
    showContactDetails,
}) {
    let status
    if (rentContract.status === 0) {
        status = "Waiting"
    } else if (rentContract.status === 1) {
        status = "Confirmed"
    } else {
        status = "Canceled"
    }
    const [tenantRentHistory, setTenantRentHistory] = React.useState([])
    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")

    React.useEffect(() => {
        if (typeof window == "undefined") {
            return
        }

        async function getTenantAddress() {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const userAddress = await signer.getAddress()
            const tenantManagerAddress = networkMapping["11155111"].TenantManager[0]
            const contractAbi = tenantManagerAbi
            const contract = new ethers.Contract(tenantManagerAddress, contractAbi, signer)
            const address = await contract.getTokenOwner(rentContract.tenantSbtId)
            return address
        }

        async function getEmail(tenant) {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const email = await contract.getUserEmail(tenant)
            console.log(`Email: `, email)
            setEmail(email)
        }
        async function getPhoneNumber(tenant) {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const number = await contract.getUserPhoneNumber(tenant)
            console.log(`Phone Number: `, number)
            setPhoneNumber(number)
        }

        getTenantAddress().then((tenant) => {
            getEmail(tenant)
            getPhoneNumber(tenant)
        })
    }, [])

    async function getTenantRentHistory(tokenId) {
        if (typeof window !== "undefined") {
            try {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                const contractAbi = mainContractAbi
                const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
                const rentHistory = structureRentContracts(await contract.getTenantRentHistory(tokenId))
                console.log(rentHistory)
                setTenantRentHistory(rentHistory)
            } catch (e) {
                console.log(e)
            }
        }
    }

    return (
        <>
            <Card sx={{ maxWidth: 345, m: 2 }}>
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        Rent Application No. {rentContract.id}
                    </Typography>
                    <Typography variant="body2" color="primary">
                        Rental Price: {rentContract.rentalPrice} ETH
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
                        Tenant ID: {rentContract.tenantSbtId}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Rental Term: {rentContract.rentalTerm / 24 / 60 / 60} days
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Deposit Amount: {rentContract.depositAmount} ETH
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Start Date: {convertTimestampToDate(rentContract.startTimestamp)}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Application valid until: {convertTimestampToDate(rentContract.validityTerm)}
                    </Typography>

                    <Button
                        startIcon={<SendIcon />}
                        sx={{ mr: 1 }}
                        variant="outlined"
                        size="small"
                        onClick={() => setShowContactDetails(!showContactDetails)}
                    >
                        Tenant
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
                                    <Button variant="outlined" size="small" startIcon={<CheckIcon />} onClick={handleAcceptClick} sx={{ mr: 1 }}>
                                        Accept
                                    </Button>
                                </>
                            )}
                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<PersonIcon />}
                                onClick={() => {
                                    setShowTenantRentHistory(!showTenantRentHistory)
                                    getTenantRentHistory(rentContract.tenantSbtId)
                                }}
                            >
                                History
                            </Button>
                        </>
                    )}

                    {showTenantRentHistory ? (
                        <>
                            {tenantRentHistory.map((rentContract) => (
                                <RentHistoryCard key={rentContract.id} rentContract={rentContract} />
                            ))}
                            {tenantRentHistory.length == 0 ? (
                                <Typography variant="body2" component="div" sx={{ ml: 1, mb: 1 }}>
                                    Tenant have not rented anything yet!
                                </Typography>
                            ) : (
                                <></>
                            )}
                        </>
                    ) : (
                        <></>
                    )}
                </CardContent>
            </Card>
        </>
    )
}
