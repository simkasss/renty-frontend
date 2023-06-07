import Head from "next/head"
import React from "react"
import Box from "@mui/material/Box"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"
import { MyPropertyCard } from "./MyPropertyCard"
import Switch from "@mui/material/Switch"
import Stack from "@mui/material/Stack"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

export default function MyProperties({ properties, handlePropertyClick, wallet, handleLinkClick, conversionChecked, email, phoneNumber }) {
    return (
        <div>
            <Head>
                <title>My Properties</title>
            </Head>

            <Box
                sx={{
                    "& > :not(style)": { ml: 5, mt: 1, mr: 5, mb: 5, width: "max" },
                }}
            >
                <Card variant="outlined">
                    <React.Fragment>
                        <CardContent sx={{ alignContent: "left", alignItems: "left" }}>
                            {email == "" && phoneNumber == "" ? (
                                <>
                                    <Button size="small" color="error" startIcon={<ErrorOutlineIcon />} href={`/${wallet}/account`}>
                                        Please add your contact details
                                    </Button>
                                    <br />
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6" color="primary">
                                        My Properties
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        size="medium"
                                        sx={{
                                            mb: 1,
                                            mt: 1,
                                        }}
                                        onClick={() => handleLinkClick(`/${wallet}/myproperties/create`)}
                                    >
                                        Create New Property
                                    </Button>
                                    {properties.length == 0 ? (
                                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                            You don't have any properties yet
                                        </Typography>
                                    ) : (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                component="div"
                                                color="primary"
                                                sx={{
                                                    mb: 1,
                                                    mt: 2,
                                                }}
                                            >
                                                Listed Properties
                                            </Typography>
                                            {properties.filter((property) => property.isListed).length == 0 ? (
                                                <Typography variant="body2" sx={{ mb: 2 }}>
                                                    You do not have listed properties
                                                </Typography>
                                            ) : (
                                                ""
                                            )}
                                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                                {properties
                                                    .filter((property) => property.isListed)
                                                    .map((property) => (
                                                        <Grid item xs={2} sm={4} md={4}>
                                                            <MyPropertyCard
                                                                key={property.propertyNftId}
                                                                property={property}
                                                                conversionChecked={conversionChecked}
                                                                onClick={() => handlePropertyClick(property)}
                                                            />
                                                        </Grid>
                                                    ))}
                                            </Grid>
                                            <Typography
                                                variant="subtitle1"
                                                component="div"
                                                color="primary"
                                                sx={{
                                                    mb: 1,
                                                    mt: 2,
                                                }}
                                            >
                                                Not Listed Properties
                                            </Typography>
                                            {properties.filter((property) => !property.isListed).length == 0 ? (
                                                <Typography variant="body2" sx={{ mb: 2 }}>
                                                    You do not have not listed properties
                                                </Typography>
                                            ) : (
                                                ""
                                            )}
                                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                                {properties
                                                    .filter((property) => !property.isListed)
                                                    .map((property) => (
                                                        <Grid item xs={2} sm={4} md={4}>
                                                            <MyPropertyCard
                                                                key={property.propertyNftId}
                                                                property={property}
                                                                conversionChecked={conversionChecked}
                                                                onClick={() => handlePropertyClick(property)}
                                                            />{" "}
                                                        </Grid>
                                                    ))}
                                            </Grid>
                                            <br />
                                        </>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </React.Fragment>
                </Card>
            </Box>
        </div>
    )
}
