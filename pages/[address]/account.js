import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../constants/networkMapping.json"
import mainContractAbi from "../../constants/MainContract.json"
import transfersAndDisputesAbi from "../../constants/TransfersAndDisputes.json"
import { ContactDetails } from "../../components/ContactDetails"
import { AddContactDetails } from "../../components/AddContactDetails"
import { Balance } from "../../components/Balance"
import { useSelector } from "react-redux"

export default function account() {
    const [alert, setAlert] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const { wallet } = useSelector((states) => states.globalStates)
    const [showUpdateForm, setShowUpdateForm] = React.useState(false)
    const [balance, setBalance] = React.useState("")
    const [withdrawalAmount, setWithdrawalAmount] = React.useState("")
    const [withdrawAlert, setWithdrawAlert] = React.useState(false)
    const [withdrawLoading, setWithdrawLoading] = React.useState(false)

    React.useEffect(() => {
        if (!wallet) {
            return
        }
        async function getUserEmail() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const userAddress = await signer.getAddress()
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                const contractAbi = mainContractAbi
                const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
                const email = await contract.getUserEmail(userAddress)
                console.log(`Email: `, email)
                setEmail(email)
            }
        }
        async function getUserPhoneNumber() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const userAddress = await signer.getAddress()
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                const contractAbi = mainContractAbi
                const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
                const number = await contract.getUserPhoneNumber(userAddress)
                console.log(`Phone Number: `, number)
                setPhoneNumber(number)
            }
        }
        async function getUserBalance() {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const userAddress = await signer.getAddress()
            const transfersAndDisputesAddress = networkMapping["11155111"].TransfersAndDisputes[0]
            const contractAbi = transfersAndDisputesAbi
            const contract = new ethers.Contract(transfersAndDisputesAddress, contractAbi, provider)
            const balance = await contract.getUserBalance(userAddress)
            return Number(ethers.utils.formatEther(balance))
        }
        getUserEmail()
        getUserPhoneNumber()
        getUserBalance().then((balance) => {
            setBalance(balance)
            console.log("balance: ", balance)
        })
    }, [wallet])

    async function addContactDetails(_email, _phoneNumber) {
        if (typeof window !== "undefined") {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const addContactDetails = await contract.addContactDetails(_email, _phoneNumber)
            await addContactDetails.wait()
            console.log(`Contact Details are added`)
            setAlert(true)
        }
    }

    async function withdrawProceeds() {
        setWithdrawLoading(true)
        if (typeof window !== "undefined") {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const userAddress = await signer.getAddress()
            const transfersAndDisputesAddress = networkMapping["11155111"].TransfersAndDisputes[0]
            const contractAbi = transfersAndDisputesAbi
            const contract = new ethers.Contract(transfersAndDisputesAddress, contractAbi, signer)
            const withdrawal = await contract.withdrawProceeds(userAddress, ethers.utils.parseEther(withdrawalAmount))
            await withdrawal.wait()
            console.log(`Proceeds withdrawn`)
            setWithdrawAlert(true)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Send form data to backend
        setLoading(true)
        await addContactDetails(email, phoneNumber)
    }
    return (
        <>
            <Balance
                balance={balance}
                withdrawalAmount={withdrawalAmount}
                setWithdrawalAmount={setWithdrawalAmount}
                withdrawProceeds={withdrawProceeds}
                withdrawAlert={withdrawAlert}
                withdrawLoading={withdrawLoading}
            />
            {showUpdateForm ? (
                <AddContactDetails
                    alert={alert}
                    loading={loading}
                    email={email}
                    setEmail={setEmail}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    handleSubmit={handleSubmit}
                />
            ) : (
                <ContactDetails email={email} phoneNumber={phoneNumber} setShowUpdateForm={setShowUpdateForm} showUpdateForm={showUpdateForm} />
            )}
        </>
    )
}
