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
import Head from "next/head"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import AnnouncementIcon from "@mui/icons-material/Announcement"
import NotInterestedIcon from "@mui/icons-material/NotInterested"
import TextField from "@mui/material/TextField"
import Alert from "@mui/material/Alert"
import CheckIcon from "@mui/icons-material/Check"
import CircularProgress from "@mui/material/CircularProgress"
import { Dispute } from "./Dispute"
import { Payment } from "./Payment"
import Grid from "@mui/material/Grid"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import SendIcon from "@mui/icons-material/Send"
import { getWEIAmountInUSD } from "../utilities/currencyConversion"

function convertTimestampToDate(timestampInSeconds) {
    const date = new Date(timestampInSeconds * 1000)
    const year = date.getFullYear()
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    return `${year}/${month}/${day}`
}

export function RentContractCardLandlord({
    rentContract,
    property,
    handlePaymentHistoryClick,
    payments,
    showPaymentHistory,
    showDisputes,
    handleShowDisputes,
    disputeDescription,
    setDisputeDescription,
    alert,
    loading,
    handleCreateDisputeSubmit,
    disputes,
    solveDispute,
    solvedLoading,
    solvedAlert,
    showContactDetails,
    setShowContactDetails,
    email,
    phoneNumber,
    terminateRentContract,
    terminateAlert,
    terminateLoading,
    depositAlert,
    depositLoading,
    depositReleasePermission,
    allowDepositRelease,
    depositTransfered,
    totalRentPaid,
    totalRequiredRentAmount,

    conversionChecked,
}) {
    const nowTimestampInSeconds = Math.floor(Date.now() / 1000)
    let status
    if (rentContract.status == 1) {
        status = "Current"
    } else if (rentContract.status == 0 && rentContract.propertyRentContractsAccepted !== property.rentContractsAccepted) {
        status = "Canceled"
    } else if (rentContract.status == 0) {
        status = "Waiting"
    } else if (rentContract.expiryTimestamp < nowTimestampInSeconds) {
        status = "Completed"
    }
    const [rentalPriceInUsd, setRentalPriceInUsd] = React.useState("")
    const [depositInUsd, setDepositInUsd] = React.useState("")
    const [transferedDepositInUsd, setTransferedDepositInUsd] = React.useState("")
    const [totalRentPaidInUsd, setTotalRentPaidInUsd] = React.useState("")
    const [totalRequiredInUsd, setTotalRequiredInUsd] = React.useState("")

    React.useEffect(() => {
        if (!rentContract) {
            return
        }
        async function currencyConversion(ethAmount) {
            const usd = await getWEIAmountInUSD(ethAmount)
            return usd
        }
        currencyConversion(rentContract.rentalPrice).then((usd) => setRentalPriceInUsd(usd))
        currencyConversion(rentContract.depositAmount).then((usd) => setDepositInUsd(usd))
        currencyConversion(depositTransfered.toString()).then((usd) => setTransferedDepositInUsd(usd))
        currencyConversion(totalRentPaid.toString()).then((usd) => setTotalRentPaidInUsd(usd))
        if (totalRequiredRentAmount > 0) {
            currencyConversion(totalRequiredRentAmount.toString()).then((usd) => setTotalRequiredInUsd(usd))
        }
    }, [rentContract, depositTransfered, totalRentPaid, totalRequiredRentAmount])
    return (
        <>
            <Head>
                <title>Rent Contract</title>
            </Head>

            <Box
                component="form"
                sx={{
                    "& > :not(style)": { m: 5, width: "100ch" },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Card variant="outlined">
                    <React.Fragment>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Rent Contract No. {rentContract.id}
                            </Typography>

                            <br />

                            <Typography variant="inherit" component="div" color="primary">
                                {conversionChecked ? `${rentalPriceInUsd} USD/month` : `${rentContract.rentalPrice} ETH/month`}
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
                                                Tenant ID
                                            </TableCell>
                                            <TableCell align="left">{rentContract.tenantSbtId}</TableCell>
                                        </TableRow>

                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Rental Term
                                            </TableCell>
                                            <TableCell align="left">{rentContract.rentalTerm / 60 / 60 / 24} days</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Deposit Amount
                                            </TableCell>
                                            <TableCell align="left">
                                                {conversionChecked ? `${depositInUsd} USD` : `${rentContract.depositAmount} ETH`}
                                            </TableCell>
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
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Transfered Deposit
                                            </TableCell>
                                            <TableCell align="left">
                                                {conversionChecked ? `${transferedDepositInUsd} USD` : `${depositTransfered} ETH`}

                                                {depositTransfered < rentContract.depositAmount ? (
                                                    <ErrorOutlineIcon color="error" sx={{ ml: 1 }} />
                                                ) : (
                                                    <CheckIcon color="success" sx={{ ml: 1 }} />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Total Paid Rent
                                            </TableCell>
                                            <TableCell align="left">
                                                {conversionChecked ? `${totalRentPaidInUsd} USD` : `${totalRentPaid} ETH`}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Total Required Rent Amount
                                            </TableCell>
                                            <TableCell align="left">
                                                {totalRequiredRentAmount < 0
                                                    ? "0"
                                                    : conversionChecked
                                                    ? `${totalRequiredInUsd} USD`
                                                    : `${totalRequiredRentAmount} ETH`}
                                                {totalRequiredRentAmount > totalRentPaid ? (
                                                    <ErrorOutlineIcon color="error" sx={{ ml: 1 }} />
                                                ) : (
                                                    <CheckIcon color="success" sx={{ ml: 1 }} />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {property.hashOfRentalAgreement ? (
                                <Button
                                    sx={{ mt: 1, mb: 2 }}
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
                                sx={{ mr: 1 }}
                                variant="outlined"
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
                                    <Button variant="outlined" onClick={handlePaymentHistoryClick} endIcon={<AttachMoneyIcon />} sx={{ mr: 1 }}>
                                        Payment History
                                    </Button>
                                    <Button variant="outlined" endIcon={<AnnouncementIcon />} sx={{ mr: 1 }} onClick={() => handleShowDisputes()}>
                                        Disputes
                                    </Button>
                                    {!depositReleasePermission && rentContract.expiryTimestamp < nowTimestampInSeconds ? (
                                        <Button variant="outlined" endIcon={<AttachMoneyIcon />} sx={{ mr: 1 }} onClick={allowDepositRelease}>
                                            Allow Deposit Release
                                        </Button>
                                    ) : (
                                        ""
                                    )}

                                    {!terminateAlert && rentContract.status == 1 ? (
                                        <>
                                            <Button variant="outlined" endIcon={<NotInterestedIcon />} sx={{ mr: 1 }} onClick={terminateRentContract}>
                                                Terminate Rent Contract
                                            </Button>
                                            {terminateLoading ? <CircularProgress size="1rem" sx={{ ml: 1 }} /> : <></>}
                                        </>
                                    ) : (
                                        <Alert icon={<CheckIcon fontSize="inherit" />}>Contract is terminated!</Alert>
                                    )}
                                    {depositAlert ? (
                                        <Alert icon={<CheckIcon fontSize="inherit" />}>Deposit release is allowed!</Alert>
                                    ) : depositLoading ? (
                                        <CircularProgress size="2rem" />
                                    ) : (
                                        <></>
                                    )}
                                    {showPaymentHistory ? (
                                        <>
                                            <Typography variant="body1" component="div" sx={{ mt: 1, mb: 1 }}>
                                                Rent Contract Payments:
                                            </Typography>
                                            <Grid container spacing={{ xs: 4, md: 4 }} columns={{ xs: 4, sm: 8, md: 24 }}>
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
                                    {showDisputes ? (
                                        <>
                                            <Typography variant="body1" component="div" sx={{ mt: 1, mb: 1 }}>
                                                Rent Contract Disputes:
                                            </Typography>
                                            <Typography variant="body2" component="div" sx={{ mt: 1, mb: 1 }}>
                                                Create Dispute:
                                            </Typography>
                                            <TextField
                                                id="filled-basic"
                                                helperText="Dispute description"
                                                value={disputeDescription}
                                                variant="filled"
                                                multiline
                                                onChange={(e) => setDisputeDescription(e.target.value)}
                                            />
                                            <br />
                                            {!alert ? (
                                                <>
                                                    <Button
                                                        size="medium"
                                                        variant="outlined"
                                                        onClick={handleCreateDisputeSubmit}
                                                        sx={{ mt: 1, mb: 1 }}
                                                    >
                                                        Submit
                                                    </Button>
                                                    {loading ? <CircularProgress size="2rem" /> : <></>}
                                                </>
                                            ) : (
                                                <Alert icon={<CheckIcon fontSize="inherit" />}>Dispute is created!</Alert>
                                            )}
                                            {disputes.length == 0 ? (
                                                <Typography variant="body2" component="div" color="primary" sx={{ mt: 1, mb: 3 }}>
                                                    There are no disputes yet!
                                                </Typography>
                                            ) : (
                                                <></>
                                            )}

                                            {!solvedAlert && solvedLoading ? <CircularProgress size="1rem" sx={{ ml: 1 }} /> : <></>}

                                            {solvedAlert ? <Alert icon={<CheckIcon fontSize="inherit" />}>Dispute is solved!</Alert> : <></>}
                                            <Grid container spacing={{ xs: 4, md: 4 }} columns={{ xs: 4, sm: 8, md: 24 }}>
                                                {disputes.map((dispute) => (
                                                    <Grid item xs={2} sm={5} md={8}>
                                                        <Dispute key={dispute.id} dispute={dispute} solveDispute={solveDispute} />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </React.Fragment>
                </Card>
            </Box>
        </>
    )
}
