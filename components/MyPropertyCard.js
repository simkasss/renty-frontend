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

export function MyPropertyCard({ id, onClick, property, conversionChecked }) {
    const [rentalPriceInUsd, setRentalPriceInUsd] = React.useState("")

    React.useEffect(() => {
        async function getETHAmountInUSD(ethAmount) {
            if (typeof window !== "undefined") {
                ethereum = window.ethereum
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const userAddress = await signer.getAddress()
                const mainContractAddress = networkMapping["11155111"].MainContract[0]
                const contractAbi = mainContractAbi
                const contract = new ethers.Contract(mainContractAddress, contractAbi, provider)
                console.log(property.rentalPrice, "rental Price")
                const amountInWei = ethers.utils.parseUnits(ethAmount, "ether")
                const amountInUsd = await contract.getWEIAmountInUSD(amountInWei)
                setRentalPriceInUsd(Number(amountInUsd))
                return amountInUsd
            }
        }
        getETHAmountInUSD(property.rentalPrice)
    }, [])

    return (
        <>
            <Card sx={{ maxWidth: 345 }}>
                {property.hashesOfPhotos.length > 0 ? (
                    <CardMedia sx={{ height: 200 }} image={`https://gateway.pinata.cloud/ipfs/${property.hashesOfPhotos[0]}`} title="flat" />
                ) : (
                    <></>
                )}

                <CardContent>
                    {property.hashesOfPhotos.length > 0 ? (
                        <></>
                    ) : (
                        <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                            There are no photos yet
                        </Typography>
                    )}
                    <Typography gutterBottom variant="h6" component="div">
                        {property.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Property ID: {property.propertyNftId}
                    </Typography>
                    <Typography variant="body1" component="div" color="primary">
                        {conversionChecked ? `${property.rentalPrice} ETH/month` : `${rentalPriceInUsd} USD/month`}
                    </Typography>
                    <Typography variant="body2" color="primary">
                        Status: {property.isRented ? "Rented" : "Vacant"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Rental Term: {property.rentalTerm / 60 / 60 / 24} days
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" sx={{ mr: 15 }} onClick={onClick}>
                        More details
                    </Button>
                </CardActions>
            </Card>
        </>
    )
}
