import Head from "next/head"
import Link from "next/link"
import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../../constants/networkMapping.json"
import mainContractAbi from "../../../constants/MainContract.json"
import tenantManagerAbi from "../../../constants/TenantManager.json"
import { useSelector } from "react-redux"
import { structureRentContracts } from "../../../utilities/structureStructs"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"

import { RentHistoryCardTenantContainer } from "../../../src/containers/RentHistoryCardTenantContainer"

export default function RentHistory() {
    const [rentHistory, setRentHistory] = React.useState([])

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
                    console.log(`User has soulbound token. Token ID: ${sbtTokenId}`)
                    return sbtTokenId
                } catch (e) {
                    console.log(e)
                }
            }
        }
        async function getTenantRentHistory(tokenId) {
            if (typeof window !== "undefined") {
                try {
                    ethereum = window.ethereum
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const mainContractAddress = networkMapping["11155111"].MainContract[0]
                    const contractAbi = mainContractAbi
                    const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
                    const rentHistory = structureRentContracts(await contract.getTenantRentHistory(tokenId))
                    console.log(rentHistory)
                    return rentHistory
                } catch (e) {
                    console.log(e)
                }
            }
        }

        getSbtTokenId().then((tokenId) => {
            getTenantRentHistory(tokenId).then((rentHistory) => {
                setRentHistory(rentHistory)
            })
        })
    }, [])

    return (
        <div>
            <Head>
                <title>My Rent History</title>
            </Head>
            {rentHistory.length != 0 ? (
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {rentHistory.map((rentContract) => (
                        <Grid item xs={2} sm={4} md={4}>
                            <RentHistoryCardTenantContainer key={rentContract.id} rentContract={rentContract} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <>
                    <Typography gutterBottom variant="h6" component="div" sx={{ m: 1 }} color="primary">
                        You haven't rented anything yet!
                    </Typography>
                </>
            )}
        </div>
    )
}
