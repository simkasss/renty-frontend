import React from "react"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { ethers } from "ethers"
import networkMapping from "../constants/networkMapping.json"
import mainContractAbi from "../constants/MainContract.json"

export function PropertyCard({ name, rentalPrice, rentalTerm, hashesOfPhotos, hashOfMetaData, onClick, conversionChecked }) {
    const [address, setAddress] = React.useState("")
    const [rentalPriceInUsd, setRentalPriceInUsd] = React.useState("")
    React.useEffect(() => {
        async function getPropertyData() {
            const url = `https://gateway.pinata.cloud/ipfs/${hashOfMetaData}`
            await fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)

                    setAddress(data.address)
                })
                .catch((error) => console.error(error))
        }
        async function getWEIAmountInUSD(ethAmount) {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                const contractAbi = mainContractAbi
                const contract = new ethers.Contract(mainContractAddress, contractAbi, provider)
                const amountInWei = ethers.BigNumber.from(ethers.utils.parseUnits(ethAmount, 18))
                console.log("amountInWei: ", Number(amountInWei))
                const amountInUsd = await contract.getWEIAmountInUSD(amountInWei)
                console.log("amount in usd: ", Number(amountInUsd))
                setRentalPriceInUsd(amountInUsd)

                return amountInUsd
            }
        }
        getPropertyData()
        getWEIAmountInUSD(rentalPrice)
    }, [])

    return (
        <>
            <Card sx={{ maxWidth: 345 }} onClick={onClick}>
                <CardMedia sx={{ height: 200 }} image={`https://gateway.pinata.cloud/ipfs/${hashesOfPhotos[0]}`} title="flat" />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                        {name}
                    </Typography>
                    <Typography variant="body1" component="div" color="primary">
                        {conversionChecked ? `${rentalPrice} ETH/month` : `${rentalPriceInUsd} USD/month`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Rental Term: {rentalTerm / 60 / 60 / 24} days
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">More details</Button>
                </CardActions>
            </Card>
        </>
    )
}
