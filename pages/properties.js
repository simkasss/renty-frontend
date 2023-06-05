import Head from "next/head"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { getListedProperties } from "../constants/blockchain"
import { PropertyCard } from "../components/PropertyCard"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"

export default function ListedProperties({ listedProperties }) {
    const properties = listedProperties
    const router = useRouter()
    const handlePropertyClick = (property) => {
        router.push(`/properties/${property.propertyNftId}`)
    }
    const [conversionChecked, setConversionChecked] = React.useState(true)
    const handleChange = () => {
        setConversionChecked(!conversionChecked)
    }

    return (
        <div>
            <Head>
                <title>Listed Properties</title>
            </Head>
            <Stack direction="row" alignItems="center" sx={{ ml: 12, mt: 1 }}>
                <AttachMoneyIcon fontSize="small" />
                <Switch checked={conversionChecked} onClick={handleChange} />
                <Typography>ETH</Typography>
            </Stack>
            <div className="container mx-auto px-4 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties.map((property) => (
                        <PropertyCard
                            key={property.propertyNftId}
                            name={property.name}
                            id={property.propertyNftId}
                            rentalPrice={property.rentalPrice}
                            rentalTerm={property.rentalTerm}
                            hashesOfPhotos={property.hashesOfPhotos}
                            hashOfMetaData={property.hashOfMetaData}
                            conversionChecked={conversionChecked}
                            onClick={() => handlePropertyClick(property)}
                        />
                    ))}
                </div>
                <div className="flex justify-center mt-4"></div>
            </div>
        </div>
    )
}

export const getServerSideProps = async () => {
    const data = await getListedProperties()
    console.log("listed properties", data)
    return {
        props: { listedProperties: JSON.parse(JSON.stringify(data)) },
    }
}
