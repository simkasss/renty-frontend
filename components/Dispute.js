import React from "react"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import CloseIcon from "@mui/icons-material/Close"
import CheckIcon from "@mui/icons-material/Check"

export function Dispute({ dispute, solveDispute }) {
    return (
        <React.Fragment>
            <TableContainer component={Paper} sx={{ width: 300 }}>
                <Table sx={{ width: 300 }} aria-label="simple table">
                    <TableBody>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            <TableCell component="th" scope="row" align="left">
                                <Typography variant="body2" color="primary">
                                    Dispute ID {dispute.id}
                                </Typography>
                            </TableCell>
                            <TableCell align="left">
                                <Button variant="outlined" size="medium" onClick={() => solveDispute(dispute.id)}>
                                    Solve
                                </Button>
                            </TableCell>
                        </TableRow>

                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                Solved by Tenant
                            </TableCell>
                            <TableCell align="left">
                                {dispute.solvedByTenant == false ? <CloseIcon color="error" /> : <CheckIcon color="success" />}
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                Solved by Landlord
                            </TableCell>
                            <TableCell align="left">
                                {dispute.solvedByLandlord == false ? <CloseIcon color="error" /> : <CheckIcon color="success" />}
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                Description
                            </TableCell>
                            <TableCell align="left">{dispute.description}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </React.Fragment>
    )
}
