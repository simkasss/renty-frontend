import Head from "next/head"
import Link from "next/link"
import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../../constants/networkMapping.json"
import tenantManagerAbi from "../../../constants/TenantManager.json"
import mainContractAbi from "../../../constants/MainContract.json"
import { useSelector } from "react-redux"
import { MintSBTCard } from "../../../components/MintSBTCard"
import { MyRentals } from "../../../components/MyRentals"
import { structureRentContracts } from "../../../utilities/structureStructs"

export default function MyRentalsPage() {
    const { wallet } = useSelector((states) => states.globalStates)
    const [tenantSBT, setTenantSBT] = React.useState("")
    const [tenantName, setTenantName] = React.useState("")
    const [currentRentContractId, setCurrentContractId] = React.useState("")
    const [rentContracts, setRentContracts] = React.useState([])
    const [email, setEmail] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const [alert, setAlert] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [alertMint, setAlertMint] = React.useState(false)
    const [loadingMint, setLoadingMint] = React.useState(false)
    const { conversionChecked } = useSelector((states) => states.globalStates)

    React.useEffect(() => {
        async function getSbtTokenId() {
            if (typeof window !== "undefined") {
                try {
                    ethereum = window.ethereum
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const userAddress = await signer.getAddress()
                    const tenantManagerAddress = networkMapping["11155111"].TenantManager[0]
                    const contractAbi = tenantManagerAbi
                    const contract = new ethers.Contract(tenantManagerAddress, contractAbi, signer)
                    const sbtTokenId = await contract.getTokenId(userAddress)

                    return sbtTokenId
                } catch (e) {
                    console.log(e)
                }
            }
        }

        async function getCurrentContract(tokenId) {
            if (typeof window !== "undefined") {
                try {
                    ethereum = window.ethereum
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()

                    const mainContractAddress = networkMapping["11155111"].MainContract[0]
                    const contractAbi = mainContractAbi
                    const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
                    const contractId = await contract.getTenantCurrentContractId(tokenId)
                    console.log(`User has valid rent contract. Contract ID: ${contractId}`)
                    return contractId
                } catch (e) {
                    console.log(e)
                }
            }
        }

        async function getUserRentApplications(tokenId) {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                const contractAbi = mainContractAbi
                const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
                const tenantRentContracts = structureRentContracts(await contract.getTenantRentContracts(tokenId))
                const waitingTenantRentApplications = tenantRentContracts.filter((contract) => contract.status === 0)
                return waitingTenantRentApplications
            }
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

        getSbtTokenId().then((tokenId) => {
            setTenantSBT(tokenId)
            console.log("Token ID is: ", tokenId)
            if (tokenId !== undefined) {
                getCurrentContract(tokenId).then((contractId) => {
                    setCurrentContractId(contractId)
                })
                getUserRentApplications(tokenId).then((contracts) => {
                    setRentContracts(contracts)
                    console.log("Contracts: ", contracts)
                    console.log("Rent Contract: ", rentContracts)
                })
            }
        })
        getUserEmail()
        getUserPhoneNumber()
    }, [])

    async function mintSoulboundToken(_name, _tokenURI) {
        if (typeof window !== "undefined") {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const userAddress = await signer.getAddress()
            const tenantManagerAddress = networkMapping["11155111"].TenantManager[0]
            const contractAbi = tenantManagerAbi
            const contract = new ethers.Contract(tenantManagerAddress, contractAbi, signer)

            const propertyTx = await contract.mintSBT(_tokenURI, _name)
            // Wait for the transaction to be confirmed
            const propertyTxReceipt = await propertyTx.wait()
            // Get the property ID from the event emitted by the contract
            const events = propertyTxReceipt.events
            const soulboundTokenMintedEvent = events.find((e) => e.event === "SoulboundMinted")
            const sbtTokenId = soulboundTokenMintedEvent.args[1]
            setAlertMint(true)
            console.log(`Soulbound token is minted. Token ID: ${sbtTokenId}`)

            return sbtTokenId
        }
    }
    async function cancelRentApplication(propertyId, rentContractId) {
        if (typeof window !== "undefined") {
            ethereum = window.ethereum
            const provider = new ethers.providers.Web3Provider(ethereum)
            const signer = provider.getSigner()
            const mainContractAddress = networkMapping["11155111"].MainContract[0]
            const contractAbi = mainContractAbi
            const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
            const cancel = await contract.cancelRentApplication(propertyId, rentContractId)
            await cancel.wait()
            setAlert(true)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoadingMint(true)
        const hashOfSbtMetadata = await fetch("/api/create-sbt", {
            method: "POST",
            body: JSON.stringify({ tenantName }),
        }).then((response) => response.json())
        console.log("hash of SBT metadata: ", hashOfSbtMetadata.sbtDataHash)
        const sbtTokenId = await mintSoulboundToken(tenantName, `https://gateway.pinata.cloud/ipfs/${hashOfSbtMetadata.sbtDataHas}`)
        setTenantSBT(sbtTokenId)
    }

    const handleCancelClick = (propertyId, rentContractId) => {
        setLoading(true)
        cancelRentApplication(propertyId, rentContractId)
    }

    return (
        <>
            {tenantSBT !== undefined ? (
                <div>
                    <MyRentals
                        wallet={wallet}
                        tenantSBT={tenantSBT}
                        currentRentContractId={currentRentContractId}
                        rentContracts={rentContracts}
                        handleCancelClick={handleCancelClick}
                        loading={loading}
                        alert={alert}
                        email={email}
                        phoneNumber={phoneNumber}
                        conversionChecked={conversionChecked}
                    />
                </div>
            ) : (
                <MintSBTCard
                    tenantName={tenantName}
                    handleSubmit={handleSubmit}
                    setTenantName={setTenantName}
                    loadingMint={loadingMint}
                    alertMint={alertMint}
                />
            )}
        </>
    )
}
