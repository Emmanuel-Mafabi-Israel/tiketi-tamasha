import axios from "axios";

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Tiketi-tamasha"); // Correct preset

    // Cloudinary API URL
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/dt14zctwu/image/upload`;

    const response = await axios.post(cloudinaryUrl, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error.response?.data || error.message);
    throw error;
  }
};
