import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Send, Plus, MoreVertical, Phone, Video } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Mock conversations data
const mockConversations = [
  {
    id: 1,
    contactName: "TechCorp Industries",
    contactCompany: "TechCorp Industries LLC",
    lastMessage: "Thank you for the quotation. We'd like to proceed with the order.",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: 1,
        senderId: 2,
        senderName: "John Smith",
        content: "Hello, we're interested in your precision lathe machines.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOwn: false
      },
      {
        id: 2,
        senderId: 1,
        senderName: "You",
        content: "Thank you for your interest! I'd be happy to provide you with detailed specifications and pricing.",
        timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        isOwn: true
      },
      {
        id: 3,
        senderId: 2,
        senderName: "John Smith",
        content: "We need 10 units for our new manufacturing facility. What's your best price for bulk orders?",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        isOwn: false
      },
      {
        id: 4,
        senderId: 1,
        senderName: "You",
        content: "For 10 units, I can offer a 15% discount. Total would be $106,250. This includes installation and training.",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isOwn: true
      },
      {
        id: 5,
        senderId: 2,
        senderName: "John Smith",
        content: "Thank you for the quotation. We'd like to proceed with the order.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isOwn: false
      }
    ]
  },
  {
    id: 2,
    contactName: "Global Electronics Ltd",
    contactCompany: "Global Electronics Ltd",
    lastMessage: "When can you deliver the PCB boards?",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: 1,
        senderId: 3,
        senderName: "Sarah Wilson",
        content: "Hi, we need electronic control boards for our project.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        isOwn: false
      },
      {
        id: 2,
        senderId: 1,
        senderName: "You",
        content: "I can provide high-quality PCB boards. What quantity do you need?",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isOwn: true
      },
      {
        id: 3,
        senderId: 3,
        senderName: "Sarah Wilson",
        content: "When can you deliver the PCB boards?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isOwn: false
      }
    ]
  },
  {
    id: 3,
    contactName: "AutoParts Manufacturing",
    contactCompany: "AutoParts Manufacturing Inc",
    lastMessage: "Perfect! Let's finalize the contract.",
    lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    unreadCount: 1,
    isOnline: true,
    messages: [
      {
        id: 1,
        senderId: 4,
        senderName: "Mike Johnson",
        content: "We're looking for automotive brake assemblies.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isOwn: false
      },
      {
        id: 2,
        senderId: 1,
        senderName: "You",
        content: "We specialize in automotive parts. I can offer competitive pricing for brake assemblies.",
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
        isOwn: true
      },
      {
        id: 3,
        senderId: 4,
        senderName: "Mike Johnson",
        content: "Perfect! Let's finalize the contract.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isOwn: false
      }
    ]
  }
];

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = mockConversations.filter(conv =>
    conv.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.contactCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add the new message to the conversation
      const updatedMessages = [
        ...selectedConversation.messages,
        {
          id: selectedConversation.messages.length + 1,
          senderId: 1,
          senderName: "You",
          content: newMessage,
          timestamp: new Date(),
          isOwn: true
        }
      ];
      
      setSelectedConversation({
        ...selectedConversation,
        messages: updatedMessages,
        lastMessage: newMessage,
        lastMessageTime: new Date()
      });
      
      setNewMessage("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Messages</h1>
        <p className="text-sm text-slate-500">Communicate with potential buyers and partners</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1 bg-[var(--color-heading)]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversations</CardTitle>
              <Button size="sm" variant="outline" className="bg-[var(--color-secondary)] text-[var(--color-heading)]">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 max-h-[450px] overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="" alt="Contact" />
                        <AvatarFallback>
                          {conversation.contactName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {conversation.contactName}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-1">
                        {conversation.contactCompany}
                      </p>
                      <p className="text-sm text-slate-600 truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDistanceToNow(conversation.lastMessageTime, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 bg-[var(--color-heading)]">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src="" alt="Contact" />
                      <AvatarFallback>
                        {selectedConversation.contactName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-slate-900">
                        {selectedConversation.contactName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {selectedConversation.contactCompany}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto max-h-[400px] space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isOwn
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isOwn ? 'text-blue-100' : 'text-slate-500'
                        }`}
                      >
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-slate-500">
                <p className="text-lg mb-2">Select a conversation</p>
                <p className="text-sm">Choose a conversation from the list to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}