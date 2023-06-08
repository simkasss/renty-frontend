import React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import { ethers } from "ethers"
import networkMapping from "../constants/networkMapping.json"
import mainContractAbi from "../constants/MainContract.json"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import CreateIcon from "@mui/icons-material/Create"
import SendIcon from "@mui/icons-material/Send"
import { getWEIAmountInUSD } from "../utilities/currencyConversion"

function srcset(image, size, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
    }
}

export function PropertyDetails({ property, setShowContactDetails, showContactDetails, email, phoneNumber, conversionChecked }) {
    const [numberOfRooms, setNumberOfRooms] = React.useState("")
    const [area, setArea] = React.useState("")
    const [floor, setFloor] = React.useState("")
    const [buildYear, setBuildYear] = React.useState("")
    const [address, setAddress] = React.useState("")
    const [rentalPriceInUsd, setRentalPriceInUsd] = React.useState("")
    const [depositInUsd, setDepositInUsd] = React.useState("")

    React.useEffect(() => {
        async function getPropertyData() {
            const url = `https://gateway.pinata.cloud/ipfs/${property.hashOfMetaData}`
            await fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    setAddress(data.address)
                    setNumberOfRooms(data.numberOfRooms)
                    setArea(data.area)
                    setFloor(data.floor)
                    setBuildYear(data.buildYear)
                })
                .catch((error) => console.error(error))
        }
        async function currencyConversion(ethAmount) {
            const usd = await getWEIAmountInUSD(ethAmount)
            return usd
        }

        getPropertyData()
        currencyConversion(property.rentalPrice).then((usd) => setRentalPriceInUsd(usd))
        currencyConversion(property.depositAmount).then((usd) => setDepositInUsd(usd))
    }, [])

    return (
        <>
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
                                {property.name}
                            </Typography>
                            <br />

                            {property.hashesOfPhotos.length !== 0 ? (
                                <ImageList sx={{ width: 965, height: 450 }} variant="quilted" cols={4} rowHeight={121}>
                                    {property.hashesOfPhotos.map((item) => (
                                        <ImageListItem key={`https://gateway.pinata.cloud/ipfs/${item}`} cols={2} rows={3}>
                                            <img
                                                {...srcset(`https://gateway.pinata.cloud/ipfs/${item}`, 121, 2, 2)}
                                                alt={item.title}
                                                loading="lazy"
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            ) : (
                                <Typography variant="body1" component="div">
                                    There are no photos yet
                                </Typography>
                            )}
                            <br />
                            <Typography variant="body1" component="div">
                                {address}
                            </Typography>
                            <Typography variant="inherit" component="div" color="primary">
                                {conversionChecked ? `${rentalPriceInUsd} USD/month` : `${property.rentalPrice} ETH/month`}
                            </Typography>

                            <Button
                                variant="outlined"
                                href={`/properties/${property.propertyNftId}/apply-for-rent`}
                                startIcon={<CreateIcon />}
                                sx={{ mt: 1, mb: 2, mr: 2 }}
                            >
                                Apply for rent
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<SendIcon />}
                                sx={{ mt: 1, mb: 2 }}
                                onClick={() => setShowContactDetails(!showContactDetails)}
                            >
                                Landlord
                            </Button>
                            <br />
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
                                    <br />
                                </>
                            ) : (
                                <></>
                            )}
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
                                                Status
                                            </TableCell>
                                            <TableCell align="left">{property.isRented === true ? "Rented" : "Vacant"}</TableCell>
                                        </TableRow>

                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Rental Term
                                            </TableCell>
                                            <TableCell align="left">{property.rentalTerm / 24 / 60 / 60} days</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Deposit Amount
                                            </TableCell>
                                            <TableCell align="left">
                                                {conversionChecked ? `${depositInUsd} USD` : `${property.depositAmount} ETH`}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Number of rooms
                                            </TableCell>
                                            <TableCell align="left">{numberOfRooms}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Area
                                            </TableCell>
                                            <TableCell align="left">{area}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Floor
                                            </TableCell>
                                            <TableCell align="left">{floor}</TableCell>
                                        </TableRow>
                                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                            <TableCell component="th" scope="row">
                                                Build Year
                                            </TableCell>
                                            <TableCell align="left">{buildYear}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <br />
                            <Typography variant="body1" component="div" color="primary">
                                Description:
                            </Typography>
                            <Typography variant="body2" component="div">
                                {property.description == "" ? `There is no description yet` : property.description}
                            </Typography>
                            <br />
                            {property.hashOfRentalAgreement ? (
                                <Button
                                    variant="outlined"
                                    target="_blank"
                                    href={`https://gateway.pinata.cloud/ipfs/${property.hashOfRentalAgreement}`}
                                >
                                    Rent Contract Terms and Conditions (PDF)
                                </Button>
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
