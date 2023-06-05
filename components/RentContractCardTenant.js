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
import Switch from "@mui/material/Switch"
import Head from "next/head"
import Stack from "@mui/material/Stack"
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
import SendIcon from "@mui/icons-material/Send"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

function convertTimestampToDate(timestampInSeconds) {
    const date = new Date(timestampInSeconds * 1000)
    const year = date.getFullYear()
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    return `${year}/${month}/${day}`
}

export function RentContractCardTenant({
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
    depositTransfered,
    totalRentPaid,
    totalRequiredRentAmount,
    transferDeposit,
    payRent,
    transferDepositLoading,
    transferDepositdAlert,
    payAlert,
    payLoading,
    handleTerminate,
    terminateLoading,
    terminateAlert,
    email,
    phoneNumber,
    showContactDetails,
    setShowContactDetails,
    depositReleasePermission,
    releaseDeposit,
    handleChange,
    conversionChecked,
    rentalPriceInUsd,
    depositInUsd,
    transferedDepositInUsd,
    totalRentPaidInUsd,
    totalRequiredInUsd,
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
    } else if (rentContract.status == 2) {
        status = "Canceled"
    }

    return (
        <>
            <Head>
                <title>Rent Contract</title>
            </Head>
            <Stack direction="row" alignItems="center" sx={{ ml: 12, mt: 1 }}>
                <AttachMoneyIcon fontSize="small" />
                <Switch checked={conversionChecked} onClick={handleChange} />
                <Typography>ETH</Typography>
            </Stack>
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
                                {conversionChecked ? `${rentContract.rentalPrice} ETH/month` : `${rentalPriceInUsd} USD/month`}
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
                                                {conversionChecked ? `${rentContract.depositAmount} ETH` : `${depositInUsd} USD`}
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
                                            <TableCell align="left">
                                                {status} {status == "Canceled" ? <ErrorOutlineIcon color="error" sx={{ ml: 1 }} /> : ""}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Transfered Deposit
                                            </TableCell>
                                            <TableCell align="left">
                                                {conversionChecked ? `${depositTransfered} ETH` : `${transferedDepositInUsd} USD`}

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
                                                {conversionChecked ? `${totalRentPaid} ETH` : `${totalRentPaidInUsd} USD`}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Total Required Rent Amount
                                            </TableCell>
                                            <TableCell align="left">
                                                {totalRequiredRentAmount <= 0
                                                    ? "0"
                                                    : conversionChecked
                                                    ? `${totalRequiredRentAmount} ETH`
                                                    : `${totalRequiredInUsd} USD`}
                                                {totalRequiredRentAmount > totalRentPaid ? (
                                                    <ErrorOutlineIcon color="error" sx={{ ml: 1 }} />
                                                ) : (
                                                    <CheckIcon color="success" sx={{ ml: 1 }} />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Release Of Deposit
                                            </TableCell>
                                            <TableCell align="left">{depositReleasePermission == false ? "Not allowed" : "Allowed"}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <br />

                            <Button
                                variant="outlined"
                                target="_blank"
                                size="small"
                                sx={{ mb: 1 }}
                                href={`https://gateway.pinata.cloud/ipfs/${property.hashOfRentalAgreement}`}
                            >
                                Rent Contract Terms and Conditions (PDF)
                            </Button>
                            <br />
                            <Button
                                startIcon={<SendIcon />}
                                sx={{ mr: 1, mt: 1, mb: 2 }}
                                variant="outlined"
                                size="small"
                                onClick={() => setShowContactDetails(!showContactDetails)}
                            >
                                Landlord
                            </Button>

                            {showContactDetails ? (
                                <>
                                    <Typography variant="body1" component="div" color="primary">
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
                                ""
                            )}
                            {depositTransfered < rentContract.depositAmount ? (
                                <>
                                    {!transferDepositdAlert ? (
                                        <>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={transferDeposit}
                                                endIcon={<AttachMoneyIcon />}
                                                sx={{ mt: 1, mb: 2, mr: 1 }}
                                            >
                                                Transfer Deposit
                                            </Button>
                                            {transferDepositLoading ? <CircularProgress size="1rem" sx={{ mr: 1 }} /> : <></>}
                                        </>
                                    ) : (
                                        ""
                                    )}
                                </>
                            ) : (
                                <>
                                    {!payAlert ? (
                                        <>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={payRent}
                                                endIcon={<AttachMoneyIcon />}
                                                sx={{ mt: 1, mb: 2, mr: 1 }}
                                            >
                                                Pay Rent
                                            </Button>
                                            {payLoading ? <CircularProgress size="1rem" sx={{ mr: 1 }} /> : <></>}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {depositReleasePermission == true && rentContract.expiryTimestamp < nowTimestampInSeconds ? (
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            endIcon={<AttachMoneyIcon />}
                                            sx={{ mt: 1, mb: 2, mr: 1 }}
                                            onClick={releaseDeposit}
                                        >
                                            Release Deposit
                                        </Button>
                                    ) : (
                                        ""
                                    )}
                                </>
                            )}

                            <Button
                                variant="outlined"
                                size="small"
                                onClick={handlePaymentHistoryClick}
                                endIcon={<AttachMoneyIcon />}
                                sx={{ mt: 1, mb: 2, mr: 1 }}
                            >
                                Payment History
                            </Button>

                            <Button
                                size="small"
                                variant="outlined"
                                endIcon={<AnnouncementIcon />}
                                sx={{ mt: 1, mb: 2, mr: 1 }}
                                onClick={handleShowDisputes}
                            >
                                Disputes
                            </Button>

                            {!terminateAlert ? (
                                <>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        endIcon={<NotInterestedIcon />}
                                        sx={{ mt: 1, mb: 2, mr: 1 }}
                                        onClick={handleTerminate}
                                    >
                                        Terminate Rent Contract
                                    </Button>
                                    {terminateLoading ? <CircularProgress size="1rem" sx={{ mr: 1 }} /> : <></>}
                                </>
                            ) : (
                                <Alert icon={<CheckIcon fontSize="inherit" />}>Contract Terminated!</Alert>
                            )}

                            {payAlert ? <Alert icon={<CheckIcon fontSize="inherit" />}>Payment transfered!</Alert> : ""}
                            {transferDepositdAlert ? <Alert icon={<CheckIcon fontSize="inherit" />}>Deposit transfered!</Alert> : ""}
                            {showPaymentHistory ? (
                                <>
                                    <Grid container spacing={{ xs: 4, md: 4 }} columns={{ xs: 4, sm: 8, md: 24 }}>
                                        {payments.map((payment) => (
                                            <Grid item xs={2} sm={5} md={8}>
                                                <Payment key={payment.id} payment={payment} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                    {payments.length == 0 ? (
                                        <Typography variant="body2" component="div" color="primary" sx={{ mt: 4 }}>
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
                                            <Button size="medium" variant="outlined" onClick={handleCreateDisputeSubmit} sx={{ mt: 1, mb: 1 }}>
                                                Submit
                                            </Button>
                                            {loading ? <CircularProgress size="1rem" sx={{ ml: 1, mr: 1 }} /> : <></>}
                                        </>
                                    ) : (
                                        <Alert icon={<CheckIcon fontSize="inherit" />}>Dispute is created!</Alert>
                                    )}
                                    <Typography variant="body1" component="div" sx={{ mt: 1, mb: 1 }}>
                                        Rent Contract Disputes:
                                    </Typography>
                                    {!solvedAlert && solvedLoading ? <CircularProgress size="1rem" sx={{ ml: 1, mr: 1 }} /> : <></>}

                                    {solvedAlert ? <Alert icon={<CheckIcon fontSize="inherit" />}>Dispute is created!</Alert> : <></>}
                                    {disputes.length == 0 ? (
                                        <Typography variant="body2" component="div" color="primary" sx={{ mt: 1, mb: 1 }}>
                                            Rent Contract doesn't have disputes!
                                        </Typography>
                                    ) : (
                                        <Grid container spacing={{ xs: 4, md: 4 }} columns={{ xs: 4, sm: 8, md: 24 }}>
                                            {disputes.map((dispute) => (
                                                <Grid item xs={2} sm={5} md={8}>
                                                    <Dispute key={dispute.id} dispute={dispute} solveDispute={solveDispute} />
                                                </Grid>
                                            ))}
                                        </Grid>
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
