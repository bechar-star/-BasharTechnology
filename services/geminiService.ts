
import { GoogleGenAI } from "@google/genai";
import { PortfolioItem } from "../types";

export interface AIResponse {
  text: string;
  sources?: { title: string; uri: string }[];
}

export class GeminiService {
  /**
   * Asking Gemini with Google Search Grounding enabled.
   */
  async askWithSearch(query: string, portfolioItems: PortfolioItem[]): Promise<AIResponse> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const context = portfolioItems.map(item => 
      `Title: ${item.title}, Category: ${item.category}`
    ).join('\n');

    const prompt = `
      أنت المساعد الذكي الرسمي لمنصة "بشار تكنولوجي" (Bashar Technology).
      معلومات عن المنصة: ${context}
      
      سؤال المستخدم: ${query}
      
      تعليمات:
      1. أجب باللغة العربية بأسلوب احترافي وودود.
      2. استخدم بحث جوجل للحصول على أي معلومات تقنية حديثة أو أخبار جارية يطلبها المستخدم.
      3. إذا كان السؤال عن أعمال بشار، ابحث في السياق المرفق أولاً.
      4. كن دقيقاً ومختصراً.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "عذراً، لم أتمكن من الحصول على إجابة حالياً.";
      
      // Extract grounding chunks for sources
      const sources: { title: string; uri: string }[] = [];
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if (groundingChunks) {
        groundingChunks.forEach((chunk: any) => {
          if (chunk.web && chunk.web.uri) {
            sources.push({
              title: chunk.web.title || "المصدر",
              uri: chunk.web.uri
            });
          }
        });
      }

      return { text, sources: sources.length > 0 ? sources : undefined };
    } catch (error) {
      console.error("Gemini Search Error:", error);
      return { text: "حدث خطأ أثناء محاولة البحث والحصول على الإجابة." };
    }
  }

  async summarizeContent(item: PortfolioItem) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Summarize briefly in Arabic: ${item.title} - ${item.description}`;
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || item.description;
    } catch (error) {
      return item.description;
    }
  }
}

export const gemini = new GeminiService();
