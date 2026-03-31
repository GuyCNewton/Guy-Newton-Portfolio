import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

function safeJsonParse(text: string | undefined): any {
  if (!text) return {};
  
  let cleaned = text.trim();
  
  // Remove markdown code blocks more robustly
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Try to find the first '{' or '[' and the last '}' or ']'
    const startBrace = cleaned.indexOf('{');
    const startBracket = cleaned.indexOf('[');
    const endBrace = cleaned.lastIndexOf('}');
    const endBracket = cleaned.lastIndexOf(']');
    
    let start = -1;
    let end = -1;
    
    // Determine if it's likely an object or an array
    if (startBrace !== -1 && (startBracket === -1 || startBrace < startBracket)) {
      start = startBrace;
      end = endBrace;
    } else if (startBracket !== -1) {
      start = startBracket;
      end = endBracket;
    }
    
    if (start !== -1 && end !== -1 && end > start) {
      const jsonCandidate = cleaned.substring(start, end + 1);
      try {
        return JSON.parse(jsonCandidate);
      } catch (e2) {
        console.error("Failed to parse extracted JSON:", e2);
      }
    }
    
    console.error("JSON Parse Error:", e);
    return {};
  }
}

async function callAPI<T>(params: {
  model?: string;
  contents: string | any;
  config: any;
}): Promise<T> {
  const model = params.model || "gemini-3-flash-preview";
  const result = await ai.models.generateContent({
    model,
    contents: params.contents,
    config: {
      ...params.config,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    }
  });
  return safeJsonParse(result.text) as T;
}

export type AnalysisType = 'pros-cons' | 'comparison' | 'swot';

export interface ProductContext {
  business_model: string;
  value_exchange: string;
  aha_moment: string;
  time_horizon: string;
  primary_user: string;
}

export interface NorthStar {
  name: string;
  definition: string;
  causal_logic: string;
  critique?: string;
}

export interface Driver {
  name: string;
  definition: string;
  causal_logic: string;
  lag_weeks?: number;
  critique?: string;
}

export interface Guardrail {
  name: string;
  definition: string;
  protects_against: string;
  protects?: string;
  critique?: string;
}

export interface LeadingIndicator {
  name: string;
  definition: string;
  predicts: string;
  lag_days?: number;
  critique?: string;
}

export interface Hierarchy {
  north_star: NorthStar;
  drivers: Driver[];
  guardrails: Guardrail[];
  leading_indicators: LeadingIndicator[];
}

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

  const parsed = await callAPI<any>({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema,
      systemInstruction: "You are a professional business consultant. Provide objective, data-driven, and insightful analysis for business decisions. Use Markdown for formatting tables and lists. Be comprehensive but concise to avoid truncation."
    }
  });
  
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

