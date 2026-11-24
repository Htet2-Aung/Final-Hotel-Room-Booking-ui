const UPLOAD_URL = "http://localhost:8181/api/file/upload";

// Uploads an image file to the backend and returns its public URL
// (e.g. http://localhost:8181/uploads/<uuid>.jpg)
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image upload failed with status: " + response.status);
  }

  const data = await response.json();
  return data.url;
};
