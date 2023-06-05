import React from "react"
import { ethers } from "ethers"
import { structureProperty, structurePayments } from "../../utilities/structureStructs"
import networkMapping from "../../constants/networkMapping.json"
import mainContractAbi from "../../constants/MainContract.json"
import tenantManagerAbi from "../../constants/TenantManager.json"
import transfersAndDisputesAbi from "../../constants/TransfersAndDisputes.json"
import { RentHistoryCardTenant } from "../../components/RentHistoryCardTenant"

export function RentHistoryCardTenantContainer({ rentContract }) {
    const nowInSeconds = Math.floor(Date.now() / 1000)
    let status
    if (rentContract.status == 1) {
        status = "Current"
    } else if (rentContract.status == 0 && rentContract.propertyRentContractsAccepted !== property.rentContractsAccepted) {
        status = "Canceled"
    } else if (rentContract.status == 0) {
        status = "Waiting"
    } else if (rentContract.expiryTimestamp < nowInSeconds) {
        status = "Completed"
    }

    const [property, setProperty] = React.useState("")
    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [showContactDetails, setShowContactDetails] = React.useState(false)
    const [showPaymentHistory, setShowPaymentHistory] = React.useState(false)
    const [payments, setPayments] = React.useState([])

    React.useEffect(() => {
        if (typeof window == "undefined") {
            return
        }
        async function getProperty(id) {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const property = structureProperty(await contract.getProperty(id))
            return property
        }
        async function getPropertyOwner() {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const owner = await contract.getPropertyOwner(rentContract.propertyNftId)
            console.log("owner", owner)
            return owner
        }
        async function getEmail(owner) {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const email = await contract.getUserEmail(owner)
            console.log(`Email: `, email)
            setEmail(email)
        }
        async function getPhoneNumber(owner) {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const number = await contract.getUserPhoneNumber(owner)
            console.log(`Phone Number: `, number)
            setPhoneNumber(number)
        }

        async function getPaymentHistory() {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const transfersAndDisputesAddress = networkMapping["11155111"].TransfersAndDisputes[0]
            const contractAbi = transfersAndDisputesAbi
            const contract = new ethers.Contract(transfersAndDisputesAddress, contractAbi, provider)
            const payments = structurePayments(await contract.getRentContractPaymentHistory(rentContract.id))
            return payments
        }

        getPaymentHistory().then((payments) => {
            setPayments(payments)
        })

        getPropertyOwner().then((owner) => {
            getEmail(owner)
            getPhoneNumber(owner)
        })
        console.log(rentContract.propertyNftId)
        getProperty(rentContract.propertyNftId).then((property) => {
            setProperty(property)
        })
    }, [])

    function handlePaymentHistoryClick() {
        setShowPaymentHistory(!showPaymentHistory)
    }
    return (
        <RentHistoryCardTenant
            rentContract={rentContract}
            property={property}
            email={email}
            phoneNumber={phoneNumber}
            setShowContactDetails={setShowContactDetails}
            showContactDetails={showContactDetails}
            showPaymentHistory={showPaymentHistory}
            payments={payments}
            handlePaymentHistoryClick={handlePaymentHistoryClick}
        />
    )
}
