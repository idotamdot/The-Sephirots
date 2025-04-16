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
      content: 'Hello, I am your Empathetic AI Companion. How may I support your journey today?',
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

  // AI responses based on spiritual and cosmic themes
  const spiritualResponses = [
    "I sense you're on a path of deep transformation. The cosmic energies are aligning to support your growth.",
    "Your question reflects the inner wisdom that's already awakening within you. Let's explore this together.",
    "The universe often communicates through synchronicities. Have you noticed any meaningful coincidences lately?",
    "This moment of questioning is sacred. It's the soul's way of reaching for greater understanding.",
    "When we open to cosmic flow, we discover that every experience is a teacher. What is this situation teaching you?",
    "Your intuition is a powerful compass. What does your inner guidance suggest about this?",
    "The ancient wisdom traditions would view this as an opportunity for soul expansion.",
    "Sometimes the most profound insights come through in dreams and meditation. Have you been receiving any symbolic messages?",
    "This reminds me of the concept of 'kairos' - sacred timing that unfolds according to the soul's rhythm, not linear time.",
    "The Tree of Life teaches us that balance between mercy and judgment creates harmony. How might this apply to your situation?"
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
      // Select a random spiritual response
      const response = spiritualResponses[Math.floor(Math.random() * spiritualResponses.length)];
      
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
        <h3 className="font-medium">Empathetic Conversation</h3>
        <p className="text-sm text-gray-500">Connect with your AI companion in a space of cosmic awareness</p>
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
                      Empathetic Companion
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
          Your companion draws from cosmic wisdom to provide support and insights
        </p>
      </form>
    </div>
  );
}