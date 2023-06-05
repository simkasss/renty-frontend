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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import SendIcon from "@mui/icons-material/Send"
import { Payment } from "./Payment"
import { Grid } from "@mui/material"

import NotInterestedIcon from "@mui/icons-material/NotInterested"

function convertTimestampToDate(timestampInSeconds) {
    const date = new Date(timestampInSeconds * 1000)
    const year = date.getFullYear()
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    return `${year}/${month}/${day}`
}

export function RentHistoryCardLandlord({
    rentContract,
    property,
    handlePaymentHistoryClick,
    showPaymentHistory,
    showContactDetails,
    setShowContactDetails,
    email,
    phoneNumber,
    payments,
}) {
    const nowInSeconds = Math.floor(Date.now() / 1000)
    let status
    if (rentContract.status == 1) {
        status = "Current"
    } else if (rentContract.status == 0 && rentContract.propertyRentContractsAccepted !== property.rentContractsAccepted) {
        status = "Canceled"
    } else if (rentContract.status == 0) {
        status = "Waiting"
    } else if (rentContract.expiryTimestamp < nowInSeconds) {
        status = "Completed"
    }

    return (
        <>
            <Box
                component="form"
                sx={{
                    "& > :not(style)": { m: 5, width: "40ch" },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Card variant="outlined">
                    <React.Fragment>
                        <CardContent>
                            <Typography variant="h6" component="div" color="primary">
                                Rent Contract No. {rentContract.id}
                            </Typography>
                            <br />
                            <TableContainer component={Paper} sx={{ maxWidth: 500 }}>
                                <Table sx={{ maxWidth: 500 }} aria-label="simple table">
                                    <TableBody>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Property ID
                                            </TableCell>
                                            <TableCell align="left">{property.propertyNftId}</TableCell>
                                        </TableRow>
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
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Status
                                            </TableCell>
                                            <TableCell align="left">{status}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {property.hashOfRentalAgreement ? (
                                <Button
                                    sx={{ mt: 1 }}
                                    variant="outlined"
                                    size="small"
                                    target="_blank"
                                    href={`https://gateway.pinata.cloud/ipfs/${property.hashOfRentalAgreement}`}
                                >
                                    Rent Contract Terms and Conditions (PDF)
                                </Button>
                            ) : (
                                <></>
                            )}

                            <br />
                            <Button
                                startIcon={<SendIcon />}
                                sx={{ mr: 1, mt: 1 }}
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
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handlePaymentHistoryClick}
                                        startIcon={<AttachMoneyIcon />}
                                        sx={{ mt: 1 }}
                                    >
                                        Payment History
                                    </Button>
                                </>
                            )}

                            {showPaymentHistory ? (
                                <>
                                    <Typography variant="body1" component="div" sx={{ mt: 1, mb: 1 }}>
                                        Rent Contract Payments:
                                    </Typography>
                                    <Grid container spacing={{ xs: 4, md: 4 }} columns={{ xs: 4, sm: 8, md: 10 }}>
                                        {payments.map((payment) => (
                                            <Grid item xs={2} sm={5} md={8}>
                                                <Payment key={payment.id} payment={payment} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                    {payments.length == 0 ? (
                                        <Typography variant="body2" component="div" color="primary" sx={{ mt: 4, mb: 4 }}>
                                            This contract do not have payments yet!
                                        </Typography>
                                    ) : (
                                        <></>
                                    )}
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
