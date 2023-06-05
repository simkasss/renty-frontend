import React from "react"
import Head from "next/head"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import Grid from "@mui/material/Grid"
import { RentApplicationCardTenant } from "./RentApplicationCardTenant"
import Switch from "@mui/material/Switch"
import Stack from "@mui/material/Stack"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

export function MyRentals({
    tenantSBT,
    wallet,
    currentRentContractId,
    rentContracts,
    handleCancelClick,
    loading,
    alert,
    email,
    phoneNumber,
    conversionChecked,
    handleChange,
}) {
    return (
        <div>
            <div>
                <Head>
                    <title>My Rentals</title>
                </Head>

                <Box
                    component="form"
                    sx={{
                        "& > :not(style)": { ml: 5, mr: 5, width: "max" },
                    }}
                >
                    <Stack direction="row" alignItems="center" sx={{ ml: 12, mt: 1, mb: 1 }}>
                        <AttachMoneyIcon fontSize="small" />
                        <Switch checked={conversionChecked} onClick={handleChange} />
                        <Typography>ETH</Typography>
                    </Stack>

                    <Card variant="outlined">
                        <React.Fragment>
                            <CardContent>
                                {email == "" && phoneNumber == "" ? (
                                    <>
                                        <Button size="small" color="error" startIcon={<ErrorOutlineIcon />} href={`/${wallet}/account`}>
                                            Please add your contact details
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="body1" component="div" sx={{ ml: 1, mr: 4, mt: 1, mb: 2 }}>
                                            Tenant Soulbound Token ID: {tenantSBT.toString()}{" "}
                                        </Typography>

                                        <Button size="medium" variant="outlined" href={`/${wallet}/myrentals/rent-history`} sx={{ mr: 2 }}>
                                            My Rent History
                                        </Button>
                                        {currentRentContractId == undefined ? (
                                            <></>
                                        ) : (
                                            <>
                                                <Button
                                                    size="medium"
                                                    variant="outlined"
                                                    href={`/${wallet}/myrentals/${currentRentContractId}`}
                                                    sx={{ mr: 2 }}
                                                >
                                                    My Rent Contract
                                                </Button>
                                            </>
                                        )}

                                        <Typography variant="h6" component="div" color="primary" sx={{ mt: 1 }}>
                                            My Rent Applications
                                        </Typography>
                                        {rentContracts.length > 0 ? (
                                            <Grid container spacing={{ xs: 2, md: 1 }} columns={{ xs: 4, sm: 8, md: 16 }}>
                                                {rentContracts.map((rentContract) => (
                                                    <Grid item xs={2} sm={4} md={4}>
                                                        <RentApplicationCardTenant
                                                            key={rentContract.id}
                                                            rentContract={rentContract}
                                                            handleCancelClick={handleCancelClick}
                                                            loading={loading}
                                                            alert={alert}
                                                            conversionChecked={conversionChecked}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        ) : (
                                            <Typography variant="body2" component="div">
                                                You don't have rent applications yet
                                            </Typography>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </React.Fragment>
                    </Card>
                </Box>
            </div>
        </div>
    )
}
