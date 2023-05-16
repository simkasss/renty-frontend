import Head from "next/head"
import Link from "next/link"
import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../../../constants/networkMapping.json"
import rentAppAbi from "../../../../constants/RentApp.json"
import { useSelector } from "react-redux"
import { structureTenant, structureRentContract } from "../../../../utilities/structureStructs"

import { useRouter } from "next/router"

async function getContract() {
    if (typeof window !== "undefined") {
        ethereum = window.ethereum
        const provider = new ethers.providers.Web3Provider(ethereum)
        const rentAppAddress = networkMapping["11155111"].RentApp[0]
        const contractAbi = rentAppAbi
        const contract = new ethers.Contract(rentAppAddress, contractAbi, provider)
        return contract
    }
}

export default function RentContract() {
    const router = useRouter()
    const [rentContract, setRentContract] = React.useState("")
    const { wallet } = useSelector((states) => states.globalStates)
    const { rentContractId } = router.query
    const [depositTransfered, setDepositTransfered] = React.useState(0)
    const [totalRentPaid, setTotalRentPaid] = React.useState(0)
    const [totalRequiredRentAmount, setTotalRequiredRentAmount] = React.useState(0)

    React.useEffect(() => {
        async function getRentContract(contract) {
            const rentContract = structureRentContract(await contract.getRentContract(rentContractId))
            console.log("Rent Contract: ", rentContract)
            setRentContract(rentContract)
        }

        async function getDeposit(contract) {
            //need to deploy new contract for this to work
            //const transferedDepositAmount = await contract.getDeposit(rentContract.propertyNftId)
            // console.log("Transfered Deposit Amount: ", transferedDepositAmount)
            // setDepositTransfered(transferedDepositAmount)
        }
        async function getPaidRent(contract) {
            //need to deploy new contract for this to work
            //    const totalPaid = await contract.getAmountOfPaidRent(rentContract.id)
            //    setTotalRentPaid(totalPaid)
        }
        async function getRequiredPaidAmount() {
            const requiredPaidAmount = rentContract
        }

        getContract().then((contract) => {
            getRentContract(contract)
            getDeposit(contract)
            getPaidRent(contract)
        })
    }, [])

    async function transferDeposit() {
        const contract = await getContract()
        const transaction = await contract.transferSecurityDeposit(rentContract.propertyNftId, rentContract.id, {
            value: ethers.utils.parseEther(rentContract.depositAmount),
        })
        await transaction.wait()
        console.log("Transaction complete:", transaction.hash)
    }
    async function payRent() {
        const contract = await getContract()
        const transaction = await contract.transferRent(rentContract.propertyNftId, rentContract.id, {
            value: ethers.utils.parseEther(rentContract.rentalPrice),
        })
        await transaction.wait()
        console.log("Transaction complete:", transaction.hash)
    }

    function convertTimestampToDate(timestampInSeconds) {
        const date = new Date(timestampInSeconds * 1000)
        const year = date.getFullYear()
        const month = ("0" + (date.getMonth() + 1)).slice(-2)
        const day = ("0" + date.getDate()).slice(-2)
        return `${year}/${month}/${day}`
    }
    const nowInSeconds = Math.floor(Date.now() / 1000)

    async function handleTransferDepositClick() {
        await transferDeposit()
        console.log("Deposit transfered!")
    }

    async function handlePayRentClick() {
        await payRent()
        console.log("Rent Paid!")
    }

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
                            <div className="detail-label">Rental Term:</div>
                            <div className="detail-value">{rentContract.rentalTerm / 60 / 60 / 24} days</div>
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
                            <div className="detail-value">{convertTimestampToDate(rentContract.startTimestamp)}</div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-label">Expiration day:</div>
                            <div className="detail-value">{convertTimestampToDate(rentContract.expiryTimestamp)}</div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-label">Hash of Terms and Conditions:</div>
                            <div className="detail-value">{/* ADD HASH HERE */}</div>
                        </div>
                        <div className="detail-row">
                            <div className="detail-label">Have disputes:</div>
                            <div className="detail-value"> HOW SHOULD WE MANAGE DISPUTES? </div>
                        </div>
                        {depositTransfered >= rentContract.depositAmount ? (
                            <>
                                <div className="detail-row">
                                    <div className="detail-label">Deposit is transfered</div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Total rent paid:</div>
                                    <div className="detail-value"> {totalRentPaid} - Here should be amount already paid </div>
                                </div>
                                <div className="detail-row">
                                    <div className="detail-label">Total required amount of paid rent:</div>
                                    <div className="detail-value"> {totalRequiredRentAmount} - Here should be amount needed to be paid </div>
                                </div>
                                {totalRentPaid < totalRequiredRentAmount ? (
                                    <div className="detail-row">
                                        <div className="detail-label"> You need to pay rent! </div>
                                    </div>
                                ) : (
                                    <></>
                                )}
                            </>
                        ) : (
                            <button className="button-standart" onClick={handleTransferDepositClick}>
                                Transfer Deposit
                            </button>
                        )}

                        <button className="button-standart" onClick={handlePayRentClick}>
                            Pay Rent
                        </button>
                        <button className="button-standart">Contact Landlord</button>
                        <Link className="button-standart" href={`/${wallet}/myrentals/${rentContractId}/payment-history`}>
                            Payment History{" "}
                        </Link>
                        <button className="button-standart">Create Dispute</button>
                    </div>
                </div>
            </div>
        </>
    )
}
