import Head from "next/head"
import { ListedPropertyCard } from "@/components/ListedPropertyCard"
import { ListedPropertyDetails } from "@/components/ListedPropertyCard"
import RentContract from "@/components/RentContract"
import { useState } from "react"
import Link from "next/link"

export default function MyProperties() {
    const [selectedProperty, setSelectedProperty] = useState(null)
    //should instead read data from blockchain
    const properties = [
        {
            id: 1,
            imageSrc: ["https://i0.wp.com/theadroitjournal.org/wp-content/uploads/2019/11/image2.jpg?resize=648%2C364&ssl=1"],
            rentalPrice: "1200",
            availableStartDate: "06-01",
            depositAmount: "2000",
            numberOfRooms: "3",
            squareMeters: "80",
            description: "some flat",
            status: "Rented",
            rentApplicationsCount: "5",
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
            status: "Vacant",
            rentApplicationsCount: "5",
        },
    ]
    const handlePropertyClick = (property) => {
        setSelectedProperty(property)
    }
    const handleBackClick = () => {
        setSelectedProperty(null)
    }
    return (
        <div>
            <Head>
                <title>My Properties</title>
            </Head>
            <div>
                <div>
                    {selectedProperty ? (
                        selectedProperty.status == "Vacant" ? (
                            <div>
                                <ListedPropertyDetails property={selectedProperty} onBack={handleBackClick} />
                            </div>
                        ) : (
                            <div>
                                <ListedPropertyDetails property={selectedProperty} onBack={handleBackClick} />
                                <RentContract property={selectedProperty} onBack={handleBackClick} />
                            </div>
                        )
                    ) : (
                        <div>
                            After signing up, this page will allow registered property owners to request for property’s NFT and list a property (when
                            NFT is minted). The page will show owners listings (rented and not rented). After selecting a listing an owner can check
                            rental history and if the property is not rented an owner can screen tenants and sign rental agreements, if the property
                            is rented an owner will se rental agreement page.
                            <Link href="/listProperty" className="button-standart">
                                List property for rent
                            </Link>
                            <button className="button-standart">Not Listed Properties</button>
                            <div className="properties-grid">
                                <div className="standartbolded">Properties listed for rent:</div>
                                {properties.map((property) => (
                                    <ListedPropertyCard
                                        key={property.id}
                                        imageSrc={property.imageSrc[0]}
                                        rentalPrice={property.rentalPrice}
                                        availableStartDate={property.availableStartDate}
                                        status={property.status}
                                        onClick={() => handlePropertyClick(property)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
