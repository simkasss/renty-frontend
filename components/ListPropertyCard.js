import Head from "next/head"
import Link from "next/link"
import { useState } from "react"

export default function ListPropertyCard({ property }) {
    const propertyNftId = property.propertyNftId
    const [name, setName] = useState(property.name)
    const [description, setDescription] = useState(property.description)
    const [rentalTerm, setRentalTerm] = useState(property.rentalTerm)
    const [rentalPrice, setRentalPrice] = useState(property.rentalPrice)
    const [depositAmount, setDepositAmount] = useState(property.depositAmount)
    const [hashOfRentalAggreement, setHashOfRentalAggreement] = useState(property.hashOfRentalAggreement)
    const rentContractsAccepted = property.rentContractsAccepted

    const handleSubmit = (e) => {
        e.preventDefault()
        // Send form data to backend
    }
    return (
        <div>
            <Link href="/myproperties" className="button-standart">
                Go Back
            </Link>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-field">
                    <label>
                        Name:
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                </div>
                <div className="form-field">
                    <label>
                        Description:
                        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </label>
                </div>
                <label>
                    Rental Term:
                    <input type="text" value={rentalTerm} onChange={(e) => setRentalTerm(e.target.value)} />
                </label>
                <label>
                    Rental Price:
                    <input type="text" value={rentalPrice} onChange={(e) => setRentalPrice(e.target.value)} />
                </label>
                <label>
                    Deposit Amount:
                    <input type="text" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                </label>
                <label>
                    Hash of rental agreement :
                    <input type="text" value={hashOfRentalAggreement} onChange={(e) => setHashOfRentalAggreement(e.target.value)} />
                </label>
                <div className="form-field">
                    <label>Property NFT id: {propertyNftId}</label>
                </div>
                <label>Rent Contracts Accepted: {rentContractsAccepted} </label>
                <button type="submit" className="button-standart">
                    List for Rent
                </button>
            </form>
        </div>
    )
}
