import FormData from "form-data";
import axios from "axios";

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
const PINATA_JWT = process.env.PINATA_JWT;

/**
 * Upload file to Pinata IPFS
 */
export async function uploadToPinata(
  file: File,
  fileName?: string
): Promise<{ ipfsHash: string; pinataUrl: string }> {
  if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_SECRET_KEY)) {
    throw new Error("Pinata credentials not configured");
  }

  try {
    const formData = new FormData();
    const buffer = Buffer.from(await file.arrayBuffer());
    
    formData.append("file", buffer, {
      filename: fileName || file.name,
      contentType: file.type,
    });

    // Add metadata
    const metadata = JSON.stringify({
      name: fileName || file.name,
      keyvalues: {
        uploadedAt: new Date().toISOString(),
        type: file.type,
      },
    });
    formData.append("pinataMetadata", metadata);

    // Add options
    const options = JSON.stringify({
      cidVersion: 1,
    });
    formData.append("pinataOptions", options);

    const headers: any = {
      ...formData.getHeaders(),
    };

    if (PINATA_JWT) {
      headers.Authorization = `Bearer ${PINATA_JWT}`;
    } else {
      headers.pinata_api_key = PINATA_API_KEY;
      headers.pinata_secret_api_key = PINATA_SECRET_KEY;
    }

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      { headers, maxBodyLength: Infinity, maxContentLength: Infinity }
    );

    const ipfsHash = response.data.IpfsHash;
    const pinataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    return { ipfsHash, pinataUrl };
  } catch (error: any) {
    console.error("Pinata upload error:", error);
    throw new Error(`Failed to upload to Pinata: ${error?.message || "Unknown error"}`);
  }
}

/**
 * Upload JSON metadata to Pinata
 */
export async function uploadMetadataToPinata(
  metadata: Record<string, any>,
  name: string
): Promise<{ ipfsHash: string; pinataUrl: string }> {
  if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_SECRET_KEY)) {
    throw new Error("Pinata credentials not configured");
  }

  try {
    const data = JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name,
        keyvalues: {
          type: "metadata",
          uploadedAt: new Date().toISOString(),
        },
      },
    });

    const headers: any = {
      "Content-Type": "application/json",
    };

    if (PINATA_JWT) {
      headers.Authorization = `Bearer ${PINATA_JWT}`;
    } else {
      headers.pinata_api_key = PINATA_API_KEY;
      headers.pinata_secret_api_key = PINATA_SECRET_KEY;
    }

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data,
      { headers }
    );

    const ipfsHash = response.data.IpfsHash;
    const pinataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    return { ipfsHash, pinataUrl };
  } catch (error: any) {
    console.error("Pinata metadata upload error:", error);
    throw new Error(`Failed to upload metadata to Pinata: ${error?.message || "Unknown error"}`);
  }
}

