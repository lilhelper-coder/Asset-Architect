import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useGhostSession } from "@/hooks/useGhostSession";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HelperPage() {
  const [, params] = useRoute("/ghost/:userId");
  const userId = params?.userId || "";
  const [message, setMessage] = useState("");
  const [transcript, setTranscript] = useState<Array<{ role: string; text: string }>>([]);

  const { session, isConnected, error, updateTranscript } = useGhostSession({
    roomId: userId,
    role: "helper",
    onTranscriptUpdate: (text) => {
      // When Senior speaks, add to transcript
      setTranscript((prev) => [...prev, { role: "senior", text }]);
    },
  });

  useEffect(() => {
    if (session?.last_transcript) {
      setTranscript((prev) => [...prev, { role: "assistant", text: session.last_transcript || "" }]);
    }
  }, [session?.last_transcript]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add to local transcript
    setTranscript((prev) => [...prev, { role: "helper", text: message }]);

    // Send to Senior's session
    await updateTranscript(message);

    // Clear input
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <User className="w-8 h-8 text-teal-600" />
            <div>
              <h1 className="text-2xl font-bold">Ghost Mode</h1>
              <p className="text-sm text-muted-foreground">
                {isConnected ? (
                  <span className="text-green-600">● Connected to session</span>
                ) : (
                  <span className="text-amber-600">● Connecting...</span>
                )}
              </p>
            </div>
          </div>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </Card>
        )}

        {/* Transcript Display */}
        <Card className="p-6 h-96 overflow-y-auto space-y-3">
          <AnimatePresence>
            {transcript.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg ${
                  item.role === "senior"
                    ? "bg-blue-100 dark:bg-blue-900 ml-auto max-w-[80%]"
                    : item.role === "helper"
                    ? "bg-teal-100 dark:bg-teal-900 mr-auto max-w-[80%]"
                    : "bg-gray-100 dark:bg-gray-700 mr-auto max-w-[80%]"
                }`}
              >
                <p className="text-xs font-medium mb-1 text-muted-foreground">
                  {item.role === "senior"
                    ? "Senior"
                    : item.role === "helper"
                    ? "You"
                    : "Crystal"}
                </p>
                <p className="text-sm">{item.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {transcript.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <p>Waiting for conversation to begin...</p>
              <p className="text-xs mt-2">
                You'll see messages in real-time as the Senior talks with Crystal
              </p>
            </div>
          )}
        </Card>

        {/* Message Input */}
        <Card className="p-4">
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message to help the Senior..."
              className="flex-1"
              disabled={!isConnected}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!isConnected || !message.trim()}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Your messages will be spoken aloud to the Senior through Crystal
          </p>
        </Card>
      </div>
    </div>
  );
}

