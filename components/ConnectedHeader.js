import React from "react"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Menu from "@mui/material/Menu"
import { Link } from "@mui/material"
import { useRouter } from "next/router"
import ListItemIcon from "@mui/material/ListItemIcon"
import { Settings, AccountCircle, ExitToApp } from "@mui/icons-material"
import SendIcon from "@mui/icons-material/Send"
import HomeIcon from "@mui/icons-material/Home"

//WE NEED DISCONECT WALLET FUNCTION

const truncate = (text, startChars, endChars, maxLength) => {
    if (text.length > maxLength) {
        let start = text.substring(0, startChars)
        let end = text.substring(text.length - endChars, text.length)
        while (start.length + end.length < maxLength) {
            start = start + "."
        }
        return start + end
    }
    return text
}

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

                <IconButton onClick={handleMenuOpen} edge="start" color="inherit" aria-label="menu" sx={{ mx: 1 }}>
                    <MenuIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    {/* Add your account menu options */}
                    <MenuItem onClick={() => handleMenuItemClick(`/${wallet}/properties`)}>
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
                    <MenuItem onClick={() => handleMenuItemClick(`/${wallet}/messages`)}>
                        <ListItemIcon>
                            <SendIcon />
                        </ListItemIcon>
                        Messages
                    </MenuItem>
                    <MenuItem onClick={() => handleMenuItemClick(`/${wallet}/settings`)}>
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem /*onClick={}*/>
                        <ListItemIcon>
                            <ExitToApp />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}
