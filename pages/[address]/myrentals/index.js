import Head from "next/head"
import Link from "next/link"
import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../../constants/networkMapping.json"
import rentAppAbi from "../../../constants/RentApp.json"
import { useSelector } from "react-redux"
import { structureTenant } from "../../../utilities/structureStructs"

export default function MyRentals() {
    const { wallet } = useSelector((states) => states.globalStates)
    const [tenantSBT, setTenantSBT] = React.useState("")
    const [tenantName, setTenantName] = React.useState("")
    const [tenant, setTenant] = React.useState("")
    const [signedRentContract, setSignedRentContract] = React.useState(false)

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
                    console.log(tenant)
                    return tenant
                } catch (e) {
                    console.log(e)
                }
            }
        }

        getSbtTokenId().then((tokenId) => {
            setTenantSBT(tokenId)
            getTenant(tokenId).then((tenant) => setTenant(tenant))
        })
    }, [])

    async function mintSoulboundToken(_name, _tokenURI) {
        if (typeof window !== "undefined") {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const userAddress = await signer.getAddress()
            const rentAppAddress = networkMapping["11155111"].RentApp[0]
            const contractAbi = rentAppAbi
            const contract = new ethers.Contract(rentAppAddress, contractAbi, signer)

            const propertyTx = await contract.mintSoulboundToken(_name, _tokenURI)
            // Wait for the transaction to be confirmed
            const propertyTxReceipt = await propertyTx.wait()
            // Get the property ID from the event emitted by the contract
            const events = propertyTxReceipt.events
            const soulboundTokenMintedEvent = events.find((e) => e.event === "SoulboundMinted")
            const sbtTokenId = soulboundTokenMintedEvent.args[1]

            console.log(`Soulbound token is minted. Token ID: ${sbtTokenId}`)

            return sbtTokenId
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const hashOfSbtMetadata = await fetch("/api/create-sbt", {
            method: "POST",
            body: JSON.stringify({ tenantName }),
        }).then((response) => response.json())
        console.log("hash of SBT metadata: ", hashOfSbtMetadata.sbtDataHash)
        const sbtTokenId = await mintSoulboundToken(tenantName, `https://gateway.pinata.cloud/ipfs/${hashOfSbtMetadata.sbtDataHas}`)
        setTenantSBT(sbtTokenId)
    }

    return (
        <div>
            <Head>
                <title>My Rentals</title>
            </Head>

            {tenantSBT !== undefined ? (
                <>
                    <p>My Tenant Soulbound Token ID: {tenantSBT.toString()}</p>
                    <p>
                        <Link className="button-standart" href={`/${wallet}/myrentals/rent-applications`}>
                            My Rent Applications
                        </Link>
                        This page will display all made applications and their statuses.
                    </p>
                    <p>
                        <Link className="button-standart" href={`/${wallet}/myrentals/rent-history`}>
                            My Rent History
                        </Link>
                    </p>
                    {tenant.currentRentContractId == 0 ? (
                        ""
                    ) : (
                        <p>
                            <>
                                <Link className="button-standart" href={`/${wallet}/myrentals/${tenant.currentRentContractId}`}>
                                    My Rent Contract
                                </Link>
                            </>
                        </p>
                    )}
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-field">
                            <label>
                                Name:
                                <input type="text" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
                            </label>
                        </div>
                        <button type="submit" className="button-standart">
                            Create Soulbound Token
                        </button>
                    </form>
                </>
            )}
        </div>
    )
}
