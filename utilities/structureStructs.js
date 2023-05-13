import { ethers } from "ethers"

export const structureProperties = (properties) =>
    properties.map((property) => ({
        propertyNftId: Number(property.propertyNftId),
        name: property.name,
        description: property.description,
        rentalTerm: Number(property.rentalTerm),
        rentalPrice: ethers.utils.formatEther(property.rentalPrice),
        depositAmount: ethers.utils.formatEther(property.depositAmount),
        hashOfRentalAgreement: property.hashOfRentalAgreement,
        hashOfMetaData: property.hashOfMetaData,
        rentContractsAccepted: Number(property.rentContractsAccepted),
        isRented: property.isRented,
        rentContractId: Number(property.rentContractId),
    }))

export const structureRentContracts = (contracts) =>
    contracts.map((contract) => ({
        id: Number(contract.id),
        propertyNftId: Number(contract.propertyNftId),
        tenantSbtId: Number(contract.tenantSbtId),
        rentalTerm: Number(contract.rentalTerm),
        rentalPrice: ethers.utils.formatEther(contract.rentalPrice),
        depositAmount: ethers.utils.formatEther(contract.depositAmount),
        startDate: contract.startDate,
        expiryTimestamp: Number(contract.expiryTimestamp),
        daysOfApplicationValidity: Number(contract.daysOfApplicationValidity),
        status: Number(contract.status),
        propertyRentContractsAccepted: Number(contract.propertyRentContractsAccepted),
    }))

export const structureTenant = (tenant) => {
    const structuredTenant = {
        soulboundTokenId: Number(tenant.sbtId),
        name: tenant.name,
        currentRentContractId: Number(tenant.currentRentContractId),
        rentHistory: structureRentContracts(tenant.rentHistory),
    }
    return structuredTenant
}
export const structureRentContract = (contract) => {
    const structuredContract = {
        id: Number(contract.id),
        propertyNftId: Number(contract.propertyNftId),
        tenantSbtId: Number(contract.tenantSbtId),
        rentalTerm: Number(contract.rentalTerm),
        rentalPrice: ethers.utils.formatEther(contract.rentalPrice),
        depositAmount: ethers.utils.formatEther(contract.depositAmount),
        startDate: contract.startDate,
        expiryTimestamp: Number(contract.expiryTimestamp),
        daysOfApplicationValidity: Number(contract.daysOfApplicationValidity),
        status: Number(contract.status),
        propertyRentContractsAccepted: Number(contract.propertyRentContractsAccepted),
    }
    return structuredContract
}

export const structureProperty = (property) => {
    const structuredProperty = {
        propertyNftId: Number(property.propertyNftId),
        name: property.name,
        description: property.description,
        rentalTerm: Number(property.rentalTerm),
        rentalPrice: ethers.utils.formatEther(property.rentalPrice),
        depositAmount: ethers.utils.formatEther(property.depositAmount),
        hashOfRentalAgreement: property.hashOfRentalAgreement,
        hashOfMetaData: property.hashOfMetaData,
        rentContractsAccepted: Number(property.rentContractsAccepted),
        isRented: property.isRented,
        rentContractId: Number(property.rentContractId),
    }
    return structuredProperty
}
