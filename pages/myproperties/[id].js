import { useRouter } from "next/router"
import Router from "next/router"
import { ListedPropertyDetails } from "@/components/ListedPropertyCard"
import { getUserProperties } from "@/constants/blockchain"

export default function Property({ userProperties }) {
    const router = useRouter()
    const { id } = router.query

    // Find the selected property from the properties array using the id parameter.
    const selectedProperty = userProperties.find((property) => property.propertyNftId === parseInt(id))

    // If the selected property is not found, show a message.
    if (!selectedProperty) {
        return <div>Property not found</div>
    }

    return <ListedPropertyDetails property={selectedProperty} />
}

export const getServerSideProps = async () => {
    const data = await getUserProperties()
    return {
        props: { userProperties: JSON.parse(JSON.stringify(data)) },
    }
}
