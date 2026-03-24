import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import { Mail, Send, Check, Clock, X, MessageSquare, Zap, Trash2, Paperclip, Image, FileText } from "lucide-react";
import Layout from "../../Layouts/Layout";
import { gooeyToast } from "goey-toast";
import axios from "axios";

export default function Dashboard({ messages: initialMessages, unreadCount: initialUnreadCount, cacheDriver = 'file' }) {
    const [messages, setMessages] = useState(initialMessages);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
    const [isReplying, setIsReplying] = useState(false);
    const [replyAttachment, setReplyAttachment] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteMessageId, setDeleteMessageId] = useState(null);
    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);

    const previousMessagesRef = React.useRef(initialMessages);

    // Sync Inertia props to local state when polling finishes
    useEffect(() => {
        // Detect new incoming messages for the notification pop-up
        if (initialMessages.length > previousMessagesRef.current.length) {
            const newMsgs = initialMessages.filter(m => !previousMessagesRef.current.find(p => p.id === m.id));
            
            newMsgs.forEach(m => {
                // We only want to notify for raw incoming messages, not just admin reply updates
                if (!m.admin_reply || m.admin_reply.length === 0) {
                    gooeyToast.success(`New Message: ${m.name}`, {
                        description: m.message.length > 50 ? m.message.substring(0, 50) + "..." : m.message,
                        duration: 6000,
                    });
                }
            });
        }
        previousMessagesRef.current = initialMessages;

        // Only update if array lengths/data genuinely changed to prevent react thrashing
        setMessages(initialMessages);
        setUnreadCount(initialUnreadCount);
    }, [initialMessages, initialUnreadCount]);

    useEffect(() => {
        // Ping immediately on mount, then every 10 seconds for admin status presence
        const pingAdmin = () => axios.post('/admin/ping').catch(() => {});
        pingAdmin();
        const pingInterval = setInterval(pingAdmin, 10000);

        // Poll for new messages using Inertia partial reloads
        const messageInterval = setInterval(() => {
            router.reload({
                only: ['messages', 'unreadCount'],
                preserveState: true,
                preserveScroll: true,
            });
        }, 5000);

        return () => {
            clearInterval(pingInterval);
            clearInterval(messageInterval);
        };
    }, []);

    // Group messages by email to form unified conversations
    const conversations = React.useMemo(() => {
        const map = new Map();
        messages.forEach(m => {
            if (!map.has(m.email)) {
                map.set(m.email, {
                    email: m.email,
                    name: m.name,
                    messages: [],
                    latest_date: new Date(m.created_at),
                    is_read: true,
                    has_replied: false,
                });
            }
            const convo = map.get(m.email);
            convo.messages.push(m);
            if (!m.is_read) convo.is_read = false;
            if (m.admin_reply) convo.has_replied = true;
            
            const mDate = new Date(m.created_at);
            if (mDate > convo.latest_date) {
                convo.latest_date = mDate;
                convo.name = m.name; // Keep latest name
            }
        });
        return Array.from(map.values()).sort((a, b) => b.latest_date - a.latest_date);
    }, [messages]);

    const activeConversation = conversations.find(c => c.email === selectedEmail);

    const handleSelectConversation = async (email) => {
        setSelectedEmail(email);
        setReplyText("");

        const convo = conversations.find(c => c.email === email);
        if (convo && !convo.is_read) {
            const unreadMessages = convo.messages.filter(m => !m.is_read);
            unreadMessages.forEach(m => {
                axios.post(`/admin/messages/${m.id}/read`).catch(() => {});
            });
            
            setMessages(prev => prev.map(msg => 
                msg.email === email ? { ...msg, is_read: true } : msg
            ));
            setUnreadCount(prev => Math.max(0, prev - unreadMessages.length));
        }
    };

    const handleSendReply = async () => {
        if ((!replyText.trim() && !replyAttachment) || !activeConversation) return;

        setIsReplying(true);
        const latestMsg = [...activeConversation.messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

        const formData = new FormData();
        if (replyText.trim()) formData.append('reply', replyText);
        if (replyAttachment) formData.append('attachment', replyAttachment);

        axios.post(`/admin/messages/${latestMsg.id}/reply`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then((res) => {
                const updatedMessage = res.data.message;
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === latestMsg.id ? updatedMessage : msg
                    )
                );
                gooeyToast.success("Reply Sent", {
                    description: "Your reply has been saved successfully.",
                    duration: 3000,
                });
                setIsReplying(false);
                setReplyText("");
                setReplyAttachment(null);
            })
            .catch(() => {
                gooeyToast.error("Error", {
                    description: "Failed to send reply. Please try again.",
                    duration: 3000,
                });
                setIsReplying(false);
            });
    };

    const handleDeleteConversation = () => {
        if (!activeConversation) return;
        axios.delete(`/admin/conversations/${encodeURIComponent(activeConversation.email)}`)
            .then(() => {
                setMessages(prev => prev.filter(m => m.email !== activeConversation.email));
                setSelectedEmail(null);
                setShowDeleteConfirm(false);
                gooeyToast.success("Conversation Deleted", {
                    description: "The conversation has been permanently removed.",
                    duration: 3000,
                });
            })
            .catch(() => {
                gooeyToast.error("Error", { description: "Failed to delete conversation.", duration: 3000 });
            });
    };

    const handleDeleteMessage = () => {
        if (!deleteMessageId) return;
        axios.delete(`/admin/messages/${deleteMessageId}`)
            .then(() => {
                setMessages(prev => prev.filter(m => m.id !== deleteMessageId));
                setDeleteMessageId(null);
                gooeyToast.success("Message Deleted", { description: "Message removed.", duration: 2000 });
            })
            .catch(() => {
                setDeleteMessageId(null);
                gooeyToast.error("Error", { description: "Failed to delete.", duration: 2000 });
            });
    };

    const isImageFile = (path) => {
        if (!path) return false;
        return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(path);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        }
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
    };

    const parseAdminReplies = (replyData, repliedAt) => {
        if (!replyData) return [];
        try {
            const parsed = JSON.parse(replyData);
            if (Array.isArray(parsed)) return parsed;
        } catch(e) {}
        return [{ text: replyData, created_at: repliedAt || new Date().toISOString() }];
    };

    const chatFeed = React.useMemo(() => {
        if (!activeConversation) return [];
        let items = [];
        
        activeConversation.messages.forEach(msg => {
            // Push guest's message
            items.push({
                type: 'user',
                text: msg.message,
                attachment: msg.attachment_path,
                created_at: msg.created_at,
                id: `usr-${msg.id}`,
                msgId: msg.id
            });
            
            // Push any admin replies on this object
            if (msg.admin_reply) {
                const replies = parseAdminReplies(msg.admin_reply, msg.replied_at);
                replies.forEach((r, idx) => {
                    items.push({
                        type: 'admin',
                        text: r.text,
                        attachment: r.attachment,
                        created_at: r.created_at,
                        id: `adm-${msg.id}-${idx}`,
                        msgId: msg.id
                    });
                });
            }
        });
        
        // Sort chronologically ascending for standard chat view
        return items.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }, [activeConversation]);

    return (
        <>
        <Layout>
            <Head title="Admin Dashboard" />

            {/* Match portfolio's background aesthetics */}
            <div className="min-h-screen bg-gray-50 dark:bg-[#121212] py-8 sm:py-12 px-4 transition-colors duration-300">
                <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1a1a1a] p-6 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm relative overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="relative z-10">
                            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-1">
                                Admin Dashboard
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Manage and respond to contact messages in real-time
                            </p>
                        </div>
                        {/* Cache Status Indicator */}
                        <div className={`relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full border ${cacheDriver === 'redis'
                            ? 'bg-green-50/50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400'
                            : 'bg-sky-50/50 dark:bg-sky-500/10 border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-400'
                            }`}>
                            <Zap className="w-3.5 h-3.5" strokeWidth={2} />
                            <span className="text-xs font-semibold tracking-wide">
                                {cacheDriver === 'redis' ? 'Redis Active' : 'File Cache'}
                            </span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                            <div className="w-12 h-12 rounded-full bg-sky-primary/10 dark:bg-sky-500/20 flex items-center justify-center shrink-0 border border-sky-primary/20">
                                <Mail className="w-5 h-5 text-sky-primary" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                    {messages.length}
                                </p>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Total Messages
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                            <div className="w-12 h-12 rounded-full bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center shrink-0 border border-orange-500/20">
                                <Clock className="w-5 h-5 text-orange-500" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                    {unreadCount}
                                </p>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Unread
                                </p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center shrink-0 border border-green-500/20">
                                <Check className="w-5 h-5 text-green-500" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                    {messages.filter((m) => m.admin_reply).length}
                                </p>
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Replied
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px] sm:h-[700px]">
                        {/* Messages List (Sidebar) */}
                        <div className="lg:col-span-4 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm overflow-hidden flex flex-col">
                            <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#1a1a1a]">
                                <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                    Inbox
                                </h2>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {conversations.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
                                        <p>No conversations yet</p>
                                    </div>
                                ) : (
                                    conversations.map((convo) => (
                                        <button
                                            key={convo.email}
                                            onClick={() => handleSelectConversation(convo.email)}
                                            className={`w-full p-4 text-left border-b border-gray-100 dark:border-white/5 transition-all outline-none flex items-center gap-3 ${selectedEmail === convo.email
                                                ? "bg-sky-50 dark:bg-sky-500/10 border-l-4 border-l-sky-primary"
                                                : "hover:bg-gray-50 dark:hover:bg-white/5 border-l-4 border-l-transparent"
                                                }`}
                                        >
                                            {/* Profile Avatar */}
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold shadow-sm shrink-0 text-lg relative">
                                                {convo.name.charAt(0).toUpperCase()}
                                                {convo.has_replied && (
                                                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1a1a1a] rounded-full p-0.5">
                                                        <div className="bg-green-500 text-white rounded-full p-0.5">
                                                            <Check className="w-2.5 h-2.5" strokeWidth={3} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Chat Preview */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className={`font-semibold text-sm truncate ${selectedEmail === convo.email ? 'text-sky-primary' : 'text-gray-900 dark:text-white'}`}>
                                                        {convo.name}
                                                    </h3>
                                                    <span className={`text-[10px] uppercase tracking-wider shrink-0 ml-2 ${!convo.is_read ? 'text-sky-primary font-bold' : 'text-gray-400 dark:text-gray-500 font-medium'}`}>
                                                        {formatDate(convo.latest_date)}
                                                    </span>
                                                </div>
                                                <p className={`text-[13px] truncate pr-4 ${!convo.is_read ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {[...convo.messages].sort((a,b)=> new Date(b.created_at)-new Date(a.created_at))[0].message}
                                                </p>
                                            </div>

                                            {/* Unread Dot Indicator */}
                                            {!convo.is_read && (
                                                <div className="w-2.5 h-2.5 bg-sky-primary rounded-full shrink-0 shadow-[0_0_8px_rgba(14,165,233,0.6)]"></div>
                                            )}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Chat View (Main Area) */}
                        <div className="lg:col-span-8 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm flex flex-col overflow-hidden relative">
                            {activeConversation ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#1a1a1a] flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold shadow-md shadow-sky-primary/20">
                                                {activeConversation.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h2 className="text-base font-bold text-gray-900 dark:text-white leading-none mb-1">
                                                    {activeConversation.name}
                                                </h2>
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                    {activeConversation.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Delete Conversation Button */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all"
                                                    title="Delete Conversation"
                                                >
                                                    <Trash2 className="w-4 h-4" strokeWidth={2} />
                                                </button>
                                                {showDeleteConfirm && (
                                                    <div className="absolute right-0 top-10 z-50 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-xl w-60">
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">Delete this entire conversation?</p>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={handleDeleteConversation}
                                                                className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                            <button
                                                                onClick={() => setShowDeleteConfirm(false)}
                                                                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => setSelectedEmail(null)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-white transition-all lg:hidden"
                                            >
                                                <X className="w-4 h-4" strokeWidth={2} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Chat Messages Feed */}
                                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar space-y-6 bg-slate-50/50 dark:bg-[#151515]">
                                        {chatFeed.map((bubble) => (
                                            <div key={bubble.id} className={`flex ${bubble.type === 'user' ? 'justify-start' : 'justify-end'} group`}>
                                                <div className="max-w-[75%] sm:max-w-[60%] relative">
                                                    <div className={`${bubble.type === 'user'
                                                        ? 'bg-white dark:bg-[#202020] border border-gray-100 dark:border-white/5 rounded-2xl rounded-tl-none shadow-sm'
                                                        : 'bg-sky-primary text-white rounded-2xl rounded-tr-none shadow-md shadow-sky-primary/10'} p-4`}>
                                                        {/* Attachment Preview */}
                                                        {bubble.attachment && (
                                                            <div className="mb-3">
                                                                {isImageFile(bubble.attachment) ? (
                                                                    <a href={`/storage/${bubble.attachment}`} target="_blank" rel="noopener noreferrer">
                                                                        <img src={`/storage/${bubble.attachment}`} alt="Attachment" className="rounded-xl max-h-48 w-auto object-cover border border-white/10" />
                                                                    </a>
                                                                ) : (
                                                                    <a href={`/storage/${bubble.attachment}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-3 py-2 rounded-lg ${bubble.type === 'user' ? 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300' : 'bg-white/20 text-white'} text-xs font-medium hover:opacity-80 transition-opacity`}>
                                                                        <FileText className="w-4 h-4" strokeWidth={2} />
                                                                        <span className="truncate">{bubble.attachment.split('/').pop()}</span>
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                        {bubble.text && (
                                                            <p className={`text-sm leading-relaxed whitespace-pre-wrap ${bubble.type === 'user' ? 'text-gray-800 dark:text-gray-200' : ''}`}>
                                                                {bubble.text}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className={`flex items-center gap-1 mt-2 text-[10px] uppercase font-medium text-gray-400 dark:text-gray-500 tracking-wider ${bubble.type === 'admin' ? 'justify-end mr-2' : 'ml-2'}`}>
                                                        <span>{formatDate(bubble.created_at)}</span>
                                                        {bubble.type === 'admin' && <Check className="w-3 h-3 text-sky-500" strokeWidth={3} />}
                                                    </div>
                                                    {/* Delete individual message button on hover */}
                                                    {bubble.type === 'user' && (
                                                        <button
                                                            onClick={() => setDeleteMessageId(bubble.msgId)}
                                                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                                            title="Delete this message"
                                                        >
                                                            <X className="w-3 h-3" strokeWidth={3} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Reply Input Area */}
                                    <div className="p-4 sm:p-6 bg-white dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-white/5">
                                        {/* Attachment Preview */}
                                        {replyAttachment && (
                                            <div className="mb-3 flex items-center gap-2 px-3 py-2 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-xl">
                                                {replyAttachment.type.startsWith('image/') ? (
                                                    <Image className="w-4 h-4 text-sky-500" strokeWidth={2} />
                                                ) : (
                                                    <FileText className="w-4 h-4 text-sky-500" strokeWidth={2} />
                                                )}
                                                <span className="text-xs text-sky-700 dark:text-sky-300 font-medium truncate flex-1">{replyAttachment.name}</span>
                                                <button onClick={() => setReplyAttachment(null)} className="text-sky-500 hover:text-red-500 transition-colors">
                                                    <X className="w-4 h-4" strokeWidth={2} />
                                                </button>
                                            </div>
                                        )}
                                        <div className="flex gap-3 relative items-end">
                                            {/* Paperclip Attachment Button */}
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="self-end p-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 hover:text-sky-500 transition-all border border-gray-200 dark:border-white/10"
                                                title="Attach file"
                                            >
                                                <Paperclip className="w-5 h-5" strokeWidth={2} />
                                            </button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="hidden"
                                                accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                                                onChange={(e) => {
                                                    if (e.target.files[0]) {
                                                        setReplyAttachment(e.target.files[0]);
                                                    }
                                                    e.target.value = '';
                                                }}
                                            />
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Type your reply here..."
                                                rows="2"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSendReply();
                                                    }
                                                }}
                                                className="flex-1 px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-primary/50 focus:border-sky-primary resize-none transition-all custom-scrollbar"
                                            />
                                            <button
                                                onClick={handleSendReply}
                                                disabled={(!replyText.trim() && !replyAttachment) || isReplying}
                                                className="self-end bg-sky-primary hover:bg-sky-400 disabled:bg-gray-200 dark:disabled:bg-white/10 text-white disabled:text-gray-400 p-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed group shadow-sm disabled:shadow-none"
                                            >
                                                <Send className="w-5 h-5 group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-50/50 dark:bg-[#151515]">
                                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6 border border-gray-200 dark:border-white/10">
                                        <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-600" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                        No Message Selected
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-[250px]">
                                        Choose a conversation from the sidebar to view details and send a reply.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>

        {/* Delete Message Confirmation Modal */}
        {deleteMessageId && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setDeleteMessageId(null)}
                />
                {/* Modal Card */}
                <div className="relative bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl w-full max-w-sm animate-fade-in-up">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-5">
                        <Trash2 className="w-6 h-6 text-red-500" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
                        Delete Message
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                        Are you sure you want to delete this message? This action cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setDeleteMessageId(null)}
                            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteMessage}
                            className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
    );
}
