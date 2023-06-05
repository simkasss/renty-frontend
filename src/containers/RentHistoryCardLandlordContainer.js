import React from "react"
import { ethers } from "ethers"
import { structureProperty, structurePayments } from "../../utilities/structureStructs"
import networkMapping from "../../constants/networkMapping.json"
import mainContractAbi from "../../constants/MainContract.json"
import tenantManagerAbi from "../../constants/TenantManager.json"
import transfersAndDisputesAbi from "../../constants/TransfersAndDisputes.json"
import { RentHistoryCardLandlord } from "../../components/RentHistoryCardLandlord"

export function RentHistoryCardLandlordContainer({ rentContract }) {
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
        async function getProperty(id) {
            if (typeof window !== "undefined") {
                try {
                    ethereum = window.ethereum
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const mainContractAddress = networkMapping["11155111"].MainContract[0]
                    const contractAbi = mainContractAbi
                    const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
                    const property = structureProperty(await contract.getProperty(id))
                    return property
                } catch (e) {
                    console.log(e)
                }
            }
        }
        async function getTenantAddress() {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const userAddress = await signer.getAddress()
            const tenantManagerAddress = networkMapping["11155111"].TenantManager[0]
            const contractAbi = tenantManagerAbi
            const contract = new ethers.Contract(tenantManagerAddress, contractAbi, signer)
            const address = await contract.getTokenOwner(rentContract.tenantSbtId)
            return address
        }

        async function getEmail(tenant) {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const email = await contract.getUserEmail(tenant)
            console.log(`Email: `, email)
            setEmail(email)
        }
        async function getPhoneNumber(tenant) {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const number = await contract.getUserPhoneNumber(tenant)
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

        getTenantAddress().then((tenant) => {
            getEmail(tenant)
            getPhoneNumber(tenant)
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
        <RentHistoryCardLandlord
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
