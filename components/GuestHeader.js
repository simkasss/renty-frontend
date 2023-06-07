import React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import { styled, alpha } from "@mui/material/styles"
import IconButton from "@mui/material/IconButton"
import { Link } from "@mui/material"
import { useRouter } from "next/router"
import Button from "@mui/material/Button"

import LoginIcon from "@mui/icons-material/Login"
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage"

export function GuestHeader({ connectWallet }) {
    return (
        <AppBar position="static">
            <Toolbar>
                <HolidayVillageIcon fontSize="large" sx={{ ml: 11, mr: 2 }} />
                <Link href="/" color="inherit" fontSize={30} underline="none" variant="body1" sx={{ flexGrow: 1 }}>
                    Renty
                </Link>

                <Button href="/" color="inherit" variant="outlined" sx={{ mx: 1 }}>
                    HOME
                </Button>
                <Button href="/properties" color="inherit" variant="outlined" sx={{ mx: 1 }}>
                    PROPERTIES
                </Button>
                <IconButton onClick={connectWallet} edge="start" color="inherit" aria-label="menu" sx={{ mx: 1 }}>
                    <LoginIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}
