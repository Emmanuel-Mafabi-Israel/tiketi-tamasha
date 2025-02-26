import axios from "axios";
import CONFIG from "../config";

export const uploadImage = async (file) => {
	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", CONFIG.CLOUDINARY.UPLOAD_PRESET);

		const response = await axios.post(
			`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY.CLOUD_NAME}/image/upload`,
			formData
		);

		return response.data;
	} catch (error) {
		console.error("Error uploading image:", error.response?.data || error.message);
		throw error;
	}
};
