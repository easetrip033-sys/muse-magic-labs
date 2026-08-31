import { createFileRoute } from "@tanstack/react-router";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/videos";

export const Route = createFileRoute("/api/generate-video")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const {
          prompt,
          durationSeconds = 8,
          aspectRatio = "9:16",
        } = (await request.json()) as {
          prompt: string;
          durationSeconds?: number;
          aspectRatio?: string;
        };
        if (!prompt?.trim()) {
          return new Response(JSON.stringify({ error: "Prompt is required" }), { status: 400 });
        }

        const res = await fetch(GATEWAY, {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/veo-3.1-lite",
            instances: [{ prompt }],
            parameters: {
              durationSeconds,
              resolution: "720p",
              aspectRatio,
              sampleCount: 1,
              generateAudio: true,
            },
          }),
        });
        const text = await res.text();
        if (!res.ok) {
          let message = "Video generation failed";
          try {
            message = (JSON.parse(text) as { message?: string }).message ?? message;
          } catch {
            /* ignore */
          }
          return new Response(JSON.stringify({ error: message }), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(text, { headers: { "Content-Type": "application/json" } });
      },

      GET: async ({ request }) => {
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });

        if (url.searchParams.get("content") === "1") {
          const video = await fetch(`${GATEWAY}/${id}/content`, {
            headers: { Authorization: `Bearer ${key}` },
          });
          if (!video.ok || !video.body) {
            return new Response(await video.text(), { status: video.status });
          }
          return new Response(video.body, {
            headers: {
              "Content-Type": "video/mp4",
              "Cache-Control": "private, max-age=600",
            },
          });
        }

        const res = await fetch(`${GATEWAY}/${id}`, {
          headers: { Authorization: `Bearer ${key}` },
        });
        return new Response(await res.text(), {
          status: res.status,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
