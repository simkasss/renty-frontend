import { useRouter } from "next/router"
import React from "react"
import { useSelector } from "react-redux"
import { ethers } from "ethers"
import networkMapping from "../../../../constants/networkMapping.json"
import mainContractAbi from "../../../../constants/MainContract.json"
import tenantManagerAbi from "../../../../constants/TenantManager.json"
import transfersAndDisputesAbi from "../../../../constants/TransfersAndDisputes.json"
import {
    structureProperties,
    structureRentContract,
    structureProperty,
    structurePayments,
    structureDisputes,
} from "../../../../utilities/structureStructs"
import { RentContractCardLandlord } from "../../../../components/RentContractCardLandlord"

export default function RentContract() {
    const router = useRouter()
    const { propertyId } = router.query
    const { wallet } = useSelector((states) => states.globalStates)
    const [rentContract, setRentContract] = React.useState("")
    const [property, setProperty] = React.useState("")
    const [payments, setPayments] = React.useState([])
    const [disputes, setDisputes] = React.useState([])
    const [showPaymentHistory, setShowPaymentHistory] = React.useState(false)
    const [showDisputes, setShowDisputes] = React.useState(false)
    const [disputeDescription, setDisputeDescription] = React.useState("")
    const [alert, setAlert] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [solvedLoading, setSolvedLoading] = React.useState(false)
    const [solvedAlert, setSolvedAlert] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [showContactDetails, setShowContactDetails] = React.useState(false)
    const [terminateAlert, setTerminateAlert] = React.useState(false)
    const [terminateLoading, setTerminateLoading] = React.useState(false)
    const [depositAlert, setDepositAlert] = React.useState(false)
    const [depositLoading, setDepositLoading] = React.useState(false)
    const [depositTransfered, setDepositTransfered] = React.useState(0)
    const [totalRentPaid, setTotalRentPaid] = React.useState(0)
    const [totalRequiredRentAmount, setTotalRequiredRentAmount] = React.useState(0)
    const { conversionChecked } = useSelector((states) => states.globalStates)
    React.useEffect(() => {
        if (propertyId == undefined || typeof window == "undefined") {
            return
        }
        async function getContract() {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, provider)
            return contract
        }
        async function getRentContract(contract) {
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const userAddress = await signer.getAddress()
            const userProperties = structureProperties(await contract.getUserProperties(userAddress))
            console.log(userProperties)
            const property = userProperties.filter((property) => property.propertyNftId == propertyId)[0]
            console.log(property)
            const rentContractId = property.rentContractId
            const rentContract = structureRentContract(await contract.getRentContract(rentContractId))
            console.log(rentContract)
            return rentContract
        }

        async function getProperty(contract) {
            const property = structureProperty(await contract.getProperty(propertyId))
            console.log("Property", property)
            return property
        }
        async function getDisputes(rentContractId) {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const transfersAndDisputesAddress = networkMapping["11155111"].TransfersAndDisputes[0]
            const contractAbi = transfersAndDisputesAbi
            const contract = new ethers.Contract(transfersAndDisputesAddress, contractAbi, provider)
            const disputes = await contract.getRentContractDisputes(rentContractId)
            const structuredDisputes = structureDisputes(disputes)
            console.log("disputes: ", structuredDisputes)
            return structuredDisputes
        }
        async function getTenantAddress(rentContract) {
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

        async function getDeposit(rentContract) {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const transfersAndDisputesAddress = networkMapping["11155111"].TransfersAndDisputes[0]
            const contractAbi = transfersAndDisputesAbi
            const contract = new ethers.Contract(transfersAndDisputesAddress, contractAbi, signer)
            console.log("rentContract.propertyNftId", rentContract.propertyNftId)
            const transferedDepositAmount = await contract.getDeposit(rentContract.id)
            console.log("Transfered Deposit Amount: ", ethers.utils.formatEther(transferedDepositAmount))
            return ethers.utils.formatEther(transferedDepositAmount)
        }
        async function getPaidRent(rentContract) {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const transfersAndDisputesAddress = networkMapping["11155111"].TransfersAndDisputes[0]
            const contractAbi = transfersAndDisputesAbi
            const contract = new ethers.Contract(transfersAndDisputesAddress, contractAbi, signer)
            const totalPaid = await contract.getAmountOfPaidRent(rentContract.id)
            console.log("Total Paid Rent: ", ethers.utils.formatEther(totalPaid))
            return ethers.utils.formatEther(totalPaid)
        }

        async function getRequiredPaidAmount(rentContract) {
            const nowTimestampInSeconds = Math.floor(Date.now() / 1000)

            const requiredPaidAmount = (
                ((nowTimestampInSeconds - rentContract.startTimestamp) / 60 / 60 / 24 / 30) *
                rentContract.rentalPrice
            ).toFixed(5)

            return Number(requiredPaidAmount)
        }

        getContract().then((contract) => {
            getRentContract(contract)
                .then((rentContract) => {
                    setRentContract(rentContract)
                    getTenantAddress(rentContract).then((tenant) => {
                        getEmail(tenant)
                        getPhoneNumber(tenant)
                    })
                    getDeposit(rentContract).then((deposit) => setDepositTransfered(deposit))
                    getPaidRent(rentContract).then((paidRent) => setTotalRentPaid(paidRent))
                    getRequiredPaidAmount(rentContract).then((totalRequired) => setTotalRequiredRentAmount(totalRequired))
                    getDisputes(rentContract.id).then((disputes) => setDisputes(disputes))
                })
                .then(
                    getProperty(contract).then((property) => {
                        setProperty(property)
                    })
                )
        })
    }, [propertyId])

    async function getPaymentHistory() {
        ethereum = window.ethereum
        const provider = new ethers.providers.Web3Provider(ethereum)
        const transfersAndDisputesAddress = networkMapping["11155111"].TransfersAndDisputes[0]
        const contractAbi = transfersAndDisputesAbi
        const contract = new ethers.Contract(transfersAndDisputesAddress, contractAbi, provider)

        const payments = structurePayments(await contract.getRentContractPaymentHistory(rentContract.id))
        console.log(payments)
        setPayments(payments)

        return payments
    }
    function handleShowDisputes() {
        setShowDisputes(!showDisputes)
    }
    async function handleCreateDisputeSubmit() {
        setLoading(true)
        ethereum = window.ethereum
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const transfersAndDisputesAddress = networkMapping["11155111"].TransfersAndDisputes[0]
        const contractAbi = transfersAndDisputesAbi
        const contract = new ethers.Contract(transfersAndDisputesAddress, contractAbi, signer)
        const createDispute = await contract.createDispute(rentContract.id, disputeDescription)
        await createDispute.wait()
        setAlert(true)
        console.log("dispute", disputeDescription)
    }
    async function solveDispute(disputeId) {
        setSolvedLoading(true)
        ethereum = window.ethereum
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const transfersAndDisputesAddress = networkMapping["11155111"].TransfersAndDisputes[0]
        const contractAbi = transfersAndDisputesAbi
        const contract = new ethers.Contract(transfersAndDisputesAddress, contractAbi, signer)
        const solveDispute = await contract.solveDispute(rentContract.id, disputeId)
        await solveDispute.wait()
        console.log("solved")
        setSolvedAlert(true)
    }
    async function terminateRentContract() {
        setTerminateLoading(true)
        ethereum = window.ethereum
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const mainContractAddress = networkMapping["11155111"].MainContract[0]
        const contractAbi = mainContractAbi
        const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
        const terminate = await contract.terminateRentContract(propertyId, rentContract.id)
        await terminate.wait()
        setTerminateAlert(true)
        router.push(`/${wallet}/myproperties/${propertyId}/rent-history`)
    }

    function handlePaymentHistoryClick() {
        setShowPaymentHistory(!showPaymentHistory)
        getPaymentHistory()
    }

    return (
        <>
            <RentContractCardLandlord
                rentContract={rentContract}
                property={property}
                showPaymentHistory={showPaymentHistory}
                handlePaymentHistoryClick={handlePaymentHistoryClick}
                payments={payments}
                handleShowDisputes={handleShowDisputes}
                disputeDescription={disputeDescription}
                setDisputeDescription={setDisputeDescription}
                showDisputes={showDisputes}
                alert={alert}
                loading={loading}
                disputes={disputes}
                solveDispute={solveDispute}
                handleCreateDisputeSubmit={handleCreateDisputeSubmit}
                solvedLoading={solvedLoading}
                solvedAlert={solvedAlert}
                showContactDetails={showContactDetails}
                setShowContactDetails={setShowContactDetails}
                email={email}
                phoneNumber={phoneNumber}
                terminateAlert={terminateAlert}
                terminateLoading={terminateLoading}
                terminateRentContract={terminateRentContract}
                depositAlert={depositAlert}
                depositLoading={depositLoading}
                depositTransfered={depositTransfered}
                totalRentPaid={totalRentPaid}
                totalRequiredRentAmount={totalRequiredRentAmount}
                conversionChecked={conversionChecked}
            ></RentContractCardLandlord>
        </>
    )
}
