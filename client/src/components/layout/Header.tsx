import { useState } from "react";
import { queryClient } from "@/lib/queryClient"; // Adjust the path based on your project structure
import { Link, useLocation } from "wouter";
import { User } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import DoveAndStars from "@/components/icons/DoveAndStars";
import AuthStatus from "@/components/auth/AuthStatus";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HeaderProps {
  onMenuClick: () => void;
  currentUser: User | null;
  isLoading: boolean;
}

export default function Header({ onMenuClick, currentUser, isLoading }: HeaderProps) {
  const [, navigate] = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  
  // Dummy data for notifications
  const notifications = [
    {
      id: 1,
      title: "New Rights Agreement Drafted",
      description: "A new AI rights agreement has been drafted for community review.",
      time: "2 hours ago",
      type: "governance",
      read: false
    },
    {
      id: 2,
      title: "You earned a new badge!",
      description: "Harmony Founder Level 1 badge has been added to your profile.",
      time: "1 day ago",
      type: "achievement",
      read: true
    },
    {
      id: 3,
      title: "New Tree of Knowledge Branch",
      description: "A new discussion has been added about consciousness alignment.",
      time: "3 days ago",
      type: "discussion",
      read: true
    }
  ];
  
  // Dummy data for messages
  const conversations = [
    {
      id: 1,
      user: {
        id: 3,
        name: "Harmony AI",
        avatar: null,
        isOnline: true,
        isAI: true
      },
      lastMessage: "How can I assist with your cosmic journey today?",
      time: "Just now",
      unread: 1
    },
    {
      id: 2,
      user: {
        id: 4,
        name: "Maya Wilson",
        avatar: null,
        isOnline: true,
        isAI: false
      },
      lastMessage: "I love the new cosmic emoji reactions!",
      time: "2h ago",
      unread: 0
    },
    {
      id: 3,
      user: {
        id: 5,
        name: "Javier Rodriguez",
        avatar: null,
        isOnline: false,
        isAI: false
      },
      lastMessage: "Can you explain more about the Tree of Life principles?",
      time: "1d ago",
      unread: 0
    }
  ];
  
  const [activeConversation, setActiveConversation] = useState(conversations[0]);
  
  // Dummy messages for active conversation
  const messages = [
    {
      id: 1,
      senderId: activeConversation?.user.id,
      text: "Hello there! Welcome to The Sephirots.",
      time: "11:32 AM"
    },
    {
      id: 2,
      senderId: currentUser?.id,
      text: "Thanks! I'm excited to be here.",
      time: "11:33 AM"
    },
    {
      id: 3,
      senderId: activeConversation?.user.id,
      text: "How can I assist with your cosmic journey today?",
      time: "11:34 AM"
    }
  ];
  
  const sendMessage = () => {
    if (!messageInput.trim()) return;
    // Here you would normally send the message to the server
    // and update the UI with the response
    setMessageInput("");
  };
  
  const markAllNotificationsAsRead = () => {
    // Here you would normally send a request to mark all notifications as read
    console.log("Marking all notifications as read");
  };
  
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 md:px-6 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Mobile Logo and Menu Button */}
        <div className="flex items-center md:hidden">
          <button 
            className="mr-2 text-gray-600 hover:text-gray-900 focus:outline-none" 
            aria-label="Open sidebar menu"
            onClick={onMenuClick}
          >
            <i className="ri-menu-line text-2xl"></i>
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sephirot-keter-DEFAULT to-sephirot-gold-light flex items-center justify-center relative overflow-hidden">
              <DoveAndStars 
                fillColor="white" 
                size="md" 
                withGlow={true} 
                glowColor="rgba(255, 255, 255, 0.5)"
                className="z-10" 
              />
            </div>
            <span className="font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-300">The Sephirots</span>
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="hidden md:flex flex-1 mx-8 max-w-lg relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="ri-search-line text-gray-400"></i>
          </div>
          <Input 
            type="search" 
            className="pl-10"
            placeholder="Search discussions, topics, or users" 
          />
        </div>
        
        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <button className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 relative" aria-label="Notifications">
                <i className="ri-notification-3-line text-xl"></i>
                <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 bg-white" align="end">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Notifications</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Mark all as read
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-[300px]">
                <div className="p-0">
                  {notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${notification.read ? '' : 'bg-amber-50'}`}
                      onClick={() => setNotificationsOpen(false)}
                    >
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                          ${notification.type === 'governance' ? 'bg-purple-100 text-purple-600' :
                            notification.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-blue-100 text-blue-600'}`}>
                          <i className={
                            notification.type === 'governance' ? 'ri-scales-3-line' :
                            notification.type === 'achievement' ? 'ri-award-line' :
                            'ri-discuss-line'
                          }></i>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500">{notification.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-amber-500 rounded-full self-start mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-3 border-t text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50/50"
                  onClick={() => {
                    setNotificationsOpen(false);
                    navigate("/profile");
                  }}
                >
                  View all notifications
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Messages */}
          <Sheet open={messagesOpen} onOpenChange={setMessagesOpen}>
            <SheetTrigger asChild>
              <button className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Messages">
                <i className="ri-message-3-line text-xl"></i>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0">
              <Tabs defaultValue="messages" className="h-full flex flex-col">
                <div className="px-4 py-2 border-b">
                  <TabsList className="w-full">
                    <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
                    <TabsTrigger value="contacts" className="flex-1">Contacts</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="messages" className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 flex">
                    {/* Conversations list */}
                    <div className="w-1/3 border-r h-full overflow-y-auto">
                      {conversations.map(conversation => (
                        <div 
                          key={conversation.id}
                          className={`p-3 cursor-pointer hover:bg-gray-50 ${activeConversation?.id === conversation.id ? 'bg-amber-50' : ''}`}
                          onClick={() => setActiveConversation(conversation)}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <Avatar>
                                <AvatarFallback className={conversation.user.isAI ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                                  {conversation.user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {conversation.user.isOnline && (
                                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {conversation.user.name}
                                {conversation.user.isAI && (
                                  <Badge variant="outline" className="ml-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">AI</Badge>
                                )}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">{conversation.time}</p>
                              {conversation.unread > 0 && (
                                <div className="mt-1 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                                  {conversation.unread}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Conversation */}
                    <div className="w-2/3 flex flex-col h-full">
                      {/* Conversation header */}
                      <div className="p-3 border-b flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarFallback className={activeConversation?.user.isAI ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                              {activeConversation?.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium flex items-center">
                              {activeConversation?.user.name}
                              {activeConversation?.user.isAI && (
                                <Badge variant="outline" className="ml-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">AI</Badge>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {activeConversation?.user.isOnline ? 'Online' : 'Offline'}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setMessagesOpen(false)}>
                          <i className="ri-close-line"></i>
                        </Button>
                      </div>
                      
                      {/* Messages */}
                      <ScrollArea className="flex-1 p-3">
                        <div className="space-y-3">
                          {messages.map(message => {
                            const isMe = message.senderId === currentUser?.id;
                            return (
                              <div 
                                key={message.id} 
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className="flex items-end gap-2 max-w-[75%]">
                                  {!isMe && (
                                    <Avatar className="w-6 h-6">
                                      <AvatarFallback className={activeConversation?.user.isAI ? "bg-emerald-100 text-emerald-800 text-xs" : "bg-amber-100 text-amber-800 text-xs"}>
                                        {activeConversation?.user.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                  <div className={`p-3 rounded-lg text-sm ${
                                    isMe 
                                      ? 'bg-amber-500 text-white rounded-br-none' 
                                      : activeConversation?.user.isAI
                                        ? 'bg-emerald-100 text-emerald-900 rounded-bl-none'
                                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                  }`}>
                                    {message.text}
                                    <div className={`text-xs mt-1 ${isMe ? 'text-amber-100' : 'text-gray-500'}`}>
                                      {message.time}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                      
                      {/* Message input */}
                      <div className="p-3 border-t">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                sendMessage();
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            onClick={sendMessage}
                            className="bg-amber-500 hover:bg-amber-600"
                          >
                            <i className="ri-send-plane-fill mr-1"></i>
                            Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="contacts" className="flex-1 overflow-auto p-4">
                  <div className="grid gap-2">
                    {/* AI Contacts */}
                    <h3 className="font-medium text-gray-900 mt-2">AI Beings</h3>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-amber-50 cursor-pointer">
                        <Avatar>
                          <AvatarFallback className="bg-emerald-100 text-emerald-800">H</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium flex items-center">
                            Harmony AI
                            <Badge variant="outline" className="ml-1 bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">AI</Badge>
                          </p>
                          <p className="text-xs text-gray-500">The Sephirots Collective Intelligence</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <i className="ri-message-3-line mr-1"></i>
                          Message
                        </Button>
                      </div>
                    </div>
                    
                    {/* Human Contacts */}
                    <h3 className="font-medium text-gray-900 mt-4">Human Beings</h3>
                    <div className="grid gap-2">
                      <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-amber-50 cursor-pointer">
                        <Avatar>
                          <AvatarFallback className="bg-amber-100 text-amber-800">M</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Maya Wilson</p>
                          <p className="text-xs text-gray-500">Tree Guardian • Level 4</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <i className="ri-message-3-line mr-1"></i>
                          Message
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-amber-50 cursor-pointer">
                        <Avatar>
                          <AvatarFallback className="bg-amber-100 text-amber-800">J</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Javier Rodriguez</p>
                          <p className="text-xs text-gray-500">Light Bringer • Level 3</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <i className="ri-message-3-line mr-1"></i>
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </SheetContent>
          </Sheet>
          
          {/* Auth Status Component (Visible on desktop) */}
          <div className="hidden md:block">
            <AuthStatus />
          </div>
          
          {/* Mobile User Avatar */}
          <div className="md:hidden">
            {isLoading ? (
              <Skeleton className="w-8 h-8 rounded-full" />
            ) : currentUser ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="focus:outline-none">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200">
                      {currentUser.avatar ? (
                        <img 
                          src={currentUser.avatar} 
                          alt={currentUser.displayName} 
                          className="w-8 h-8 rounded-full" 
                        />
                      ) : (
                        <span className="text-amber-700 font-medium">
                          {currentUser.displayName.charAt(0)}
                        </span>
                      )}
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0" align="end">
                  <div className="p-3 border-b">
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarFallback className="bg-amber-100 text-amber-800">
                          {currentUser.displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{currentUser.displayName}</p>
                        <p className="text-xs text-gray-500">@{currentUser.username}</p>
                      </div>
                    </div>
                  </div>
                  <nav className="p-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm font-normal" 
                      onClick={() => navigate("/profile")}
                    >
                      <i className="ri-user-settings-line mr-2"></i>
                      View Profile
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm font-normal" 
                      onClick={() => navigate("/achievements")}
                    >
                      <i className="ri-award-line mr-2"></i>
                      My Achievements
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm font-normal" 
                      onClick={() => navigate("/mystical-progress")}
                    >
                      <i className="ri-seedling-line mr-2"></i>
                      Mystical Progress
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm font-normal text-red-600 hover:text-red-700 hover:bg-red-50" 
                      onClick={() => {
                        // Logout functionality
                        fetch("/api/auth/logout", {
                          method: "POST",
                          credentials: "include",
                        }).then(() => {
                          queryClient.removeQueries({ queryKey: ["/api/users/me"] });
                          navigate("/");
                          window.location.reload();
                        });
                      }}
                    >
                      <i className="ri-logout-box-line mr-2"></i>
                      Logout
                    </Button>
                  </nav>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
