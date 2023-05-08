import { ConnectButton } from "web3uikit"
import Link from "next/link"
import { useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { useSelector } from "react-redux"
import { connectWallet, truncate, monitorWalletConnection } from "@/constants/blockchain"

export default function Header() {
    const { wallet } = useSelector((states) => states.globalStates)

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
                {wallet && (
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
                {wallet ? (
                    <button className="button-connect">{truncate(wallet, 4, 4, 10)}</button>
                ) : (
                    <button onClick={connectWallet} className="button-connect">
                        connect
                    </button>
                )}
            </div>
        </nav>
    )
}
