import React from "react"
import Link from "next/link"
import { ethers } from "ethers"
import { useRouter } from "next/router"
import networkMapping from "../constants/networkMapping.json"
import rentAppAbi from "../constants/RentApp.json"
import { useSelector } from "react-redux"
import { structureRentContracts, structureProperty } from "../utilities/structureStructs"

export function RentContractApplicationCard({ rentContract }) {
    let status
    if (rentContract.status === 0) {
        status = "Waiting"
    } else if (rentContract.status === 1) {
        status = "Confirmed"
    } else {
        status = "Canceled"
    }
    const router = useRouter()
    async function acceptContract() {
        if (typeof window !== "undefined") {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const rentAppAddress = networkMapping["11155111"].RentApp[0]
            const contractAbi = rentAppAbi
            const contract = new ethers.Contract(rentAppAddress, contractAbi, signer)
            await contract.acceptRentContract(rentContract.propertyNftId, rentContract.id)

            await router.replace(router.asPath)
        }
    }

    const handleAcceptClick = async () => {
        await acceptContract()
        console.log("Contract ", rentContract.id, " accepted!")
    }

    return (
        <div className="rent-contract-card">
            <div className="contract-info">
                <h2 className="contract-title">{`Rent Contract No. ${rentContract.id}`}</h2>
                <div className="contract-details">
                    <div className="detail-row">
                        <div className="detail-label">Property NFT id:</div>
                        <div className="detail-value">{rentContract.propertyNftId}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Tenant:</div>
                        <div className="detail-value">{rentContract.tenantSbtId}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Rental Term:</div>
                        <div className="detail-value">{rentContract.rentalTerm}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Rental Price:</div>
                        <div className="detail-value">{rentContract.rentalPrice} ETH</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Deposit Amount:</div>
                        <div className="detail-value">{rentContract.depositAmount} ETH</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Start Date:</div>
                        <div className="detail-value">{rentContract.startDate}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Status:</div>
                        <div className="detail-value status">{status}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Hash of Terms and Conditions:</div>
                        <div className="detail-value">{/* ADD HASH HERE */}</div>
                    </div>
                    <button className="button-sign"> Contact Tenant</button>
                    <button className="button-sign" onClick={handleAcceptClick}>
                        Accept Contract
                    </button>
                </div>
            </div>
        </div>
    )
}

export function RentContractApplicationCard2({ rentContract }) {
    const [property, setProperty] = React.useState("")
    let status

    React.useState(() => {
        async function getProperty() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const rentAppAddress = networkMapping["11155111"].RentApp[0]
                const contractAbi = rentAppAbi
                const contract = new ethers.Contract(rentAppAddress, contractAbi, provider)
                //deploy new contract for this to work
                console.log("....")
                console.log("This should be a contract: ", contract)
                console.log(rentContract.propertyNftId)
                const property = structureProperty(await contract.getProperty(rentContract.propertyNftId))
                console.log("Property", property)
                return property
            }
        }

        getProperty().then((property) => {
            setProperty(property)
        })
    }, [])

    if (rentContract.status == 1) {
        status = "Confirmed"
    } else if (rentContract.status == 0 && rentContract.propertyRentContractsAccepted !== property.rentContractsAccepted) {
        status = "Canceled"
    } else if (rentContract.status == 0) {
        status = "Waiting"
    }

    return (
        <div className="rent-contract-card">
            <div className="contract-info">
                <h2 className="contract-title">{`Rent Contract No. ${rentContract.id}`}</h2>
                <div className="contract-details">
                    <div className="detail-row">
                        <div className="detail-label">Property NFT id:</div>
                        <div className="detail-value">{rentContract.propertyNftId}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Tenant:</div>
                        <div className="detail-value">{rentContract.tenantSbtId}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Rental Term:</div>
                        <div className="detail-value">{rentContract.rentalTerm}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Rental Price:</div>
                        <div className="detail-value">{rentContract.rentalPrice} ETH</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Deposit Amount:</div>
                        <div className="detail-value">{rentContract.depositAmount} ETH</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Start Date:</div>
                        <div className="detail-value">{rentContract.startDate}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Status:</div>
                        <div className="detail-value status">{status}</div>
                    </div>
                    <div className="detail-row">
                        <div className="detail-label">Hash of Terms and Conditions:</div>
                        <div className="detail-value">{/* ADD HASH HERE */}</div>
                    </div>
                    <button className="button-sign"> Contact Landlord</button>
                </div>
            </div>
        </div>
    )
}
