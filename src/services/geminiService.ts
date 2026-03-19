import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export type AnalysisType = 'pros-cons' | 'comparison' | 'swot';

export interface AnalysisResult {
  type: AnalysisType;
  content: string;
  summary: string;
  pros?: string[];
  cons?: string[];
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
}

export async function analyzeDecision(decision: string, type: AnalysisType): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  let prompt = "";
  let responseSchema: any = {
    type: Type.OBJECT,
    properties: {
      content: { type: Type.STRING, description: "The detailed analysis in Markdown format." },
      summary: { type: Type.STRING, description: "A brief 1-2 sentence executive summary of the recommendation." }
    },
    required: ["content", "summary"]
  };

  if (type === 'pros-cons') {
    responseSchema.properties.pros = { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "A list of pros."
    };
    responseSchema.properties.cons = { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "A list of cons."
    };
    responseSchema.required.push("pros", "cons");
    prompt = `Analyze the following business decision by providing a detailed list of Pros and Cons. Decision: "${decision}". Return a list of pros and a list of cons separately, plus a markdown content combining them and a summary.`;
  } else if (type === 'comparison') {
    prompt = `Analyze the following business decision by providing a comprehensive, high-intelligence comparison matrix. Decision: "${decision}". 
    
    Your goal is to provide a sophisticated evaluation that allows stakeholders to weigh different strategic paths against critical success factors.
    
    CRITICAL: You MUST format the analysis as a standard Markdown table with the following structure:
    - The FIRST column should list the "Criteria" or "Factors" (e.g., Strategic Fit, ROI, Risk Profile, Resource Intensity, Scalability).
    - Each SUBSEQUENT column should represent a distinct "Option" or "Path" (e.g., Option A: Status Quo, Option B: Aggressive Expansion, Option C: Phased Implementation).
    - The cells should contain specific, data-driven analysis or qualitative evaluations that highlight the trade-offs.
    
    Example Structure:
    | Criteria | Option A: [Name] | Option B: [Name] | Option C: [Name] |
    | :--- | :--- | :--- | :--- |
    | Strategic Fit | High alignment with... | Moderate alignment... | Low alignment... |
    | Financial Impact | Estimated $2M... | Estimated $5M... | Estimated $1M... |
    | Risk Profile | Low risk, but... | High risk due to... | Moderate risk... |
    
    Include a brief, decisive executive summary separately in the 'summary' field that offers a clear recommendation based on the matrix.`;
  } else if (type === 'swot') {
    responseSchema.properties.strengths = { type: Type.ARRAY, items: { type: Type.STRING } };
    responseSchema.properties.weaknesses = { type: Type.ARRAY, items: { type: Type.STRING } };
    responseSchema.properties.opportunities = { type: Type.ARRAY, items: { type: Type.STRING } };
    responseSchema.properties.threats = { type: Type.ARRAY, items: { type: Type.STRING } };
    responseSchema.required.push("strengths", "weaknesses", "opportunities", "threats");
    prompt = `Perform a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for the following business decision: "${decision}". 
    
    CRITICAL: Return each category (strengths, weaknesses, opportunities, threats) as a separate array of points. 
    Also provide a combined Markdown 'content' section and a brief executive 'summary'.`;
  }

  const result = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
      systemInstruction: "You are a professional business consultant. Provide objective, data-driven, and insightful analysis for business decisions. Use Markdown for formatting tables and lists."
    }
  });

  const parsed = JSON.parse(result.text || "{}");
  
  return {
    type,
    content: parsed.content || "No analysis generated.",
    summary: parsed.summary || "No summary available.",
    pros: parsed.pros,
    cons: parsed.cons,
    strengths: parsed.strengths,
    weaknesses: parsed.weaknesses,
    opportunities: parsed.opportunities,
    threats: parsed.threats
  };
}
