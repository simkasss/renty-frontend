import Head from "next/head"
import React, { useState } from "react"
import { PropertyCard } from "@/components/PropertyCard"
import { PropertyDetails } from "@/components/PropertyCard"
import Link from "next/link"
import { useRouter } from "next/router"
import { getListedProperties } from "@/constants/blockchain"

export default function ListedProperties({ listedProperties }) {
    console.log("listedProperties", listedProperties)
    const properties = listedProperties
    const [selectedProperty, setSelectedProperty] = useState(null)
    //should read data from blockchain

    const router = useRouter()
    const handlePropertyClick = (property) => {
        setSelectedProperty(property)
        router.push(`/properties/${property.propertyNftId}`)
    }
    const handleBackClick = () => {
        setSelectedProperty(null)
    }
    return (
        <div>
            <Head>
                <title>Listed Properties</title>
            </Head>
            <div>
                Listings page displays all the available properties for rent, with information such as property images, rental terms, rent prices, and
                deposit amounts. Users can filter the listings based on their preferences. Tenants can apply for a selected property.
            </div>
            <div>
                <div>
                    {selectedProperty ? (
                        <PropertyDetails property={selectedProperty} onBack={handleBackClick} />
                    ) : (
                        <div className="properties-grid">
                            {/* {properties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    id={property.id}
                                    imageSrc={property.imageSrc[0]}
                                    rentalPrice={property.rentalPrice}
                                    availableStartDate={property.availableStartDate}
                                    onClick={() => handlePropertyClick(property)}
                                />
                            ))} */}

                            {properties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    name={property.name}
                                    id={property.propertyNftId}
                                    rentalPrice={property.rentalPrice}
                                    rentalTerm={property.rentalTerm}
                                    onClick={() => handlePropertyClick(property)}
                                />
                            ))}

                            <button className="button-standart">Load More</button>
                        </div>
                    )}
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

const exampleProperties = [
    {
        id: 1,
        imageSrc: ["https://i0.wp.com/theadroitjournal.org/wp-content/uploads/2019/11/image2.jpg?resize=648%2C364&ssl=1"],
        rentalPrice: "1200",
        availableStartDate: "06-01",
        depositAmount: "2000",
        numberOfRooms: "3",
        squareMeters: "80",
        description: "some flat",
    },
    {
        id: 2,
        imageSrc: [
            "https://assets-news.housing.com/news/wp-content/uploads/2021/01/27132610/Everything-you-need-to-know-about-condominiums-FB-1200x700-compressed.jpg",
        ],
        rentalPrice: "1500",
        availableStartDate: "07-01",
        depositAmount: "2000",
        numberOfRooms: "3",
        squareMeters: "80",
        description: "some flat",
    },
    {
        id: 3,
        imageSrc: ["https://ap.rdcpix.com/2a68a18beeec784b63656a46b7af619dl-b3248638862od-w480_h360_x2.jpg"],
        rentalPrice: "1800",
        availableStartDate: "08-01",
        depositAmount: "2000",
        numberOfRooms: "3",
        squareMeters: "80",
        description: "some flat",
    },
    {
        id: 4,
        imageSrc: ["https://swirled.com/wp-content/uploads/2017/03/luxury-studio-apartments-750x549.jpg"],
        rentalPrice: "2000",
        availableStartDate: "09-01",
        depositAmount: "2000",
        numberOfRooms: "3",
        squareMeters: "80",
        description: "some flat",
    },
]
