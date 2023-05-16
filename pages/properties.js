import Head from "next/head"
import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { getListedProperties } from "../constants/blockchain"
import { PropertyCard } from "../components/PropertyCard"

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

            <div className="container mx-auto px-4 py-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <div className="flex justify-center mt-4">
                    <button className=" bg-violet-900 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded">Load More</button>
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
