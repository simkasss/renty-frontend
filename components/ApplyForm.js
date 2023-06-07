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
import Select from "@mui/material/Select"
import FormControl from "@mui/material/FormControl"
import FormHelperText from "@mui/material/FormHelperText"
import MenuItem from "@mui/material/MenuItem"

export function ApplyForm({
    applyFormData,
    setApplyFormData,
    handleSubmit,
    tenantId,
    wallet,
    tenantName,
    alert,
    loading,
    rentalTermSeconds,
    handleRentalTermChange,
    numDays,
    setNumDays,
}) {
    return (
        <>
            <Head>
                <title>Apply For Rent</title>
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
                        {tenantId == null ? (
                            <>
                                {wallet == 0 ? (
                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "left",
                                        }}
                                    >
                                        <Typography variant="subtitle" component="div" color="primary">
                                            You have to Log In and create a soulbound token in order to apply for rent
                                        </Typography>
                                    </CardContent>
                                ) : (
                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "left",
                                        }}
                                    >
                                        <Typography variant="body1" component="div" color="inherit">
                                            You have to create your soulbound token in order to apply for rent!
                                        </Typography>
                                        <Button color="primary" size="large" href={`/${wallet}/myrentals`}>
                                            Redirect
                                        </Button>
                                    </CardContent>
                                )}
                            </>
                        ) : (
                            <>
                                {" "}
                                <CardContent
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "left",
                                    }}
                                >
                                    <Typography variant="h5" component="div" color="primary">
                                        Apply For Rent
                                    </Typography>
                                    <br />
                                    <Typography variant="body1" component="div">
                                        My name: {tenantName}
                                    </Typography>
                                    <Typography variant="body1" component="div">
                                        My Tenant ID: {Number(tenantId)}
                                    </Typography>
                                    <br />
                                    <TextField
                                        id="filled-basic"
                                        helperText="Start Date"
                                        value={applyFormData.startDate}
                                        type="date"
                                        variant="filled"
                                        onChange={(e) =>
                                            setApplyFormData((prevData) => ({
                                                ...prevData,
                                                startDate: e.target.value,
                                            }))
                                        }
                                    />
                                    <TextField
                                        id="filled-basic"
                                        helperText="Rental Price (ETH)"
                                        fullWidth
                                        value={applyFormData.rentalPrice}
                                        variant="filled"
                                        inputProps={{
                                            color: "primary",
                                        }}
                                        onChange={(e) =>
                                            setApplyFormData((prevData) => ({
                                                ...prevData,
                                                rentalPrice: e.target.value,
                                            }))
                                        }
                                    />
                                    <br />

                                    <TextField
                                        id="filled-basic"
                                        helperText="Deposit Amount (ETH)"
                                        value={applyFormData.depositAmount}
                                        variant="filled"
                                        onChange={(e) =>
                                            setApplyFormData((prevData) => ({
                                                ...prevData,
                                                depositAmount: e.target.value,
                                            }))
                                        }
                                    />
                                    <br />

                                    <TextField
                                        id="filled-basic"
                                        helperText="Number of days this application is valid"
                                        value={applyFormData.daysValid}
                                        variant="filled"
                                        onChange={(e) =>
                                            setApplyFormData((prevData) => ({
                                                ...prevData,
                                                daysValid: e.target.value,
                                            }))
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
                                        <FormHelperText>Rental Term</FormHelperText>
                                        <br />
                                    </FormControl>
                                    {rentalTermSeconds == "custom" && (
                                        <>
                                            <TextField
                                                id="filled-basic"
                                                helperText="Number of days"
                                                value={numDays}
                                                variant="filled"
                                                onChange={() => setNumDays(numDays)}
                                            />
                                            <br />
                                        </>
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
                                        <Alert icon={<CheckIcon fontSize="inherit" />}>Application submited!</Alert>
                                    )}
                                </CardActions>
                            </>
                        )}
                    </React.Fragment>
                </Card>
            </Box>
        </>
    )
}
