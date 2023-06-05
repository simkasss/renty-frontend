import React from "react"

import Typography from "@mui/material/Typography"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { ethers } from "ethers"

function convertTimestampToDate(timestampInSeconds) {
    const date = new Date(timestampInSeconds * 1000)
    const year = date.getFullYear()
    const month = ("0" + (date.getMonth() + 1)).slice(-2)
    const day = ("0" + date.getDate()).slice(-2)
    return `${year}/${month}/${day}`
}

export function Payment({ payment }) {
    return (
        <React.Fragment>
            <TableContainer component={Paper} sx={{ width: 300 }}>
                <Table sx={{ width: 300 }} aria-label="simple table">
                    <TableBody>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            <TableCell component="th" scope="row" align="left">
                                <Typography variant="body2" color="primary">
                                    Payment ID {payment.id}
                                </Typography>
                            </TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>

                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                Date
                            </TableCell>
                            <TableCell align="left">{convertTimestampToDate(payment.timestamp)}</TableCell>
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                Amount (ETH)
                            </TableCell>
                            <TableCell align="left">{payment.amount / 1000000000000000000}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
    //ethers.BigNumber.from(ethers.utils.parseUnits(_rentalPrice, 18))
}
