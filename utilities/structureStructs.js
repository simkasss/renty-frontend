import { ethers } from "ethers"

export const structureProperties = (properties) =>
    properties.map((property) => ({
        propertyNftId: Number(property.propertyNftId),
        name: property.name,
        description: property.description,
        rentalTerm: Number(property.rentalTerm),
        rentalPrice: ethers.utils.formatEther(property.rentalPrice),
        depositAmount: ethers.utils.formatEther(property.depositAmount),
        hashOfRentalAgreement: property.hashOfTermsAndConditions,
        hashOfMetaData: property.hashOfPropertyMetaData,
        hashesOfPhotos: property.hashesOfPhotos,
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
        startTimestamp: Number(contract.startTimestamp),
        expiryTimestamp: Number(contract.expiryTimestamp),
        validityTerm: Number(contract.validityTerm),
        status: Number(contract.status),
        propertyRentContractsAccepted: Number(contract.propertyRentContractsAccepted),
    }))

export const structurePayments = (payments) =>
    payments.map((payment) => ({
        id: Number(payment.id),

        timestamp: Number(payment.timestamp),
        amount: Number(payment.amount),
    }))
export const structureDisputes = (disputes) =>
    disputes.map((dispute) => ({
        id: Number(dispute.id),
        description: dispute.description,
        solvedByLandlord: dispute.solvedByLandlord,
        solvedByTenant: dispute.solvedByTenant,
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
        startTimestamp: Number(contract.startTimestamp),
        expiryTimestamp: Number(contract.expiryTimestamp),
        validityTerm: Number(contract.validityTerm),
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
        hashOfRentalAgreement: property.hashOfTermsAndConditions,
        hashOfMetaData: property.hashOfPropertyMetaData,
        hashesOfPhotos: property.hashesOfPhotos,
        rentContractsAccepted: Number(property.rentContractsAccepted),
        isRented: property.isRented,
        rentContractId: Number(property.rentContractId),
    }
    return structuredProperty
}
