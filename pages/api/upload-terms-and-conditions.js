// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const pinataSDK = require("@pinata/sdk")
const pinataApiKey = process.env.PINATA_API_KEY
const pinataApiSecret = process.env.PINATA_API_SECRET
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)
require("dotenv").config()

import { IncomingForm } from "formidable"
import fs from "fs"

export default async function handler(req, res) {
    const form = new IncomingForm()

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error("Error parsing form:", err)
            res.status(500).json({ error: "Error parsing form" })
            return
        }
        let hash
        console.log("Decoded files:", files)

        try {
            // Read the file as a buffer
            const file = files["rentalTermsAndConditions"]
            const fileBuffer = fs.createReadStream(file.filepath)
            const { IpfsHash } = await pinata.pinFileToIPFS(fileBuffer, {
                pinataMetadata: {
                    name: "Photo",
                },
            })
            console.log("IpfsHash: ", IpfsHash)
            hash = IpfsHash
        } catch (error) {
            console.error("Error pinning file to Pinata:", error)
            res.status(500).json({ error: "Error pinning file to Pinata" })
        }

        res.status(200).json({ hash })
    })
}

export const config = {
    api: {
        bodyParser: false,
    },
}
