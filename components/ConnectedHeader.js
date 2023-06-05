import React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Menu from "@mui/material/Menu"
import Button from "@mui/material/Button"
import { Link } from "@mui/material"
import { useRouter } from "next/router"
import ListItemIcon from "@mui/material/ListItemIcon"
import { AccountCircle } from "@mui/icons-material"
import HomeIcon from "@mui/icons-material/Home"
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage"

export function ConnectedHeader({ wallet }) {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const router = useRouter()
    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }
    const handleMenuItemClick = (path) => {
        handleMenuClose()
        router.push(path)
    }

    return (
        <AppBar position="static" sx={{ alignContent: "center", pt: 1 }}>
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

                <IconButton onClick={handleMenuOpen} edge="start" color="inherit" aria-label="menu" sx={{ mx: 1 }}>
                    <MenuIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    {/* Add your account menu options */}
                    <MenuItem onClick={() => handleMenuItemClick(`/${wallet}/myproperties`)}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        My Properties
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick(`/${wallet}/myrentals`)}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        My Rentals
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick(`/${wallet}/account`)}>
                        <ListItemIcon>
                            <AccountCircle />
                        </ListItemIcon>
                        Account
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}
