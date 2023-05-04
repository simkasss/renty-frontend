import { ConnectButton } from "web3uikit"
import Link from "next/link"
import { useMoralis } from "react-moralis"
import { useState, useEffect } from "react"

export default function Header() {
    //WHY IS THIS NOT WORKING
    const { isAuthenticated, logout } = useMoralis()
    const [authenticated, setAuthenticated] = useState(isAuthenticated)

    useEffect(() => {
        setAuthenticated(isAuthenticated)
    }, [isAuthenticated])

    return (
        <nav className="nav-bar">
            <h1>Rent Dapp</h1>
            <div className="container mx-auto px-4 py-5 md:flex md:justify-between md:items-center ml-4">
                <Link href="/" className="nav-link">
                    Home
                </Link>
                <Link href="/properties" className="nav-link">
                    Apartments
                </Link>
                {!authenticated && (
                    <>
                        <Link href="/myproperties" className="nav-link">
                            My Properties
                        </Link>
                        <Link href="/myrentals" className="nav-link">
                            My Rentals
                        </Link>
                        <Link href="/account" className="nav-link">
                            Account
                        </Link>
                        <Link href="/messages" className="nav-link">
                            Messages
                        </Link>
                    </>
                )}
                <ConnectButton moralisAuth={false} />
                {!authenticated && (
                    <button className="logout-button" onClick={() => logout()}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    )
}
