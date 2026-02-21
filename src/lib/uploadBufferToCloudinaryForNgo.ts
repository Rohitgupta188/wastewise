import cloudinary from "./cloudinary";

export async function uploadBufferToCloudinaryForNgo(
  buffer: Buffer,
  filename: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const publicId =
      "ngo-verification/documents/" +
      filename.split(".")[0] +
      "_" +
      Date.now();

    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        resource_type: "raw", 
        type: "authenticated", 
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) return reject(error);

        resolve(result.public_id);
      }
    );

    stream.end(buffer);
  });
}
