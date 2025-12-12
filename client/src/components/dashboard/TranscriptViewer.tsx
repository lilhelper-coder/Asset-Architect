import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User, Bot } from "lucide-react";
import { motion } from "framer-motion";

interface TranscriptMessage {
  role: string;
  text: string;
  timestamp: string;
}

interface TranscriptViewerProps {
  sessionId: string;
  messages: TranscriptMessage[];
}

export function TranscriptViewer({ sessionId, messages }: TranscriptViewerProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Session Transcript</CardTitle>
              <p className="text-sm text-muted-foreground">
                Session {sessionId.slice(0, 8)}
              </p>
            </div>
          </div>
          <Badge>{messages.length} messages</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No messages in this session</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === "user"
                        ? "bg-primary/10"
                        : "bg-secondary/50"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-primary" />
                    ) : (
                      <Bot className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div
                    className={`flex-1 max-w-[80%] ${
                      message.role === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

