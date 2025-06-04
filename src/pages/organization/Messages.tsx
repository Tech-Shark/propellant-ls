
import { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { OrganizationSidebar } from "@/components/OrganizationSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send, MoreVertical, Paperclip, Star, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([
    {
      id: "1",
      name: "Sarah Chen",
      title: "Senior React Developer",
      lastMessage: "Thanks for reaching out! I'd love to discuss the React position.",
      timestamp: "2 hours ago",
      unread: 2,
      online: true
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      title: "Data Scientist",
      lastMessage: "The project sounds interesting. When would be a good time for a call?",
      timestamp: "1 day ago",
      unread: 0,
      online: false
    },
    {
      id: "3",
      name: "Emily Johnson",
      title: "UI/UX Designer",
      lastMessage: "I've attached my portfolio for your review.",
      timestamp: "3 days ago",
      unread: 1,
      online: true
    }
  ]);

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "organization",
      content: "Hi Sarah! I came across your profile and I'm impressed with your React expertise. We have an exciting senior developer position that might interest you.",
      timestamp: "2:30 PM"
    },
    {
      id: "2",
      sender: "talent",
      content: "Thanks for reaching out! I'd love to discuss the React position. Could you tell me more about the team and tech stack?",
      timestamp: "3:15 PM"
    },
    {
      id: "3",
      sender: "organization",
      content: "Absolutely! We're a team of 12 developers working with React, TypeScript, and Node.js. We're building a fintech platform that's scaling rapidly.",
      timestamp: "3:20 PM"
    },
    {
      id: "4",
      sender: "talent",
      content: "That sounds perfect! I have extensive experience with all those technologies. What's the next step?",
      timestamp: "3:45 PM"
    }
  ]);

  const { toast } = useToast();

  useEffect(() => {
    // Check if there's a selected talent from talent pool
    const selectedTalent = localStorage.getItem('selectedTalent');
    if (selectedTalent) {
      const talent = JSON.parse(selectedTalent);
      
      // Check if conversation already exists
      const existingConversation = conversations.find(conv => conv.name === talent.name);
      
      if (!existingConversation) {
        // Add new conversation
        const newConversation = {
          id: (conversations.length + 1).toString(),
          name: talent.name,
          title: talent.title,
          lastMessage: "New conversation started",
          timestamp: "Now",
          unread: 0,
          online: true
        };
        
        setConversations(prev => [newConversation, ...prev]);
        setSelectedConversation(newConversation.id);
        
        // Clear the selected talent from storage
        localStorage.removeItem('selectedTalent');
        
        toast({
          title: "New Conversation",
          description: `Conversation started with ${talent.name}`,
        });
      } else {
        setSelectedConversation(existingConversation.id);
        localStorage.removeItem('selectedTalent');
      }
    }
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageId = (messages.length + 1).toString();
      const newMsg = {
        id: messageId,
        sender: "organization",
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
      
      // Update conversation last message
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation 
            ? { ...conv, lastMessage: newMessage, timestamp: "Now" }
            : conv
        )
      );
      
      toast({
        title: "Message Sent",
        description: "Your message has been delivered successfully.",
      });
    }
  };

  const selectedConversationData = conversations.find(conv => conv.id === selectedConversation);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-950">
        <OrganizationSidebar />
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-slate-400 hover:text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Messages</h1>
                  <p className="text-slate-400">Connect with talented professionals</p>
                </div>
              </div>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </div>
          </div>

          <div className="flex h-[calc(100vh-120px)]">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-slate-800 bg-slate-900/50">
              <div className="p-4 border-b border-slate-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10 bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="overflow-y-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-800/50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-slate-800/50 border-l-4 border-l-orange-600' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-orange-600 text-white">
                            {conversation.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-white truncate">{conversation.name}</p>
                          <span className="text-xs text-slate-400">{conversation.timestamp}</span>
                        </div>
                        <p className="text-sm text-slate-400 truncate">{conversation.title}</p>
                        <p className="text-sm text-slate-300 truncate mt-1">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <Badge className="bg-orange-600 text-white">{conversation.unread}</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 flex flex-col">
              {selectedConversation && selectedConversationData ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-orange-600 text-white">
                            {selectedConversationData.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{selectedConversationData.name}</p>
                          <p className="text-sm text-slate-400">{selectedConversationData.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'organization' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'organization'
                            ? 'bg-orange-600 text-white'
                            : 'bg-slate-800 text-slate-100'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'organization' ? 'text-orange-100' : 'text-slate-400'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 bg-slate-800 border-slate-600 text-white resize-none"
                        rows={2}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-slate-400 text-lg">Select a conversation to start messaging</p>
                    <p className="text-slate-500 text-sm mt-2">Or browse talent pool to start new conversations</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Messages;
