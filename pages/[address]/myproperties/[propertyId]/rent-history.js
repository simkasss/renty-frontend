import Head from "next/head"
import { useRouter } from "next/router"
import Link from "next/link"
import { ethers } from "ethers"
import React from "react"
import networkMapping from "../../../../constants/networkMapping.json"
import mainContractAbi from "../../../../constants/MainContract.json"
import { structureRentContracts } from "../../../../utilities/structureStructs"
import Typography from "@mui/material/Typography"
import Grid from "@mui/material/Grid"

import { RentHistoryCardLandlordContainer } from "../../../../src/containers/RentHistoryCardLandlordContainer"

export default function PropertyRentHistory() {
    const router = useRouter()
    const { propertyId } = router.query
    const [rentHistory, setRentHistory] = React.useState([])

    React.useEffect(() => {
        if (propertyId == undefined) {
            return
        }
        async function getPropertyRentHistory(propertyId) {
            if (typeof window !== "undefined") {
                try {
                    ethereum = window.ethereum
                    const provider = new ethers.providers.Web3Provider(ethereum)
                    const signer = provider.getSigner()
                    const mainContractAddress = networkMapping["11155111"].MainContract[0]
                    const contractAbi = mainContractAbi
                    const contract = new ethers.Contract(mainContractAddress, contractAbi, signer)
                    const rentHistory = structureRentContracts(await contract.getPropertyRentHistory(propertyId))
                    console.log(rentHistory)
                    return rentHistory
                } catch (e) {
                    console.log(e)
                }
            }
        }
        getPropertyRentHistory(propertyId).then((rentHistory) => {
            setRentHistory(rentHistory)
        })
    }, [propertyId])

    return (
        <div>
            <Head>
                <title>Property Rent History</title>
            </Head>
            {rentHistory.length != 0 ? (
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {rentHistory.map((rentContract) => (
                        <Grid item xs={2} sm={4} md={4}>
                            <RentHistoryCardLandlordContainer key={rentContract.id} rentContract={rentContract} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <>
                    <Typography gutterBottom variant="h6" component="div" sx={{ m: 1 }} color="primary">
                        The property was not rented yet!
                    </Typography>
                </>
            )}
        </div>
    )
}
