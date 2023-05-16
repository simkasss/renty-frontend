import Head from "next/head"
import Link from "next/link"
import { useState } from "react"
import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../../constants/networkMapping.json"
import rentAppAbi from "../../../constants/RentApp.json"
import { useSelector } from "react-redux"
import { structureRentContracts } from "../../../utilities/structureStructs"
import { RentContractApplicationCard2 } from "../../../components/RentContractApplicationCard"

export default function MyApplications() {
    const { wallet } = useSelector((states) => states.globalStates)
    const [rentContracts, setRentContracts] = React.useState([])
    const [removedRentContractIds, setRemovedRentContractIds] = useState([])

    React.useEffect(() => {
        async function getUserRentApplications() {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const userAddress = await signer.getAddress()
                const rentAppAddress = networkMapping["11155111"].RentApp[0]
                const contractAbi = rentAppAbi
                const contract = new ethers.Contract(rentAppAddress, contractAbi, signer)
                const sbtTokenId = await contract.getSbtTokenId(userAddress)
                const tenantRentContracts = structureRentContracts(await contract.getTenantRentContracts(sbtTokenId))
                return tenantRentContracts
            }
        }

        getUserRentApplications().then((contracts) => {
            setRentContracts(contracts)
            console.log("Contracts: ", contracts)
            console.log("Rent Contract: ", rentContracts)
        })
    }, [])
    const handleRemoveRentContract = (id) => {
        setRemovedRentContractIds((prevIds) => [...prevIds, id])
    }

    return (
        <>
            <div>
                {rentContracts.map((rentContract) =>
                    !removedRentContractIds.includes(rentContract.id) ? (
                        <RentContractApplicationCard2 key={rentContract.id} rentContract={rentContract} />
                    ) : (
                        <></>
                    )
                )}
            </div>
        </>
    )
}
