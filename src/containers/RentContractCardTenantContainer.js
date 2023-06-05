import React from "react"
import { ethers } from "ethers"
import { RentContractCardTenant } from "../../components/RentContractCardTenant"
import { structureProperty, structureRentContract, structurePayments, structureDisputes } from "../../utilities/structureStructs"
import networkMapping from "../../constants/networkMapping.json"
import mainContractAbi from "../../constants/MainContract.json"
import transfersAndDisputesAbi from "../../constants/TransfersAndDisputes.json"
import { useRouter } from "next/router"

export function RentContractCardTenantContainer({ rentContract }) {
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
    const [transferDepositLoading, setTransferDepositLoading] = React.useState(false)
    const [transferDepositdAlert, setTransferDepositAlert] = React.useState(false)
    const [depositTransfered, setDepositTransfered] = React.useState(0)
    const [totalRentPaid, setTotalRentPaid] = React.useState(0)
    const [totalRequiredRentAmount, setTotalRequiredRentAmount] = React.useState(0)
    const [payLoading, setPayLoading] = React.useState(false)
    const [payAlert, setPayAlert] = React.useState(false)
    const [terminateLoading, setTerminateLoading] = React.useState(false)
    const [terminateAlert, setTerminateAlert] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [showContactDetails, setShowContactDetails] = React.useState(false)
    const [depositReleasePermission, setDepositReleasePermission] = React.useState(false)

    async function getMainContract() {
        ethereum = window.ethereum
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const mainContractAddress = networkMapping["11155111"].MainContract[0]
        const contractAbi = mainContractAbi
        const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
        return contract
    }

    async function getTransfersAndDisputesContract() {
        ethereum = window.ethereum
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const transfersAndDisputesAddress = networkMapping["11155111"].TransfersAndDisputes[0]
        const contractAbi = transfersAndDisputesAbi
        const contract = new ethers.Contract(transfersAndDisputesAddress, contractAbi, signer)
        return contract
    }

    React.useEffect(() => {
        if (rentContract == undefined || typeof window == "undefined") {
            return
        }

        async function getProperty(contract) {
            const property = structureProperty(await contract.getProperty(rentContract.propertyNftId))

            return property
        }

        async function getDisputes(contract) {
            const disputes = await contract.getRentContractDisputes(rentContract.id)
            const structuredDisputes = structureDisputes(disputes)
            return structuredDisputes
        }

        async function getDeposit(contract) {
            console.log("rentContract.propertyNftId", rentContract.propertyNftId)
            const transferedDepositAmount = await contract.getDeposit(rentContract.id)
            console.log("Transfered Deposit Amount: ", ethers.utils.formatEther(transferedDepositAmount))
            return ethers.utils.formatEther(transferedDepositAmount)
        }
        async function getPaidRent(contract) {
            const totalPaid = await contract.getAmountOfPaidRent(rentContract.id)
            console.log("Total Paid Rent: ", ethers.utils.formatEther(totalPaid))
            return ethers.utils.formatEther(totalPaid)
        }

        async function getRequiredPaidAmount() {
            const nowTimestampInSeconds = Math.floor(Date.now() / 1000)

            const requiredPaidAmount = (
                ((nowTimestampInSeconds - rentContract.startTimestamp) / 60 / 60 / 24 / 30) *
                rentContract.rentalPrice
            ).toFixed(5)

            return Number(requiredPaidAmount)
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

        async function getDepositReleasePermission(contract) {
            const bool = await contract.depositReleasePermission(rentContract.id)
            return bool
        }

        getPropertyOwner().then((owner) => {
            getEmail(owner)
            getPhoneNumber(owner)
        })

        getMainContract().then((contract) => {
            getProperty(contract).then((property) => {
                setProperty(property)
            })
        })

        getTransfersAndDisputesContract()
            .then((contract) => {
                getDisputes(contract).then((disputes) => setDisputes(disputes))
                getDeposit(contract).then((deposit) => setDepositTransfered(deposit))
                getPaidRent(contract).then((paidRent) => setTotalRentPaid(paidRent))
                getDepositReleasePermission(contract).then((bool) => {
                    console.log(bool)
                    setDepositReleasePermission(bool)
                })
                getRequiredPaidAmount().then((totalRequired) => setTotalRequiredRentAmount(totalRequired))
            })
            .catch((e) => {
                console.log(e)
            })
    }, [rentContract, window])

    return (
        <RentContractCardTenant
            {...{
                rentContract,
                property,
                handlePaymentHistoryClick,
                payments,
                showPaymentHistory,
                showDisputes,
                handleShowDisputes,
                disputeDescription,
                setDisputeDescription,
                alert,
                loading,
                handleCreateDisputeSubmit,
                disputes,
                solveDispute,
                solvedLoading,
                solvedAlert,
                depositTransfered,
                totalRentPaid,
                totalRequiredRentAmount,
                transferDeposit,
                payRent,
                transferDepositLoading,
                transferDepositdAlert,
                payLoading,
                payAlert,
                handleTerminate,
                terminateLoading,
                terminateAlert,
                email,
                phoneNumber,
                setShowContactDetails,
                showContactDetails,
                depositReleasePermission,
                releaseDeposit,
                nowTimestampInSeconds,
            }}
        />
    )
}
