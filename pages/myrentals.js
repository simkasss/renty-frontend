import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import RentContract from "@/components/RentContract"

export default function MyRentals() {
    const [validTenantSBT, setValidTenantSBT] = useState(false)
    const [tenantName, setTenantName] = useState("")
    const [signedRentContract, setSignedRentContract] = useState(false)
    const [showRentContract, setShowRentContact] = useState(false)
    const handleSubmit = (e) => {
        e.preventDefault()
        setValidTenantSBT(true)
        // Send form data to backend
    }
    const handleRentContractClick = () => {
        setShowRentContact(!showRentContract)
    }
    return (
        <div>
            <Head>
                <title>My Rentals</title>
            </Head>
            After signing up, this page will let create a soulbound token. When the soulbound token is created, the page will show these buttons:
            {validTenantSBT ? (
                <>
                    <p>
                        <button className="button-standart">My Rent Applications</button> This page will display all made applications and their
                        statuses.
                    </p>
                    <p>
                        <button className="button-standart">My Rent History</button>This page will show rental history of a tenant.
                    </p>
                    {!signedRentContract ? (
                        <p>
                            <button className="button-standart" onClick={handleRentContractClick}>
                                My Rent Contract
                            </button>
                            This button apears when the RentContract is signed.
                            {showRentContract ? (
                                <>
                                    <RentContract />
                                    <button className="button-standart">Pay Rent</button>
                                    <button className="button-standart">Transfer Deposit</button>
                                    <button className="button-standart">Create Dispute</button>
                                    <button className="button-standart">Payment History</button>
                                </>
                            ) : (
                                ""
                            )}
                        </p>
                    ) : (
                        ""
                    )}
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-field">
                            <label>
                                Name:
                                <input type="text" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
                            </label>
                        </div>
                        <button type="submit" className="button-standart">
                            Create Soulbound Token
                        </button>
                    </form>
                </>
            )}
        </div>
    )
}
