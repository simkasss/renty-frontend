import Head from "next/head"
import Link from "next/link"
import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../../constants/networkMapping.json"
import rentAppAbi from "../../../constants/RentApp.json"
import { useSelector } from "react-redux"
import { structureTenant } from "../../../utilities/structureStructs"
import { RentContractCard } from "../../../components/RentContractCard"

export default function RentContract() {
    const router = useRouter()
    const [rentContract, setRentContract] = React.useState("")
    const { wallet } = useSelector((states) => states.globalStates)

    React.useEffect(() => {
        async function getRentContract() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const userAddress = await signer.getAddress()
                const rentAppAddress = networkMapping["11155111"].RentApp[0]
                const contractAbi = rentAppAbi
                const contract = new ethers.Contract(rentAppAddress, contractAbi, provider)
                const sbtTokenId = await contract.getSbtTokenId(userAddress)
                const tenantRentContracts = structureRentContracts(await contract.getTenantRentContracts(sbtTokenId))
                const rentContract = tenantRentContracts.filter((contract) => contract.status === 1)
                return rentContract
            }
        }

        getRentContract().then((contract) => {
            setRentContract(contract)
        })
    }, [])

    return (
        <>
            <div>
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
                            <div className="detail-label">Hash of Terms and Conditions:</div>
                            <div className="detail-value">{/* ADD HASH HERE */}</div>
                        </div>
                        <button className="button-standart">Transfer Deposit</button>
                        <button className="button-standart">Pay Rent</button>
                        <button className="button-standart">Contact Landlord</button>
                        <button className="button-standart">Payment History</button>
                        <button className="button-standart">Create Dispute</button>
                    </div>
                </div>
            </div>
        </>
    )
}
