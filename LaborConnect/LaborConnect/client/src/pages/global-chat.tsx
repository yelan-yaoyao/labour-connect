import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import type { ChatMessage } from "@shared/schema";

export default function GlobalChat() {
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load initial messages
  const { data: initialMessages = [] } = useQuery({
    queryKey: ['/api/chat/messages'],
    queryFn: async () => {
      const response = await fetch('/api/chat/messages');
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json() as Promise<ChatMessage[]>;
    }
  });

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to chat');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat_message') {
          setMessages(prev => [...prev, data.data]);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from chat');
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !socket) return;

    const chatMessage = {
      type: 'chat_message',
      userId: 'current-user-id', // This should come from auth context
      userName: 'Current User', // This should come from auth context
      message: message.trim()
    };

    socket.send(JSON.stringify(chatMessage));
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="chat-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="page-title">
          Global Chat
        </h1>
        <p className="text-muted-foreground" data-testid="page-description">
          Connect and communicate with workers and employers
        </p>
      </div>

      <Card className="h-96 flex flex-col" data-testid="chat-interface">
        {/* Chat Header */}
        <CardHeader className="border-b border-border">
          <CardTitle className="text-lg" data-testid="chat-header-title">General Discussion</CardTitle>
          <p className="text-sm text-muted-foreground" data-testid="chat-header-status">
            {socket ? 'Connected' : 'Connecting...'}
          </p>
        </CardHeader>

        {/* Chat Messages */}
        <CardContent className="flex-1 p-4 overflow-y-auto space-y-4" data-testid="chat-messages">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground" data-testid="empty-chat">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3" data-testid={`message-${msg.id}`}>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {msg.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-card-foreground" data-testid={`message-name-${msg.id}`}>
                      {msg.userName}
                    </span>
                    <span className="text-xs text-muted-foreground" data-testid={`message-time-${msg.id}`}>
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1" data-testid={`message-text-${msg.id}`}>
                    {msg.message}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Chat Input */}
        <div className="border-t border-border p-4" data-testid="chat-input-area">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!socket}
              className="flex-1"
              data-testid="input-message"
            />
            <Button 
              onClick={sendMessage}
              disabled={!socket || !message.trim()}
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
