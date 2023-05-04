import { useRouter } from "next/router"
import Router from "next/router"
import { PropertyDetails } from "@/components/PropertyCard"
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

export default function Property() {
    const router = useRouter()
    const { id } = router.query

    // Find the selected property from the properties array using the id parameter.
    const selectedProperty = properties.find((property) => property.id === parseInt(id))

    // If the selected property is not found, show a message.
    if (!selectedProperty) {
        return <div>Property not found</div>
    }

    return <PropertyDetails property={selectedProperty} />
}
