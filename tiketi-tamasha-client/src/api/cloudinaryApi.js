const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dt14zctwu/image/upload";
const UPLOAD_PRESET = "Tiketi-tamasha"; 
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    return await response.json();
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};
