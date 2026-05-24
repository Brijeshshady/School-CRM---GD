import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Plus, 
  MessageSquare,
  ArrowLeft,
  Check,
  CheckCheck,
  Pin,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Download,
  X
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "../../../app/context/AuthContext";
import { useChat } from "../hooks/useChat";

export const ChatInterface = () => {
  const { user } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  
  const { 
    conversations,
    isConversationsLoading,
    messages,
    sendMessage,
    searchUsers,
    togglePin,
    uploadFile,
    typingUsers,
    onlineStatuses,
    emitTyping
  } = useChat(selectedConversationId);

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  // Handle typing emitter
  const handleInputChange = (e) => {
    setMessageText(e.target.value);
    emitTyping(e.target.value.length > 0);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && !attachment) return;

    let attachments = [];
    if (attachment) {
      attachments.push(attachment.url);
    }

    try {
      await sendMessage({
        conversationId: selectedConversationId,
        text: messageText || (attachment ? `Sent a file: ${attachment.name}` : ''),
        attachments
      });
      setMessageText("");
      setAttachment(null);
      emitTyping(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    try {
      const url = await uploadFile(file);
      setAttachment({
        name: file.name,
        type: file.type,
        url
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      setIsSearching(true);
      const results = await searchUsers(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const startNewChat = async (recipient) => {
    try {
      const newMsg = await sendMessage({
        recipientId: recipient._id,
        text: "Hello!"
      });
      if (newMsg && newMsg.conversation) {
        setSelectedConversationId(newMsg.conversation);
      }
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedConversation = conversations?.find(c => c._id === selectedConversationId);
  const recipient = selectedConversation?.participants?.find(p => p._id !== user?._id && p._id !== user?.id);
  const isRecipientOnline = recipient ? onlineStatuses[recipient._id]?.status === 'online' : false;

  // Filter conversations locally if needed
  const filteredConversations = conversations;

  return (
    <div className="flex h-[calc(100vh-120px)] bg-slate-900/5 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl overflow-hidden">
      {/* Contact List Sidebar */}
      <div className={`w-full lg:w-96 border-r border-slate-200/50 flex flex-col bg-white/70 ${selectedConversationId ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-6 border-b border-slate-200/40">
          <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search people..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {isSearching ? (
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">Search Results</p>
              {searchResults.map(result => (
                <button 
                  key={result._id}
                  onClick={() => startNewChat(result)}
                  className="w-full flex items-center gap-4 p-3 hover:bg-blue-50/50 rounded-2xl transition-all duration-200"
                >
                  <img src={result.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(result.name)}&background=0D8ABC&color=fff`} className="w-11 h-11 rounded-full shadow-sm" alt={result.name} />
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-slate-900">{result.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{result.role}</p>
                  </div>
                </button>
              ))}
              {searchResults.length === 0 && <p className="text-center text-slate-500 text-sm py-8">No users found</p>}
            </div>
          ) : (
            <>
              {filteredConversations?.map(conv => {
                const otherUser = conv.participants?.find(p => p._id !== user?._id && p._id !== user?.id);
                const isActive = selectedConversationId === conv._id;
                const isPinned = conv.pinnedBy?.includes(user?._id || user?.id);
                const isOnline = otherUser ? onlineStatuses[otherUser._id]?.status === 'online' : false;

                // Unread Count
                const hasUnread = conv.lastMessage && !conv.lastMessage.isRead && conv.lastMessage.sender !== user?._id && conv.lastMessage.sender !== user?.id;

                return (
                  <button 
                    key={conv._id}
                    onClick={() => setSelectedConversationId(conv._id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group border ${isActive ? 'bg-blue-500/10 border-blue-500/20 shadow-md shadow-blue-500/5' : 'hover:bg-slate-50 border-transparent'}`}
                  >
                    <div className="relative">
                      <img src={otherUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.name || 'User')}&background=E0F2FE&color=0369A1`} className="w-12 h-12 rounded-full border-2 border-white shadow-md" alt={otherUser?.name} />
                      <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${isOnline ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-center mb-1">
                        <p className={`text-sm font-extrabold truncate ${isActive ? 'text-blue-700' : 'text-slate-900'}`}>{otherUser?.name}</p>
                        <div className="flex items-center gap-1.5">
                          {isPinned && <Pin className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />}
                          {conv.lastMessage && (
                            <span className="text-[11px] font-medium text-slate-400">
                              {format(new Date(conv.lastMessage.createdAt || conv.updatedAt), 'HH:mm')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate ${hasUnread ? 'text-slate-900 font-extrabold' : 'text-slate-500'}`}>
                          {conv.lastMessage?.text || 'No messages yet'}
                        </p>
                        {hasUnread && (
                          <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
              {conversations?.length === 0 && (
                <div className="text-center py-16 px-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-6 shadow-sm">
                    <MessageSquare className="w-8 h-8 text-blue-500" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">No chats active</h4>
                  <p className="text-slate-400 text-xs max-w-[200px] mx-auto">Use the search bar above to message teachers, parents, or staff.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Messaging Panel */}
      <div className={`flex-1 flex flex-col bg-slate-50/50 ${!selectedConversationId ? 'hidden lg:flex' : 'flex'}`}>
        {selectedConversationId ? (
          <>
            {/* Active Header */}
            <div className="p-4 bg-white/80 backdrop-blur border-b border-slate-200/50 flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedConversationId(null)}
                  className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <img src={recipient?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recipient?.name || 'R')}&background=0D8ABC&color=fff`} className="w-11 h-11 rounded-full border border-slate-100 shadow-sm" alt={recipient?.name} />
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isRecipientOnline ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 tracking-tight">{recipient?.name}</p>
                  <p className="text-xs font-semibold text-slate-400">
                    {isRecipientOnline ? 'Active Now' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => togglePin(selectedConversationId)}
                  className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  title="Pin / Unpin Conversation"
                >
                  <Pin className={`w-5 h-5 ${selectedConversation?.pinnedBy?.includes(user?._id || user?.id) ? 'fill-blue-500 text-blue-500' : ''}`} />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages?.map((msg) => {
                const isMe = msg.sender?._id === user?._id || msg.sender === user?._id || msg.sender?._id === user?.id || msg.sender === user?.id;
                
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[70%] group flex flex-col">
                      <div className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none border border-slate-100'}`}>
                        {msg.text}
                        
                        {/* Attachments Section */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1.5">
                            {msg.attachments.map((attUrl, index) => {
                              const isImage = /\.(jpeg|jpg|png|webp|gif)$/i.test(attUrl);
                              const fileName = attUrl.split('/').pop() || 'Attachment';
                              return (
                                <div key={index} className="rounded-xl overflow-hidden bg-black/5 p-2">
                                  {isImage ? (
                                    <div className="space-y-2">
                                      <img src={attUrl.startsWith('/') ? `http://localhost:5000${attUrl}` : attUrl} className="max-h-48 rounded-lg object-cover w-full" alt="Attachment" />
                                      <a href={attUrl.startsWith('/') ? `http://localhost:5000${attUrl}` : attUrl} download target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-blue-100 hover:underline">
                                        <Download className="w-3.5 h-3.5" /> Download Image
                                      </a>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between gap-2.5">
                                      <div className="flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-slate-200" />
                                        <span className="text-xs font-bold truncate max-w-[150px]">{fileName}</span>
                                      </div>
                                      <a href={attUrl.startsWith('/') ? `http://localhost:5000${attUrl}` : attUrl} download target="_blank" rel="noreferrer" className="p-1 hover:bg-white/10 rounded-lg">
                                        <Download className="w-4 h-4 text-white" />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className={`flex items-center gap-1.5 mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-[10px] font-bold text-slate-400">{format(new Date(msg.createdAt), 'HH:mm')}</span>
                        {isMe && (msg.isRead ? <CheckCheck className="w-3.5 h-3.5 text-blue-500" /> : <Check className="w-3.5 h-3.5 text-slate-400" />)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicators */}
              {typingUsers && typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-white/80 border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <p className="text-xs text-slate-400 ml-1.5 font-semibold">Typing...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Preview Selected Attachment */}
            {attachment && (
              <div className="px-6 py-3 bg-blue-50/50 border-t border-slate-200/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Paperclip className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{attachment.name}</p>
                    <p className="text-[10px] text-slate-400">Ready to upload</p>
                  </div>
                </div>
                <button onClick={() => setAttachment(null)} className="p-1 hover:bg-slate-200 rounded-lg">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200/60 shadow-lg">
              <form onSubmit={handleSend} className="flex items-center gap-3">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all ${isUploadingFile ? 'animate-pulse' : ''}`}
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input 
                  type="text" 
                  placeholder={isUploadingFile ? "Uploading file..." : "Type a message..."}
                  disabled={isUploadingFile}
                  className="flex-1 px-4 py-3.5 bg-slate-50/50 border border-slate-200/60 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-inner"
                  value={messageText}
                  onChange={handleInputChange}
                />
                <button 
                  type="submit" 
                  disabled={isUploadingFile || (!messageText.trim() && !attachment)}
                  className="p-3.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 disabled:opacity-40 disabled:shadow-none transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 rotate-6 border border-white/50">
              <MessageSquare className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-slate-900 font-extrabold text-2xl mb-2 tracking-tight">Internal Messaging Portal</h3>
            <p className="max-w-xs text-sm text-slate-500 font-medium">Enjoy secure, end-to-end synchronized, and instantaneous communications with teachers, staff, parents, and administrative portals.</p>
            <div className="mt-8 flex gap-4 bg-white/80 border border-slate-100 py-3.5 px-6 rounded-2xl shadow-sm">
               <div className="flex -space-x-3.5">
                 {[1, 2, 3, 4].map(i => (
                   <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="user" />
                 ))}
               </div>
               <div className="flex flex-col justify-center text-left">
                  <p className="text-xs font-black text-slate-900">100% Secure Chat</p>
                  <p className="text-[10px] font-bold text-slate-400">Authenticated & Role Protected</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default ChatInterface;
