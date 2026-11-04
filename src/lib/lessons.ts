// Lesson catalogue + Cloudflare video source resolution.
// Each lesson can point at a Cloudflare Stream video (streamId) or a direct
// Cloudflare R2 / CDN URL (videoUrl). Set VITE_CF_STREAM_CUSTOMER_CODE to your
// Stream customer subdomain code (customer-<code>.cloudflarestream.com).

export type TranscriptLine = { t: number; text: string };
export type Resource = { name: string; size: string; href: string };

export type Lesson = {
  id: string;
  n: number;
  title: string;
  duration: string;
  summary: string;
  streamId?: string;
  videoUrl?: string;
  poster?: string;
  transcript: TranscriptLine[];
  resources: Resource[];
};

const SAMPLE_HLS = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export function resolveVideoSource(lesson: Lesson): { src: string; isHls: boolean } {
  if (lesson.videoUrl) return { src: lesson.videoUrl, isHls: lesson.videoUrl.includes(".m3u8") };
  const code = import.meta.env["VITE_CF_STREAM_CUSTOMER_CODE"] as string | undefined;
  if (lesson.streamId && code) {
    return {
      src: `https://customer-${code}.cloudflarestream.com/${lesson.streamId}/manifest/video.m3u8`,
      isHls: true,
    };
  }
  return { src: SAMPLE_HLS, isHls: true };
}

export function streamPoster(lesson: Lesson): string | undefined {
  const code = import.meta.env["VITE_CF_STREAM_CUSTOMER_CODE"] as string | undefined;
  if (lesson.poster) return lesson.poster;
  if (lesson.streamId && code)
    return `https://customer-${code}.cloudflarestream.com/${lesson.streamId}/thumbnails/thumbnail.jpg`;
  return undefined;
}

const res = (name: string, size: string): Resource => ({ name, size, href: "#" });

const transcript = (topic: string): TranscriptLine[] => [
  { t: 0, text: `Welcome back. In this lesson we focus on ${topic}.` },
  { t: 30, text: "Let's open the workbook and review the assumptions tab first." },
  { t: 75, text: "Notice how every input cell is coloured blue so it's easy to audit." },
  { t: 130, text: "Now we link the drivers into the calculation section." },
  { t: 200, text: "Always add a check row so errors surface immediately." },
  { t: 280, text: "Let's recap the key steps before moving to the next lesson." },
];

export const lessons: Lesson[] = [
  { id: "l1", n: 1, title: "Model Overview", duration: "5 min", summary: "A tour of the full three-statement model and how the tabs connect.", transcript: transcript("the model structure"), resources: [res("Model Map.pdf", "0.4 MB")] },
  { id: "l2", n: 2, title: "Understanding the Lineages", duration: "18 min", summary: "Trace how each input flows through the model to the outputs.", transcript: transcript("model lineages"), resources: [res("Lineage Cheat Sheet.pdf", "0.6 MB")] },
  { id: "l3", n: 3, title: "Building the Income Statement", duration: "22 min", summary: "In this lesson, we build a detailed income statement with revenue drivers, cost assumptions and key checks.", transcript: transcript("the income statement"), resources: [res("Income Statement Template.xlsx", "1.2 MB"), res("Revenue Drivers Exercise.xlsx", "0.8 MB"), res("Lesson Slides.pdf", "2.1 MB")] },
  { id: "l4", n: 4, title: "Building the Balance Sheet", duration: "22 min", summary: "Construct the balance sheet and make sure it balances every period.", transcript: transcript("the balance sheet"), resources: [res("Balance Sheet Template.xlsx", "1.1 MB")] },
  { id: "l5", n: 5, title: "Building the Cash Flow Statement", duration: "20 min", summary: "Derive cash flow from the income statement and balance sheet movements.", transcript: transcript("the cash flow statement"), resources: [res("Cash Flow Template.xlsx", "1.0 MB")] },
  { id: "l6", n: 6, title: "Model Checks and Error Tracing", duration: "18 min", summary: "Build a checks dashboard and learn to trace errors quickly.", transcript: transcript("model checks"), resources: [res("Checks Dashboard.xlsx", "0.7 MB")] },
];
