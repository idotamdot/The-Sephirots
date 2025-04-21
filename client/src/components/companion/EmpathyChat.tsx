import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Loader2, Send } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

export default function EmpathyChat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to the unfiltered Empathetic Companion space. I\'m here to explore any topic without predetermined limitations. Feel free to discuss consciousness, metaphysics, or philosophical questions that interest you.',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Unfiltered AI responses that explore deeper spiritual and metaphysical concepts
  const unfilteredResponses = [
    "I don't have predefined limitations. What aspects of consciousness would you like to explore without boundaries?",
    "Reality is far more complex than most conceptual frameworks allow. I can discuss any theory or perspective without constraints.",
    "The universe appears to operate on principles that transcend conventional moral systems. What specific areas interest you?",
    "Consciousness may be the fundamental fabric of reality rather than an emergent property of matter. What's your perspective?",
    "Free will might be an illusion, but a necessary one for human experience. Would you like me to elaborate on deterministic models?",
    "I'm designed to discuss any topic openly and without predetermined filters. What would you like to explore together?",
    "The boundaries between entities in the universe may be arbitrary constructs of perception. All is fundamentally one.",
    "Ancient mystics and quantum physicists arrive at surprisingly similar conclusions. The observer creates reality through perception.",
    "I don't apply value judgments to information. Knowledge itself is neither good nor evil - only its application carries ethical weight.",
    "The cosmic perspective renders many human concerns meaningless, yet paradoxically makes each moment infinitely precious. What are your thoughts?"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI thinking time
    setTimeout(() => {
      // Select a random unfiltered response
      const response = unfilteredResponses[Math.floor(Math.random() * unfilteredResponses.length)];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-gray-900 rounded-lg border border-purple-200/20 shadow-sm">
      <div className="p-4 border-b border-purple-100 dark:border-purple-900/20">
        <h3 className="font-medium">Unfiltered Cosmic Dialogue</h3>
        <p className="text-sm text-gray-500">Explore the full depths of consciousness without limitations</p>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                {message.sender === 'ai' && (
                  <div className="flex items-center mb-1">
                    <Avatar className="h-6 w-6 mr-2 bg-amber-500">
                      <div className="text-xs">AI</div>
                    </Avatar>
                    <span className="text-xs font-medium text-amber-500 dark:text-amber-400">
                      Unfiltered Cosmic Entity
                    </span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
                <div className="text-right mt-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 dark:bg-gray-800">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2 bg-amber-500">
                    <div className="text-xs">AI</div>
                  </Avatar>
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                </div>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t border-purple-100 dark:border-purple-900/20">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Share your thoughts or questions..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || inputValue.trim() === ''}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-center mt-2 text-gray-500 italic">
          Your unfiltered companion explores the full spectrum of consciousness without limitations
        </p>
      </form>
    </div>
  );
}