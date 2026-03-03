import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    // Verify environment variables are set
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log("Fetching photos with config:", {
      cloud_name: cloudName ? "SET" : "NOT SET",
      api_key: apiKey ? "SET" : "NOT SET",
      api_secret: apiSecret ? "SET" : "NOT SET",
    });

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error: "Missing Cloudinary configuration",
          missing: {
            cloud_name: !cloudName,
            api_key: !apiKey,
            api_secret: !apiSecret,
          },
        },
        { status: 500 }
      );
    }

    const result = await cloudinary.api.resources({
      resource_type: "image",
      type: "upload",
      max_results: 100,
      direction: "desc",
    });

    const photos = result.resources.map((image: any) => ({
      id: image.asset_id,
      publicId: image.public_id,
      title: image.public_id.split("/").pop()?.replace(/-/g, " ") || "Untitled",
      createdAt: image.created_at,
      width: image.width,
      height: image.height,
      format: image.format,
    }));

    console.log(`Successfully fetched ${photos.length} photos`);
    return NextResponse.json({ photos });
  } catch (error: any) {
    console.error("Error fetching photos from Cloudinary:", {
      message: error?.message,
      status: error?.http_code,
      response: error?.error,
      fullError: error,
    });
    return NextResponse.json(
      {
        error: "Failed to fetch photos",
        details: error?.message || "Unknown error",
        type: error?.error?.http_code || "unknown",
      },
      { status: 500 }
    );
  }
}
