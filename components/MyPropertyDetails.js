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
import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import Alert from "@mui/material/Alert"
import CheckIcon from "@mui/icons-material/Check"
import CircularProgress from "@mui/material/CircularProgress"
import { getWEIAmountInUSD } from "../utilities/currencyConversion"

function srcset(image, size, rows = 1, cols = 1) {
    return {
        src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
        srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
    }
}

export function MyPropertyDetails({ property, wallet, id, handleLinkClick, handleUnlist, alert, loading, conversionChecked }) {
    const [numberOfRooms, setNumberOfRooms] = React.useState("")
    const [area, setArea] = React.useState("")
    const [floor, setFloor] = React.useState("")
    const [buildYear, setBuildYear] = React.useState("")
    const [address, setAddress] = React.useState("")
    const [photos, setPhotos] = React.useState([])
    const [rentalPriceInUsd, setRentalPriceInUsd] = React.useState("")
    const [depositInUsd, setDepositInUsd] = React.useState("")

    React.useEffect(() => {
        async function getPropertyData() {
            const url = `https://gateway.pinata.cloud/ipfs/${property.hashOfMetaData}`
            await fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    setNumberOfRooms(data.numberOfRooms)
                    setArea(data.area)
                    setFloor(data.floor)
                    setBuildYear(data.buildYear)
                    setAddress(data.address)
                })
                .catch((error) => console.error(error))
        }
        getPropertyData()

        async function getPhotos() {
            if (property.hashesOfPhotos.length !== 0) {
                for (let i = 0; i <= property.hashesOfPhotos.length; i++) {
                    const url = `https://gateway.pinata.cloud/ipfs/${property.hashesOfPhotos[i]}`
                    await fetch(url)
                        .then((response) => response.json())
                        .then((data) => {
                            setPhotos((currentPhotos) => [...currentPhotos, data])
                        })
                        .catch((error) => console.error(error))
                }
            } else {
                console.log("There are no photos")
            }
        }
        getPhotos()

        async function currencyConversion(ethAmount) {
            const usd = await getWEIAmountInUSD(ethAmount)
            return usd
        }

        currencyConversion(property.rentalPrice).then((usd) => setRentalPriceInUsd(usd))
        currencyConversion(property.depositAmount).then((usd) => setDepositInUsd(usd))
    }, [photos])

    return (
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
                                        <img {...srcset(`https://gateway.pinata.cloud/ipfs/${item}`, 121, 2, 2)} alt={item.title} loading="lazy" />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        ) : (
                            <Typography variant="body1" component="div">
                                There are no photos yet
                            </Typography>
                        )}
                        <Typography variant="body1" component="div">
                            {address}
                        </Typography>
                        <Typography variant="inherit" component="div" color="primary">
                            {conversionChecked ? `${rentalPriceInUsd} USD/month` : `${property.rentalPrice} ETH/month`}
                        </Typography>

                        <br />
                        <Button
                            variant="outlined"
                            size="medium"
                            sx={{
                                mb: 1,
                                mt: 1,
                                mr: 1,
                            }}
                            onClick={() => handleLinkClick(`/${wallet}/myproperties/${id}/rent-history`)}
                        >
                            Rent History
                        </Button>

                        {!property.isListed ? (
                            !alert ? (
                                <>
                                    <Button
                                        variant="outlined"
                                        size="medium"
                                        sx={{
                                            mb: 1,
                                            mt: 1,
                                            mr: 1,
                                        }}
                                        onClick={() => handleLinkClick(`/${wallet}/myproperties/${id}/list`)}
                                    >
                                        List Property
                                    </Button>

                                    {loading ? <CircularProgress size="1rem" /> : <></>}
                                </>
                            ) : (
                                <Alert icon={<CheckIcon fontSize="inherit" />}>Property is listed!</Alert>
                            )
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    size="medium"
                                    sx={{
                                        mb: 1,
                                        mt: 1,
                                        mr: 1,
                                    }}
                                    onClick={() => handleLinkClick(`/${wallet}/myproperties/${id}/rent-applications`)}
                                >
                                    Screen Rent Applications
                                </Button>
                                {!alert ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            size="medium"
                                            sx={{
                                                mb: 1,
                                                mt: 1,
                                                mr: 1,
                                            }}
                                            onClick={handleUnlist}
                                        >
                                            Remove from list
                                        </Button>

                                        {loading ? <CircularProgress size="1rem" /> : <></>}
                                    </>
                                ) : (
                                    <Alert icon={<CheckIcon fontSize="inherit" />}>Property removed from list!</Alert>
                                )}
                            </>
                        )}
                        {property.isRented ? (
                            <Button
                                variant="outlined"
                                size="medium"
                                sx={{
                                    mb: 1,
                                    mt: 1,
                                    mr: 1,
                                }}
                                onClick={() => handleLinkClick(`/${wallet}/myproperties/${id}/rent-contract`)}
                            >
                                Current Rent Contract
                            </Button>
                        ) : (
                            <></>
                        )}
                        <Button
                            variant="outlined"
                            size="medium"
                            sx={{
                                mb: 1,
                                mt: 1,
                                mr: 1,
                            }}
                            onClick={() => handleLinkClick(`/${wallet}/myproperties/${id}/update`)}
                        >
                            Update Property
                        </Button>

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
                            <Button variant="outlined" target="_blank" href={`https://gateway.pinata.cloud/ipfs/${property.hashOfRentalAgreement}`}>
                                Rent Contract Terms and Conditions (PDF)
                            </Button>
                        ) : (
                            <></>
                        )}
                    </CardContent>
                </React.Fragment>
            </Card>
        </Box>
    )
}
