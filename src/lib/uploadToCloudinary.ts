import cloudinary from "./cloudinary";

export async function uploadBufferToCloudinary(buffer: Buffer) {
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "donations",
        resource_type: "image",
        transformation: [{ width: 1200, quality: "auto" }],
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

