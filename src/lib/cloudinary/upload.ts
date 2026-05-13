interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export async function uploadToCloudinary(
  file: File | Buffer,
  options?: { folder?: string; filename?: string }
): Promise<CloudinaryUploadResult> {
  const { v2: cloudinary } = await import("cloudinary");

  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options?.folder ?? "nutrimind",
        resource_type: "image",
        ...(options?.filename ? { public_id: options.filename } : {}),
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    if (Buffer.isBuffer(file)) {
      uploadStream.end(file);
    } else {
      file.arrayBuffer().then((buf: ArrayBuffer) => {
        uploadStream.end(Buffer.from(buf));
      });
    }
  });
}
