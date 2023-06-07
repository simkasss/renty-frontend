import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../../../constants/networkMapping.json"
import mainContractAbi from "../../../../constants/MainContract.json"
import transfersAndDisputesAbi from "../../../../constants/TransfersAndDisputes.json"
import { useSelector } from "react-redux"
import { structureProperty, structureRentContract, structurePayments, structureDisputes } from "../../../../utilities/structureStructs"
import { useRouter } from "next/router"
import { RentContractCardTenant } from "../../../../components/RentContractCardTenant"

async function getProperty(rentContract) {
    ethereum = window.ethereum
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const mainContractAddress = networkMapping["11155111"].MainContract[0]
    const contractAbi = mainContractAbi
    const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
    const property = structureProperty(await contract.getProperty(rentContract.propertyNftId))
    return property
}

async function getDisputes({ rentContract, transfersAndDisputesContract }) {
    const disputes = await transfersAndDisputesContract.getRentContractDisputes(rentContract.id)
    console.log("disputes", disputes)
    const structuredDisputes = structureDisputes(disputes)
    return structuredDisputes
}

async function getDeposit({ rentContract, transfersAndDisputesContract }) {
    console.log("rentContract.id", rentContract.id)
    console.log("rentContract", rentContract)
    const transferedDepositAmount = await transfersAndDisputesContract.getDeposit(rentContract.id)
    console.log("Transfered Deposit Amount: ", ethers.utils.formatEther(transferedDepositAmount))
    return ethers.utils.formatEther(transferedDepositAmount)
}

async function getPaidRent({ rentContract, transfersAndDisputesContract }) {
    const totalPaid = await transfersAndDisputesContract.getAmountOfPaidRent(rentContract.id)
    console.log("Total Paid Rent: ", ethers.utils.formatEther(totalPaid))
    return ethers.utils.formatEther(totalPaid)
}

async function getDepositReleasePermission({ rentContract, transfersAndDisputesContract }) {
    const bool = await transfersAndDisputesContract.depositReleasePermission(rentContract.id)
    return bool
}

export default function RentContract() {
    const [rentContract, setRentContract] = React.useState(null)
    const router = useRouter()
    const { rentContractId } = router.query
    const [property, setProperty] = React.useState("")
    const [payments, setPayments] = React.useState([])
    const [disputes, setDisputes] = React.useState([])
    const { conversionChecked } = useSelector((states) => states.globalStates)
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
    const { wallet } = useSelector((states) => states.globalStates)

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
        if (typeof window === "undefined" || rentContractId === undefined) {
            return
        }

        async function getRentContract(contract) {
            const rentContract = structureRentContract(await contract.getRentContract(rentContractId))
            return rentContract
        }

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

        async function getRequiredPaidAmount(rentContract) {
            const nowTimestampInSeconds = Math.floor(Date.now() / 1000)

            const requiredPaidAmount = (
                ((nowTimestampInSeconds - rentContract.startTimestamp) / 60 / 60 / 24 / 30) *
                rentContract.rentalPrice
            ).toFixed(5)

            return Number(requiredPaidAmount)
        }

        async function getPropertyOwner(rentContract) {
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

        getMainContract().then((mainContract) => {
            getRentContract(mainContract)
                .then((rentContract) => {
                    console.log("Rent Contract: ", rentContract)
                    setRentContract(rentContract)
                    getProperty(rentContract).then((property) => {
                        setProperty(property)
                    })
                    getPropertyOwner(rentContract).then((owner) => {
                        getEmail(owner)
                        getPhoneNumber(owner)
                    })

                    getTransfersAndDisputesContract()
                        .then((transfersAndDisputesContract) => {
                            getDisputes({ rentContract, transfersAndDisputesContract }).then((disputes) => setDisputes(disputes))
                            console.log(disputes, "disputes")
                            getDeposit({ rentContract, transfersAndDisputesContract }).then((deposit) => setDepositTransfered(deposit))
                            getPaidRent({ rentContract, transfersAndDisputesContract }).then((paidRent) => setTotalRentPaid(paidRent))
                            getDepositReleasePermission({ rentContract, transfersAndDisputesContract }).then((bool) => {
                                console.log(bool)
                                setDepositReleasePermission(bool)
                            })
                            getRequiredPaidAmount(rentContract).then((requiredPaidAmount) => setTotalRequiredRentAmount(requiredPaidAmount))
                        })

                        .catch((e) => {
                            console.log(e)
                        })
                })
                .catch((e) => console.log(e))
        })
    }, [rentContractId])

    const nowTimestampInSeconds = Math.floor(Date.now() / 1000)

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
    async function transferDeposit() {
        setTransferDepositLoading(true)
        const contract = await getTransfersAndDisputesContract()

        const transaction = await contract.transferSecurityDeposit(rentContract.propertyNftId, rentContract.id, {
            value: ethers.utils.parseEther(rentContract.depositAmount),
        })
        await transaction.wait()

        console.log("Deposit transfered!")
        setTransferDepositAlert(true)
    }

    async function payRent() {
        setPayLoading(true)
        const contract = await getTransfersAndDisputesContract()
        const transaction = await contract.transferRent(rentContract.propertyNftId, rentContract.id, {
            value: ethers.utils.parseEther(rentContract.rentalPrice),
        })
        await transaction.wait()
        console.log("Rent Paid!")
        setPayAlert(true)
    }

    async function handleTerminate() {
        setTerminateLoading(true)
        const contract = await getMainContract()
        const disputesContract = await getTransfersAndDisputesContract()
        const createDispute = await disputesContract.createDispute(rentContract.id, "Contract was terminated before expiry date")
        await createDispute.wait()
        await contract.terminateRentContract(rentContract.propertyNftId, rentContract.id)
        setTerminateAlert(true)
        router.push(`/${wallet}/myrentals/rent-history`)
    }

    function handlePaymentHistoryClick() {
        setShowPaymentHistory(!showPaymentHistory)
        getPaymentHistory()
    }

    return (
        rentContract && (
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
                    nowTimestampInSeconds,
                    conversionChecked,
                }}
            />
        )
    )
}
