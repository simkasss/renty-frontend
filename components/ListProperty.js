import Head from "next/head"
import React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Alert from "@mui/material/Alert"
import CheckIcon from "@mui/icons-material/Check"
import CircularProgress from "@mui/material/CircularProgress"
import { useRouter } from "next/router"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"

export function ListProperty({
    loading,
    alert,
    properties,
    listPropertyData,
    setListPropertyData,
    rentalTermSeconds,
    handleRentalTermChange,
    numDays,
    handleNumDaysChange,
    handlePhotosChange,
    handleFileChange,
    handleSubmit,
}) {
    const router = useRouter()
    const { propertyId: id } = router.query
    const selectedProperty = properties.find((property) => property.propertyNftId == parseInt(id))
    return (
        <>
            <Head>
                <title>List Property</title>
            </Head>

            <Box
                component="form"
                sx={{
                    "& > :not(style)": { m: 10, width: "50ch" },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Card variant="outlined">
                    <React.Fragment>
                        <CardContent
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "left",
                            }}
                        >
                            <Typography variant="h5" component="div" color="primary">
                                List Property
                            </Typography>
                            {selectedProperty !== undefined ? (
                                <>
                                    <br />
                                    <Typography variant="subtitle2" component="div" sx={{ mb: 1 }}>
                                        Property ID: {selectedProperty.propertyNftId}
                                    </Typography>
                                    <Typography variant="subtitle2" component="div" sx={{ mb: 1 }}>
                                        Property Name: {selectedProperty.name}
                                    </Typography>
                                    <Typography variant="subtitle2" component="div" sx={{ mb: 1 }}>
                                        Status: {selectedProperty.isRented === "true" ? "Rented" : "Vacant"}
                                    </Typography>
                                    {selectedProperty.isRented === "true" ? (
                                        <Typography variant="subtitle" component="div">
                                            {" "}
                                            Rent Contract Id: {selectedProperty.rentContractId}
                                        </Typography>
                                    ) : (
                                        <></>
                                    )}
                                    <TextField
                                        id="filled-basic"
                                        helperText="Rental Price (ETH)"
                                        fullWidth
                                        value={listPropertyData.rentalPrice}
                                        variant="standard"
                                        inputProps={{
                                            color: "primary",
                                        }}
                                        onChange={(e) =>
                                            setListPropertyData((data) => {
                                                data.rentalPrice = e.target.value
                                                return data
                                            })
                                        }
                                    />
                                    <br />
                                    <TextField
                                        id="filled-basic"
                                        helperText="Deposit Amount (ETH)"
                                        value={listPropertyData.depositAmount}
                                        variant="standard"
                                        fullWidth
                                        onChange={(e) =>
                                            setListPropertyData((data) => {
                                                data.depositAmount = e.target.value
                                                return data
                                            })
                                        }
                                        size="small"
                                    />
                                    <br />
                                    <TextField
                                        id="filled-basic"
                                        helperText="Description"
                                        multiline
                                        maxRows={10}
                                        variant="standard"
                                        value={listPropertyData.description}
                                        onChange={(e) =>
                                            setListPropertyData((data) => {
                                                data.description = e.target.value
                                                return data
                                            })
                                        }
                                    />
                                    <br />
                                    <FormControl sx={{ width: "19ch" }}>
                                        <Select
                                            displayEmpty
                                            value={rentalTermSeconds}
                                            onChange={handleRentalTermChange}
                                            inputProps={{ "aria-label": "Without label" }}
                                        >
                                            <MenuItem value={"year"}>Year</MenuItem>
                                            <MenuItem value={"six-months"}>Six months</MenuItem>
                                            <MenuItem value={"three-months"}>Three months</MenuItem>
                                            <MenuItem value={"month"}>Month</MenuItem>
                                            <MenuItem value={"custom"}>Custom</MenuItem>
                                        </Select>
                                        <Typography variant="caption">Rental Term</Typography>
                                        <br />
                                    </FormControl>
                                    {rentalTermSeconds == "custom" && (
                                        <>
                                            <TextField
                                                id="filled-basic"
                                                helperText="Number of days"
                                                value={numDays}
                                                variant="filled"
                                                onChange={handleNumDaysChange}
                                            />
                                            <br />
                                        </>
                                    )}
                                    <input variant="filled" id="file-upload" type="file" multiple onChange={handlePhotosChange} />
                                    <Typography variant="caption">Photos</Typography>
                                    <br />
                                    <input variant="filled" id="file-upload" type="file" onChange={handleFileChange} />
                                    <Typography variant="caption">Rent Contract Terms and Conditions</Typography>
                                    <br />
                                </>
                            ) : (
                                <></>
                            )}
                        </CardContent>
                        <CardActions sx={{ display: "flex", flexDirection: "column" }}>
                            {!alert ? (
                                <>
                                    <Button size="large" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                    {loading ? <CircularProgress size="2rem" /> : <></>}
                                </>
                            ) : (
                                <Alert icon={<CheckIcon fontSize="inherit" />}>Property is listed!</Alert>
                            )}
                        </CardActions>
                    </React.Fragment>
                </Card>
            </Box>
        </>
    )
}
