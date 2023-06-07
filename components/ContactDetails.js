import Head from "next/head"
import React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

export function ContactDetails({ email, phoneNumber, showUpdateForm, setShowUpdateForm }) {
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
                                My Contact Details
                            </Typography>
                            <br />
                            <Typography variant="body1" component="div">
                                Email: {email}
                            </Typography>

                            <Typography variant="body1" component="div">
                                Phone Number: {phoneNumber}
                            </Typography>
                            <br />
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    setShowUpdateForm(!showUpdateForm)
                                }}
                            >
                                Update Contact Details
                            </Button>
                        </CardContent>
                    </React.Fragment>
                </Card>
            </Box>
        </>
    )
}
