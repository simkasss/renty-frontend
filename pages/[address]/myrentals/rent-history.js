import Head from "next/head"
import Link from "next/link"
import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../../constants/networkMapping.json"
import rentAppAbi from "../../../constants/RentApp.json"
import { useSelector } from "react-redux"
import { structureTenant } from "../../../utilities/structureStructs"
import { RentContractCard } from "../../../components/RentContractCard"

export default function MyRentals() {
    const [tenant, setTenant] = React.useState("")
    const [rentHistory, setRentHistory] = React.useState([])

    React.useEffect(() => {
        async function getSbtTokenId() {
            if (typeof window !== "undefined") {
                try {
                    ethereum = window.ethereum
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const userAddress = await signer.getAddress()
                    const rentAppAddress = networkMapping["11155111"].RentApp[0]
                    const contractAbi = rentAppAbi
                    const contract = new ethers.Contract(rentAppAddress, contractAbi, signer)
                    const sbtTokenId = await contract.getSbtTokenId(userAddress)
                    console.log(`User has soulbound token. Token ID: ${sbtTokenId}`)
                    return sbtTokenId
                } catch (e) {
                    console.log(e)
                }
            }
        }
        async function getTenant(tokenId) {
            if (typeof window !== "undefined") {
                try {
                    ethereum = window.ethereum
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const rentAppAddress = networkMapping["11155111"].RentApp[0]
                    const contractAbi = rentAppAbi
                    const contract = new ethers.Contract(rentAppAddress, contractAbi, signer)
                    const tenant = structureTenant(await contract.getTenant(tokenId))

                    return tenant
                } catch (e) {
                    console.log(e)
                }
            }
        }

        getSbtTokenId().then((tokenId) => {
            getTenant(tokenId).then((tenant) => {
                setTenant(tenant)
                setRentHistory(tenant.rentHistory)
            })
        })
    }, [])

    return (
        <div>
            <Head>
                <title>My Rent History</title>
            </Head>

            <div>
                {rentHistory.map((rentContract) => (
                    <RentContractCard key={rentContract.id} rentContract={rentContract} />
                ))}
            </div>
        </div>
    )
}
