import Head from "next/head"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { getListedProperties } from "../constants/blockchain"
import { PropertyCard } from "../components/PropertyCard"
import { useSelector } from "react-redux"

export default function ListedProperties({ listedProperties }) {
    const properties = listedProperties
    const { conversionChecked } = useSelector((states) => states.globalStates)

    const router = useRouter()
    const handlePropertyClick = (property) => {
        router.push(`/properties/${property.propertyNftId}`)
    }

    return (
        <div>
            <Head>
                <title>Listed Properties</title>
            </Head>

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
