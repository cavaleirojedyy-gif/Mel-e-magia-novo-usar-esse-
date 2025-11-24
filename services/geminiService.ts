import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Helper to safely get the API client
const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY not set via environment.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getAiRecommendation = async (
  query: string,
  products: Product[]
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "A chave de API do Gemini não foi configurada. Não posso dar recomendações no momento.";

  const productList = products.map(p => `${p.name} (${p.category}): ${p.description} - R$ ${p.price}`).join('\n');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Você é um chef confeiteiro especialista em Pão de Mel chamado "Chef Mel".
        O cliente disse: "${query}".
        
        Aqui está o nosso cardápio atual:
        ${productList}
        
        Com base no cardápio e no pedido do cliente, sugira 1 ou 2 opções ideais. 
        Seja carismático, use emojis relacionados a doces e mel. Mantenha a resposta curta (máximo 3 frases).
      `,
    });
    return response.text || "Desculpe, não consegui pensar em uma recomendação agora.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Tive um problema ao consultar meu livro de receitas digital. Tente novamente!";
  }
};

export const generateMarketingDescription = async (
  productName: string,
  ingredients: string
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Descrição automática indisponível.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Crie uma descrição curta, apetitosa e vendedora para um novo Pão de Mel chamado "${productName}" que contém "${ingredients}". Foque na experiência sensorial. Máximo de 150 caracteres.`,
    });
    return response.text || "";
  } catch (error) {
    return "";
  }
};