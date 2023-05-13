import { useRouter } from "next/router"
import React from "react"
import { useSelector } from "react-redux"
import { ethers } from "ethers"
import networkMapping from "../../../../constants/networkMapping.json"
import rentAppAbi from "../../../../constants/RentApp.json"
import { structureProperties, structureRentContract } from "../../../../utilities/structureStructs"

export default function RentContract() {
    const router = useRouter()
    const { propertyId: id } = router.query
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
                const userProperties = structureProperties(await contract.getUserProperties(userAddress))
                const property = userProperties.filter((property) => property.propertyNftId == id)
                const rentContractId = property[0].rentContractId
                //deploy a new contract for this to work
                const rentContract = structureRentContract(await contract.getRentContract(rentContractId))
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

                        <button className="button-standart">Contact Tenant</button>
                        <button className="button-standart">Payment History</button>
                        <button className="button-standart">Create Dispute</button>
                    </div>
                </div>
            </div>
        </>
    )
}
