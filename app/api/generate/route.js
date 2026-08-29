import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    if (type === "chat") {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      return NextResponse.json({
        type: "chat",
        text: response.text || "",
      });
    }

    if (type === "image") {
      const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: prompt,
        config: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      const image = parts.find((part) => part.inlineData);

      if (!image?.inlineData?.data) {
        return NextResponse.json(
          { error: "No image was returned." },
          { status: 502 }
        );
      }

      return NextResponse.json({
        type: "image",
        mimeType: image.inlineData.mimeType || "image/png",
        data: image.inlineData.data,
      });
    }

    return NextResponse.json(
      { error: "Unsupported generation type." },
      { status: 400 }
    );
  } catch (error) {
    console.error("AI generation error:", error);

    return NextResponse.json(
      { error: error?.message || "AI generation failed." },
      { status: 500 }
    );
  }
}
