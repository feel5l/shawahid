type CloudUploadResult = {
    url: string;
    bytes?: number;
    format?: string;
};

const MAX_FALLBACK_BYTES = 2 * 1024 * 1024;

function getCloudinaryConfig() {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloud upload is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
    }

    return { cloudName, uploadPreset };
}

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
                return;
            }
            reject(new Error("Failed to convert file to data URL."));
        };
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsDataURL(file);
    });
}

async function fallbackToDataUrl(file: File): Promise<CloudUploadResult> {
    if (file.size > MAX_FALLBACK_BYTES) {
        throw new Error("File is too large for fallback upload. Please use a file smaller than 2MB.");
    }

    const url = await fileToDataUrl(file);
    return {
        url,
        bytes: file.size,
        format: file.type || "unknown",
    };
}

export async function uploadFileToCloud(file: File): Promise<CloudUploadResult> {
    let cloudName: string | undefined;
    let uploadPreset: string | undefined;

    try {
        const config = getCloudinaryConfig();
        cloudName = config.cloudName;
        uploadPreset = config.uploadPreset;
    } catch {
        return fallbackToDataUrl(file);
    }

    const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", uploadPreset);

    try {
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
    } catch {
        return fallbackToDataUrl(file);
    }
}
