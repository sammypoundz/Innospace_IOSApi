import axios from "axios";
import FormData from "form-data";

export const uploadToPHPServer = async (
  file: Express.Multer.File
): Promise<string> => {
  const form = new FormData();
  form.append("file", file.buffer, file.originalname);

  const response = await axios.post(
    "https://zenchidanigeria.com.ng/innospaceX/upload.php",
    form,
    {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    }
  );

  if (!response.data?.url) {
    throw new Error("File upload failed");
  }

  return response.data.url;
};
