import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { InferenceClient } from "@huggingface/inference";

export async function POST(request) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    // =========================
    // GEMINI CHAT
    // =========================
    if (type === "chat") {
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
          { error: "GEMINI_API_KEY is not configured." },
          { status: 500 }
        );
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      return NextResponse.json({
        type: "chat",
        text: response.text || "",
      });
    }

    // =========================
    // AI WRITER
    // =========================
    if (type === "writer") {
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
          { error: "GEMINI_API_KEY is not configured." },
          { status: 500 }
        );
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are a professional AI writer. Write clear, useful, well-structured content based on this request. Use headings and bullet points when helpful.\n\nRequest:\n${prompt}`,
      });

      return NextResponse.json({
        type: "writer",
        text: response.text || "",
      });
    }

    // =========================
    // AI ASSISTANT
    // =========================
    if (type === "assistant") {
      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
          { error: "GEMINI_API_KEY is not configured." },
          { status: 500 }
        );
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are GoogleAi Assistant. Give a direct, helpful and accurate answer. If the request needs steps, provide numbered steps.\n\nUser request:\n${prompt}`,
      });

      return NextResponse.json({
        type: "assistant",
        text: response.text || "",
      });
    }

    // =========================
    // HUGGING FACE IMAGE
    // =========================
    if (type === "image") {
      if (!process.env.HF_TOKEN) {
        return NextResponse.json(
          { error: "HF_TOKEN is not configured." },
          { status: 500 }
        );
      }

      const hf = new InferenceClient(process.env.HF_TOKEN);

      const image = await hf.textToImage({
        model: "black-forest-labs/FLUX.1-schnell",
        inputs: prompt,
        parameters: {
          num_inference_steps: 4,
        },
      });

      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return NextResponse.json({
        type: "image",
        mimeType: image.type || "image/png",
        data: buffer.toString("base64"),
      });
    }

    return NextResponse.json(
      { error: "Unsupported generation type." },
      { status: 400 }
    );
  } catch (error) {
    const msg = String(error?.message || error || "");
    if (
      error?.status === 429 ||
      msg.includes("429") ||
      msg.includes("RESOURCE_EXHAUSTED") ||
      msg.includes("quota")
    ) {
      return Response.json(
        {
          error: "AI service quota temporarily reached.",
          message: "AI quota is temporarily unavailable. Please try again shortly."
        },
        { status: 200 }
      );
    }
    console.error("AI generation error:", error);

    return NextResponse.json(
      {
        error: error?.message || "AI generation failed.",
      },
      { status: 500 }
    );
  }
}