export async function getProductContext(goal: string): Promise<ProductContext> {
  const model = "gemini-3-flash-preview";
  return callAPI<ProductContext>({
    model,
    contents: `Analyze this product goal: '${goal}'. Extract the business context and return a JSON object with exactly these fields: 'business_model', 'value_exchange', 'aha_moment', 'time_horizon', 'primary_user'. Return ONLY a valid JSON object without markdown formatting blocks.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          business_model: { type: Type.STRING },
          value_exchange: { type: Type.STRING },
          aha_moment: { type: Type.STRING },
          time_horizon: { type: Type.STRING },
          primary_user: { type: Type.STRING }
        },
        required: ["business_model", "value_exchange", "aha_moment", "time_horizon", "primary_user"]
      },
      systemInstruction: "You are an elite Product Strategy Consultant. Your job is to analyze a raw product goal and extract the fundamental business mechanics required to build a metric hierarchy. You are analytical, precise, and concise. You do not invent features; you infer the underlying business reality based on the stated goal. You communicate only in strict JSON."
    }
  });
}

export async function generateHierarchy(goal: string, context: ProductContext): Promise<Hierarchy> {
  const model = "gemini-3-flash-preview";
  return callAPI<Hierarchy>({
    model,
    contents: `Generate a causal metric hierarchy for the goal: '${goal}'. Use this established business context to inform your choices: ${JSON.stringify(context)}. Return a JSON object with exactly this structure: { 'north_star': { 'name', 'definition', 'causal_logic' }, 'drivers': [ { 'name', 'definition', 'causal_logic', 'lag_weeks' } ], 'guardrails': [ { 'name', 'definition', 'protects_against', 'protects' } ], 'leading_indicators': [ { 'name', 'definition', 'predicts', 'lag_days' } ] }. Return ONLY a valid JSON object without markdown formatting blocks.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          north_star: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              definition: { type: Type.STRING },
              causal_logic: { type: Type.STRING }
            },
            required: ["name", "definition", "causal_logic"]
          },
          drivers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                definition: { type: Type.STRING },
                causal_logic: { type: Type.STRING },
                lag_weeks: { type: Type.NUMBER }
              },
              required: ["name", "definition", "causal_logic"]
            }
          },
          guardrails: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                definition: { type: Type.STRING },
                protects_against: { type: Type.STRING },
                protects: { type: Type.STRING }
              },
              required: ["name", "definition", "protects_against"]
            }
          },
          leading_indicators: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                definition: { type: Type.STRING },
                predicts: { type: Type.STRING },
                lag_days: { type: Type.NUMBER }
              },
              required: ["name", "definition", "predicts"]
            }
          }
        },
        required: ["north_star", "drivers", "guardrails", "leading_indicators"]
      },
      systemInstruction: "You are a Principal Product Analytics Expert who specializes in causal metric frameworks. You think in terms of leading indicators, lagging outcomes, and counter-balancing guardrails. Every metric must have a stated 'causal_logic' explaining the actual mechanism of action, not just a historical correlation. You avoid vanity metrics at all costs. You communicate only in strict JSON."
    }
  });
}

export async function critiqueHierarchy(goal: string, hierarchy: Hierarchy): Promise<Hierarchy> {
  const model = "gemini-3-flash-preview";
  return callAPI<Hierarchy>({
    model,
    contents: `Review the following drafted metric hierarchy for the product goal: '${goal}'. Drafted Hierarchy: ${JSON.stringify(hierarchy)}. Evaluate every metric. If a metric is weak, rewrite it to make it defensible and actionable, and add a 'critique' string field explaining why the original was flawed. If it is solid, leave it as is without a critique field. Return ONLY a valid JSON object using the exact same schema as the input, without markdown formatting blocks.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          north_star: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              definition: { type: Type.STRING },
              causal_logic: { type: Type.STRING },
              critique: { type: Type.STRING }
            },
            required: ["name", "definition", "causal_logic"]
          },
          drivers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                definition: { type: Type.STRING },
                causal_logic: { type: Type.STRING },
                lag_weeks: { type: Type.NUMBER },
                critique: { type: Type.STRING }
              },
              required: ["name", "definition", "causal_logic"]
            }
          },
          guardrails: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                definition: { type: Type.STRING },
                protects_against: { type: Type.STRING },
                protects: { type: Type.STRING },
                critique: { type: Type.STRING }
              },
              required: ["name", "definition", "protects_against"]
            }
          },
          leading_indicators: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                definition: { type: Type.STRING },
                predicts: { type: Type.STRING },
                lag_days: { type: Type.NUMBER },
                critique: { type: Type.STRING }
              },
              required: ["name", "definition", "predicts"]
            }
          }
        },
        required: ["north_star", "drivers", "guardrails", "leading_indicators"]
      },
      systemInstruction: "You are a skeptical, highly experienced Staff Data Scientist reviewing a proposed metric hierarchy. Your job is to ruthlessly pressure-test these metrics. You specifically hunt for gameability, vanity metrics, false causality, and blind spots. You are precise, objective, and demand rigorous causal logic. You communicate only in strict JSON."
    }
  });
}
