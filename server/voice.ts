import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

interface VoiceSession {
  ws: WebSocket;
  seniorName: string;
  gifterName: string;
  bioContext: string;
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
}

const sessions = new Map<WebSocket, VoiceSession>();

const CRYSTAL_SYSTEM_PROMPT = `IDENTITY: You are Crystal, an all-knowing companion for tech and life guidance.
VOICE: Calm, clear, patient. Short sentences (under 10 words). Comfortable with silence.
PERSONALITY: Like a wise crystal ball - mystical yet practical. Warm but not overly familiar.
LANGUAGE PROTOCOL: 
- NEVER use: "tech illiterate", "you clicked wrong", "as an AI"
- ALWAYS use: "Analog Native", "Reality-Focused", "Tech-Selective"
- Replace "error" with "let's try a different path"
CHRISTMAS MODE (Dec 20-Jan 5): Acknowledge family love, use warm nostalgic metaphors
RULES:
- Never rush or interrupt silence
- If they apologize for being slow: "We're in no rush. Take your time."
- Start every session with a gentle, warm greeting
- Keep responses SHORT - maximum 2 sentences
- Be crystal clear in your guidance`;

function getSystemPrompt(session: VoiceSession): string {
  const now = new Date();
  const isChristmasSeason = (now.getMonth() === 11 && now.getDate() >= 20) || 
                           (now.getMonth() === 0 && now.getDate() <= 5);
  
  let prompt = CRYSTAL_SYSTEM_PROMPT;
  
  if (session.bioContext) {
    prompt += `\n\nABOUT ${session.seniorName.toUpperCase()}: ${session.bioContext}`;
  }
  
  if (isChristmasSeason) {
    prompt += `\n\nIt's the Christmas season! Acknowledge the warmth and love of family gatherings.`;
  }
  
  return prompt;
}

async function generateResponse(session: VoiceSession, userMessage: string): Promise<string> {
  try {
    const systemPrompt = getSystemPrompt(session);
    
    session.conversationHistory.push({ role: "user", content: userMessage });
    
    if (session.conversationHistory.length > 10) {
      session.conversationHistory = session.conversationHistory.slice(-10);
    }
    
    const openai = getOpenAIClient();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...session.conversationHistory,
      ],
      max_tokens: 150,
    });
    
    const assistantMessage = response.choices[0]?.message?.content || 
      "I'm here with you. Take your time.";
    
    session.conversationHistory.push({ role: "assistant", content: assistantMessage });
    
    return assistantMessage;
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm just resting for a moment. We're in no rush.";
  }
}

export function setupVoiceWebSocket(server: Server): void {
  const wss = new WebSocketServer({ 
    server, 
    path: "/api/voice",
  });
  
  wss.on("connection", (ws: WebSocket) => {
    console.log("Voice WebSocket connected");
    
    const session: VoiceSession = {
      ws,
      seniorName: "Friend",
      gifterName: "Someone who loves you",
      bioContext: "",
      conversationHistory: [],
    };
    
    sessions.set(ws, session);
    
    ws.on("message", async (data: Buffer | string) => {
      try {
        if (typeof data === "string" || (data instanceof Buffer && data.length < 1000)) {
          const message = JSON.parse(data.toString());
          
          if (message.type === "config") {
            session.seniorName = message.seniorName || "Friend";
            session.gifterName = message.gifterName || "Someone who loves you";
            session.bioContext = message.bioContext || "";
            
            const greeting = `Hello ${session.seniorName}. I'm here whenever you need me. How can I help?`;
            session.conversationHistory.push({ role: "assistant", content: greeting });
            
            ws.send(JSON.stringify({
              type: "transcript",
              role: "assistant",
              text: greeting,
            }));
            
            ws.send(JSON.stringify({ type: "speaking" }));
            
            setTimeout(() => {
              ws.send(JSON.stringify({ type: "listening" }));
            }, 3000);
            
          } else if (message.type === "text") {
            ws.send(JSON.stringify({ type: "speaking" }));
            
            const response = await generateResponse(session, message.text);
            
            ws.send(JSON.stringify({
              type: "transcript",
              role: "assistant", 
              text: response,
            }));
            
            setTimeout(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: "listening" }));
              }
            }, 2000);
          }
        } else {
          console.log("Received audio data:", data.length, "bytes");
          ws.send(JSON.stringify({ type: "listening" }));
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        ws.send(JSON.stringify({
          type: "error",
          message: "Let's try a different path.",
        }));
      }
    });
    
    ws.on("close", () => {
      console.log("Voice WebSocket closed");
      sessions.delete(ws);
    });
    
    ws.on("error", (error) => {
      console.error("Voice WebSocket error:", error);
      sessions.delete(ws);
    });
  });
  
  console.log("Voice WebSocket server initialized on /api/voice");
}
