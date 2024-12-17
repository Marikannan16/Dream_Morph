import { HfInference } from '@huggingface/inference';

const HF_ACCESS_TOKEN = import.meta.env.API_KEY;
const hf = new HfInference(HF_ACCESS_TOKEN);

export const generateImageWithHuggingFace = async (prompt) => {
  try {
    const result = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      inputs: prompt
    });
    return URL.createObjectURL(result);
  } catch (error) {
    console.error('Image Generation Error', error);
  }
};
