import Link from "next/link"
import { useSelector } from "react-redux"
import { connectWallet, monitorWalletConnection } from "../constants/blockchain"

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

export function Header({ wallet }) {
    return (
        <nav className="bg-violet-900">
            <div className="container mx-auto px-4 py-5 flex justify-between items-center">
                <Link href="/" className="text-white text-lg font-bold">
                    Rent Dapp
                </Link>
                <div className="md:flex md:items-center md:space-x-4">
                    <Link href="/" className="text-gray-300 hover:text-white py-2 px-2">
                        Home
                    </Link>
                    <Link href="/properties" className="text-gray-300 hover:text-white py-2 px-2">
                        Properties
                    </Link>
                    {wallet && (
                        <>
                            <Link href={`/${wallet}/properties`} className="text-gray-300 hover:text-white py-2 px-2">
                                My Properties
                            </Link>
                            <Link href={`/${wallet}/myrentals`} className="text-gray-300 hover:text-white py-2 px-2">
                                My Rentals
                            </Link>
                            <Link href={`/${wallet}/account`} className="text-gray-300 hover:text-white py-2 px-2">
                                Account
                            </Link>
                            <Link href={`/${wallet}/messages`} className="text-gray-300 hover:text-white py-2 px-2">
                                Messages
                            </Link>
                        </>
                    )}
                    {wallet ? (
                        <button className="bg-violet-700 hover:bg-violet-800 text-white py-2 px-4 rounded">{truncate(wallet, 4, 4, 10)}</button>
                    ) : (
                        <button onClick={connectWallet} className="bg-violet-700 hover:bg-violet-800 text-white py-2 px-4 rounded">
                            Connect
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}
