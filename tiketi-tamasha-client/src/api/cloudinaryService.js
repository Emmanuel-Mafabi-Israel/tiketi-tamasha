import axios from "axios";

export const uploadImage = async (file) => {
  if (!file) {
    console.error("No file selected for upload.");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "Tiketi-tamasha"); // Double-check this preset name

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dt14zctwu/image/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("Cloudinary upload success:", response.data); // ✅ Log response
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error.response?.data || error.message);
    alert(`Image upload failed: ${error.response?.data?.error?.message || "Unknown error"}`);
    return null;
  }
};
