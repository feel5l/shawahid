type CloudUploadResult = {
    url: string;
    bytes?: number;
    format?: string;
};

function getCloudinaryConfig() {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloud upload is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
    }

    return { cloudName, uploadPreset };
}

export async function uploadFileToCloud(file: File): Promise<CloudUploadResult> {
    const { cloudName, uploadPreset } = getCloudinaryConfig();
    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", uploadPreset);

    const response = await fetch(endpoint, {
        method: "POST",
        body,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Cloud upload failed: ${text || response.statusText}`);
    }

    const payload = await response.json();

    if (!payload?.secure_url) {
        throw new Error("Cloud upload failed: missing secure_url");
    }

    return {
        url: payload.secure_url,
        bytes: payload.bytes,
        format: payload.format,
    };
}
