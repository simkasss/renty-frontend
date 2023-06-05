import Head from "next/head"
import React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Alert from "@mui/material/Alert"
import CheckIcon from "@mui/icons-material/Check"
import CircularProgress from "@mui/material/CircularProgress"

export function Balance({ balance, withdrawalAmount, setWithdrawalAmount, withdrawProceeds, withdrawLoading, withdrawAlert }) {
    return (
        <>
            <Head>
                <title>Balance</title>
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
                                My Proceeds
                            </Typography>
                            <br />
                            <Typography variant="body2" component="div" sx={{ mb: 2 }}>
                                Total proceeds: {balance} ETH
                            </Typography>

                            <TextField
                                sx={{ mb: 1 }}
                                id="filled-basic"
                                helperText="Amount (ETH)"
                                variant="filled"
                                value={withdrawalAmount}
                                onChange={(e) => setWithdrawalAmount(e.target.value)}
                            />

                            {!withdrawAlert ? (
                                <>
                                    <Button variant="outlined" size="small" onClick={withdrawProceeds}>
                                        Withdraw
                                    </Button>
                                    {withdrawLoading ? <CircularProgress size="2rem" sx={{ mt: 1 }} /> : <></>}
                                </>
                            ) : (
                                <Alert icon={<CheckIcon fontSize="inherit" />}>Proceeds withdrawn!</Alert>
                            )}
                        </CardContent>
                    </React.Fragment>
                </Card>
            </Box>
        </>
    )
}
