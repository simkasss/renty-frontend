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

export function CreateProperty({
    propertyName,
    setPropertyName,
    propertyFormData,
    setPropertyFormData,
    propertyNftData,
    setPropertyNftData,
    handleSubmit,
    alert,
    loading,
}) {
    return (
        <>
            <Head>
                <title>Create Property</title>
            </Head>
            <Box
                component="form"
                sx={{
                    "& > :not(style)": { m: 5, width: "50ch" },
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Card variant="outlined">
                    <React.Fragment>
                        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Typography variant="h5" component="div">
                                Create New Property
                            </Typography>

                            <TextField
                                id="filled-basic"
                                helperText="Owner Name"
                                value={propertyNftData.ownerName}
                                variant="filled"
                                onChange={(e) =>
                                    setPropertyNftData((data) => {
                                        data.ownerName = e.target.value
                                        return data
                                    })
                                }
                            />
                            <br />
                            <TextField
                                id="filled-basic"
                                helperText="Property Name"
                                variant="filled"
                                value={propertyName}
                                onChange={(e) => setPropertyName(e.target.value)}
                            />
                            <br />
                            <TextField
                                id="filled-basic"
                                helperText="Address"
                                variant="filled"
                                value={propertyNftData.address}
                                onChange={(e) => {
                                    setPropertyNftData((data) => {
                                        data.address = e.target.value
                                        return data
                                    })
                                    setPropertyFormData((data) => {
                                        data.address = e.target.value
                                        return data
                                    })
                                }}
                            />
                            <br />
                            <TextField
                                id="filled-basic"
                                helperText="Country Code"
                                variant="filled"
                                value={propertyNftData.countryCode}
                                onChange={(e) =>
                                    setPropertyNftData((data) => {
                                        data.countryCode = e.target.value
                                        return data
                                    })
                                }
                            />
                            <br />
                            <TextField
                                id="filled-basic"
                                helperText="Number of Rooms"
                                variant="filled"
                                value={propertyFormData.numberOfRooms}
                                onChange={(e) =>
                                    setPropertyFormData((data) => {
                                        data.numberOfRooms = e.target.value
                                        return data
                                    })
                                }
                            />
                            <br />
                            <TextField
                                id="filled-basic"
                                helperText="Area"
                                variant="filled"
                                value={propertyFormData.area}
                                onChange={(e) =>
                                    setPropertyFormData((data) => {
                                        data.area = e.target.value
                                        return data
                                    })
                                }
                            />
                            <br />
                            <TextField
                                id="filled-basic"
                                helperText="Floor"
                                variant="filled"
                                value={propertyFormData.floor}
                                onChange={(e) =>
                                    setPropertyFormData((data) => {
                                        data.floor = e.target.value
                                        return data
                                    })
                                }
                            />
                            <br />
                            <TextField
                                id="filled-basic"
                                helperText="Build Year"
                                variant="filled"
                                value={propertyFormData.buildYear}
                                onChange={(e) =>
                                    setPropertyFormData((data) => {
                                        data.buildYear = e.target.value
                                        return data
                                    })
                                }
                            />
                            <br />
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
                                <Alert icon={<CheckIcon fontSize="inherit" />}>Property is created!</Alert>
                            )}
                        </CardActions>
                    </React.Fragment>
                </Card>
            </Box>
        </>
    )
}
