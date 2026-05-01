import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const hasImage = messages.some((m: any) => Array.isArray(m.content));
    const model = hasImage ? "anthropic/claude-3.5-sonnet" : "openrouter/auto";

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages,
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-referer": "Http://localhost:3000",
          "X-Type": "Ny Bext.js App",
        },
        responseType: "stream",
      },
    );

    const stream = response.data;

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        stream.on("data", (chunk: any) => {
          const payloads = chunk.toString().split("\n\n");

          for (const payload of payloads) {
            if (payload.includes("[DONE]")) {
              controller.close();
              return;
            }

            if (payload.startsWith("data: ")) {
              try {
                const data = JSON.parse(payload.replace("data: ", ""));
                const text = data.choices?.[0]?.delta?.content;

                if (text) {
                  controller.enqueue(encoder.encode(text));
                }
              } catch (error) {
                console.error("Error parsing stream:", error);
              }
            }
          }
        });

        stream.on("end", () => {
          controller.close();
        });

        stream.on("error", (err: any) => {
          console.error("Stream error:", err);
          controller.error(err);
        });
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("API error: ", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
