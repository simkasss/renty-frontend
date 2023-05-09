import { useRouter } from "next/router"
import Router from "next/router"
import { ListedPropertyDetails } from "@/components/ListedPropertyCard"
import { getUserProperties } from "@/constants/blockchain"

export default function Property() {
    const router = useRouter()
    const { id } = router.query

    // Find the selected property from the properties array using the id parameter.
    const selectedProperty = exampleUserProperties.find((property) => property.id === parseInt(id))

    // If the selected property is not found, show a message.
    if (!selectedProperty) {
        return <div>Property not found</div>
    }

    return <ListedPropertyDetails property={selectedProperty} />
}

const exampleUserProperties = [
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
