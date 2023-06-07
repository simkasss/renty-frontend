import React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import SendIcon from "@mui/icons-material/Send"
import { ethers } from "ethers"
import networkMapping from "../constants/networkMapping.json"
import mainContractAbi from "../constants/MainContract.json"

function convertTimestampToDate(timestampInSeconds) {
    const date = new Date(timestampInSeconds * 1000)
    const year = date.getFullYear()
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    return `${year}/${month}/${day}`
}

export function RentHistoryCard({ rentContract }) {
    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [showContactDetails, setShowContactDetails] = React.useState(false)
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
        getContract().then((contract) => {
            getPropertyOwner(contract).then((owner) => {
                getEmail(owner)
                getPhoneNumber(owner)
            })
        })
    }, [])

    return (
        <>
            <Box
                component="form"
                sx={{
                    "& > :not(style)": { m: 1, width: "50ch" },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Card variant="outlined">
                    <React.Fragment>
                        <CardContent>
                            <Typography variant="body1" component="div" color="primary">
                                Rent Contract No. {rentContract.id}
                            </Typography>
                            <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
                                <Table sx={{ maxWidth: 500 }} aria-label="simple table">
                                    <TableBody>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Rental Price
                                            </TableCell>
                                            <TableCell align="left">{rentContract.rentalPrice} ETH/month</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Deposit Amount
                                            </TableCell>
                                            <TableCell align="left">{rentContract.depositAmount} ETH</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Rental Term
                                            </TableCell>
                                            <TableCell align="left">{rentContract.rentalTerm / 60 / 60 / 24} days</TableCell>
                                        </TableRow>

                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Start Date
                                            </TableCell>
                                            <TableCell align="left">{convertTimestampToDate(rentContract.startTimestamp)}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Expiration Date
                                            </TableCell>
                                            <TableCell align="left">{convertTimestampToDate(rentContract.expiryTimestamp)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Button
                                startIcon={<SendIcon />}
                                sx={{ mr: 1, mt: 1 }}
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
                                <></>
                            )}
                        </CardContent>
                    </React.Fragment>
                </Card>
            </Box>
        </>
    )
}
