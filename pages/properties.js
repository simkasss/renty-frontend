import Head from "next/head"
import React, { useState } from "react"
import { PropertyCard } from "@/components/PropertyCard"
import { PropertyDetails } from "@/components/PropertyCard"
import Link from "next/link"
import { useRouter } from "next/router"
import { getListedProperties } from "../constants/blockchain"

export default function ListedProperties({ listedProperties }) {
    const properties = listedProperties
    const router = useRouter()
    const handlePropertyClick = (property) => {
        router.push(`/properties/${property.propertyNftId}`)
    }

    return (
        <div>
            <Head>
                <title>Listed Properties</title>
            </Head>

            <div>
                <div>
                    <div className="properties-grid">
                        {properties.map((property) => (
                            <PropertyCard
                                key={property.propertyNftId}
                                name={property.name}
                                id={property.propertyNftId}
                                rentalPrice={property.rentalPrice}
                                rentalTerm={property.rentalTerm}
                                onClick={() => handlePropertyClick(property)}
                            />
                        ))}
                    </div>
                    <div>
                        <button className="link-standart">Load More</button>
                    </div>
                </div>
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
