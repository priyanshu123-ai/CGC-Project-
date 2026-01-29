import Tesseract from "tesseract.js";

export const extractTextFromImage = async (buffer) => {
  const {
    data: { text }
  } = await Tesseract.recognize(buffer, "eng");

  return text;
};