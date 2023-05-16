import Head from "next/head"
import Link from "next/link"
import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../../../constants/networkMapping.json"
import rentAppAbi from "../../../../constants/RentApp.json"
import { structurePayments } from "../../../../utilities/structureStructs"
import { useRouter } from "next/router"

export default function PaymentHistory() {
    const [paymentHistory, setPaymentHistory] = React.useState([])
    const router = useRouter()
    const { rentContractId } = router.query

    React.useEffect(() => {
        async function getPaymentHistory() {
            if (typeof window !== "undefined") {
                try {
                    ethereum = window.ethereum
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const rentAppAddress = networkMapping["11155111"].RentApp[0]
                    const contractAbi = rentAppAbi
                    const contract = new ethers.Contract(rentAppAddress, contractAbi, signer)
                    const paymentHistory = structurePayments(await contract.getRentContractPaymentHistory(rentContractId))
                    console.log(`Payment History: ${paymentHistory}`)
                    return paymentHistory
                } catch (e) {
                    console.log(e)
                }
            }
        }

        getPaymentHistory().then((paymentHistory) => {
            setPaymentHistory(paymentHistory)
        })
    }, [])

    return (
        <div>
            <Head>
                <title>Payment History</title>
            </Head>

            <div>
                {paymentHistory.map((payment) => {
                    ;<>
                        <div>{payment.name}</div>
                        <div>Date: {payment.timestamp}</div>
                        <div>Amount: {payment.amount}</div>
                    </>
                })}
            </div>
        </div>
    )
}
