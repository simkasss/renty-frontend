import Head from "next/head"
import * as React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import CircularProgress from "@mui/material/CircularProgress"
import Alert from "@mui/material/Alert"
import CheckIcon from "@mui/icons-material/Check"

export function MintSBTCard({ handleSubmit, tenantName, setTenantName, alertMint, loadingMint }) {
    return (
        <div>
            <Head>
                <title>My Rentals</title>
            </Head>

            <Box
                component="form"
                sx={{
                    "& > :not(style)": { m: 5, width: "50ch" },
                }}
            >
                <Card variant="outlined">
                    <React.Fragment>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                You need to create a soulbound token in order to apply for rent
                            </Typography>
                            <Typography variant="h6" component="div">
                                Create Your Soulbound Token
                            </Typography>

                            <TextField
                                id="filled-basic"
                                helperText="Please enter your name"
                                value={tenantName}
                                variant="filled"
                                onChange={(e) => setTenantName(e.target.value)}
                                inputProps={{
                                    style: { fontSize: 14 }, // Adjust the font size as needed
                                }}
                            />
                        </CardContent>
                        <CardActions>
                            {!alertMint ? (
                                <>
                                    <Button size="large" onClick={handleSubmit}>
                                        Submit
                                    </Button>
                                    {loadingMint ? <CircularProgress size="1rem" /> : <></>}
                                </>
                            ) : (
                                <Alert icon={<CheckIcon fontSize="inherit" />}>Soulbount Token is created!</Alert>
                            )}
                        </CardActions>
                    </React.Fragment>
                </Card>
            </Box>
        </div>
    )
}
