import { useState } from "react";

const useImageUploader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function getUploadedImg(image) {
    setIsLoading(true);

    if (!image) {
      setError("Image is not provided");
      setIsLoading(false);
      return;
    }

    if (
      image.type === "image/jpeg" ||
      image.type === "image/png" ||
      image.type === "image/jpg"
    ) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        return data.url.toString();
      } catch (error) {
        console.error(error);
        setError("An error occurred while uploading the image.");
        setIsLoading(false);
        throw new Error(error);
      } finally {
        setIsLoading(false);
        setError(null);
      }
    } else {
      setIsLoading(false);
      setError("format should be in these types: jpeg, jpg, png.");
    }
  }

  return [isLoading, error, getUploadedImg];
};

export default useImageUploader;
