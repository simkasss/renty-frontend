import React from "react"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { getWEIAmountInUSD } from "../utilities/currencyConversion"

export function PropertyCard({ name, rentalPrice, rentalTerm, hashesOfPhotos, hashOfMetaData, onClick, conversionChecked }) {
    const [address, setAddress] = React.useState("")
    const [rentalPriceInUsd, setRentalPriceInUsd] = React.useState("")
    React.useEffect(() => {
        async function getPropertyData() {
            const url = `https://gateway.pinata.cloud/ipfs/${hashOfMetaData}`
            await fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    setAddress(data.address)
                })
                .catch((error) => console.error(error))
        }
        async function currencyConversion(ethAmount) {
            const usd = await getWEIAmountInUSD(ethAmount)
            setRentalPriceInUsd(usd)
        }
        getPropertyData()
        currencyConversion(rentalPrice)
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
                        {conversionChecked ? `${rentalPriceInUsd} USD/month` : `${rentalPrice} ETH/month`}
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
