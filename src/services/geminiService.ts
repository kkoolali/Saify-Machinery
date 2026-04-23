import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface RecommendationInfo {
  productTitle: string;
  reason: string;
  matchScore: number;
}

export interface RecommendationResponse {
  advice: string;
  recommendations: RecommendationInfo[];
}

export async function getTechnicalAdvice(
  userRequirements: string,
  availableProducts: any[]
): Promise<RecommendationResponse> {
  const productsContext = availableProducts.map(p => ({
    title: p.title,
    id: p.id,
    description: p.description,
    category: p.categoryId,
    price: p.price,
    enquiryOnly: p.enquiryOnly
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      As a Senior Technical Consultant at Saify Machinery (Pulgaon), analyze the following customer requirements and recommend the absolute best products from our catalog.
      
      User Requirements: ${userRequirements}
      
      Store Inventory Data:
      ${JSON.stringify(productsContext, null, 2)}
      
      Consultant Instructions:
      1. Perform a deep technical analysis of the user's needs (e.g., pressure requirements for pumps, capacity for tanks).
      2. Match these needs against our specific Inventory Data.
      3. CRITICAL: Write a detailed expert advice paragraph. Start with a warm professional greeting in Hindi, explain the technical logic in Hindi, then provide a concise English technical summary.
      4. List up to 3 best matches. For each, give a highly specific technical reason why it fits their requirement.
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          advice: {
            type: Type.STRING,
            description: "Detailed professional advice in Hindi followed by English.",
          },
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                productId: { type: Type.STRING },
                productTitle: { type: Type.STRING },
                reason: { type: Type.STRING, description: "Detailed technical justification." },
                matchScore: { type: Type.NUMBER, description: "Accuracy percentage (1-100)" },
              },
              required: ["productId", "productTitle", "reason", "matchScore"],
            },
          },
        },
        required: ["advice", "recommendations"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text);
}
