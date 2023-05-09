import { ethers } from "ethers"
export const structureProperties = (properties) =>
    properties.map((property) => ({
        propertyNftId: Number(property.propertyNftId),
        owner: property.owner.toLowerCase(),
        name: property.name,
        description: property.description,
        rentalTerm: property.rentalTerm,
        rentalPrice: ethers.utils.formatEther(property.rentalPrice),
        depositAmount: ethers.utils.formatEther(property.depositAmount),
        hashOfRentalAgreement: property.hashOfRentalAgreement,
        rentContractsAccepted: Number(property.rentContractsAccepted),
        isRented: property.isRented,
        rentContractId: Number(property.rentContractId),
    }))
