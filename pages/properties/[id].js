import { useRouter } from "next/router"
import Router from "next/router"
import { PropertyDetails } from "@/components/PropertyCard"
import { getListedProperties } from "@/constants/blockchain"

export default function Property({ listedProperties }) {
    const router = useRouter()
    const { id } = router.query

    // Find the selected property from the properties array using the id parameter.
    const selectedProperty = listedProperties.find((property) => property.propertyNftId === parseInt(id))

    // If the selected property is not found, show a message.
    if (!selectedProperty) {
        return <div>Property not found</div>
    }

    return <PropertyDetails property={selectedProperty} />
}

export const getServerSideProps = async () => {
    const data2 = await getListedProperties()
    return {
        props: { listedProperties: JSON.parse(JSON.stringify(data2)) },
    }
}
