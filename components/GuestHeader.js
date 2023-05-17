import React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { styled, alpha } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import { Link } from "@mui/material"
import { useRouter } from "next/router"
import LoginIcon from "@mui/icons-material/Login"

export function GuestHeader({ connectWallet }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    RentApp
                </Typography>

                <Link href="/" color="inherit" underline="none" variant="body2" sx={{ mx: 1 }}>
                    HOME
                </Link>
                <Link href="/properties" color="inherit" underline="none" variant="body2" sx={{ mx: 1 }}>
                    PROPERTIES
                </Link>
                <IconButton onClick={connectWallet} edge="start" color="inherit" aria-label="menu" sx={{ mx: 1 }}>
                    <LoginIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}
