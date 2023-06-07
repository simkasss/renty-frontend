import React from "react"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { getWEIAmountInUSD } from "../utilities/currencyConversion"

export function MyPropertyCard({ id, onClick, property, conversionChecked }) {
    const [rentalPriceInUsd, setRentalPriceInUsd] = React.useState("")

    React.useEffect(() => {
        async function currencyConversion(ethAmount) {
            const usd = await getWEIAmountInUSD(ethAmount)
            return usd
        }
        currencyConversion(property.rentalPrice).then((usd) => setRentalPriceInUsd(usd))
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
                        {conversionChecked ? `${rentalPriceInUsd} USD/month` : `${property.rentalPrice} ETH/month`}
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
