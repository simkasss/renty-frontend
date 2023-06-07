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

export function AddContactDetails({ alert, loading, email, setEmail, phoneNumber, setPhoneNumber, handleSubmit }) {
    return (
        <>
            <Head>
                <title>Contact Details</title>
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
                            <Typography variant="h6" component="div" color="primary">
                                Contact Details
                            </Typography>
                            <br />
                            <TextField
                                id="filled-basic"
                                helperText="Email"
                                value={email}
                                variant="filled"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <br />
                            <TextField
                                id="filled-basic"
                                helperText="Phone Number"
                                variant="filled"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            <br />
                        </CardContent>
                        <CardActions sx={{ display: "flex", flexDirection: "column" }}>
                            {!alert ? (
                                <>
                                    <Button size="medium" variant="outlined" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                    {loading ? <CircularProgress size="2rem" sx={{ mt: 1 }} /> : <></>}
                                </>
                            ) : (
                                <Alert icon={<CheckIcon fontSize="inherit" />}>Contact details are added!</Alert>
                            )}
                        </CardActions>
                    </React.Fragment>
                </Card>
            </Box>
        </>
    )
}
