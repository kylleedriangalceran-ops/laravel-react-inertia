import React, { useState, useRef, useEffect } from "react";
import {
    Send,
    ChevronRight,
    ArrowLeft,
    User,
    CheckCircle,
    XCircle,
    Info,
    Bot,
    Paperclip,
    FileText,
    Image,
    X,
} from "lucide-react";
import { gooeyToast } from "goey-toast";
import { router } from "@inertiajs/react";
import axios from "axios";

export default function ContactForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        message: false,
    });
    const [focused, setFocused] = useState({
        name: false,
        email: false,
        message: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isAdminOnline, setIsAdminOnline] = useState(false);
    const [messageId, setMessageId] = useState(null);
    const [attachment, setAttachment] = useState(null);
    const chatEndRef = useRef(null);
    const guestFileRef = useRef(null);

    // Auto-scroll chat to bottom on new messages
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // Poll admin online status
    useEffect(() => {
        const checkStatus = () => {
            axios.get("/admin/status")
                .then(res => setIsAdminOnline(res.data.admin_online))
                .catch(() => {});
        };
        checkStatus();
        const interval = setInterval(checkStatus, 10000);
        return () => clearInterval(interval);
    }, []);

    // Poll for real admin replies
    useEffect(() => {
        if (!messageId) return;

        const checkReply = () => {
            axios.get(`/contact/${messageId}/status`)
                .then(res => {
                    if (res.data.admin_replies && res.data.admin_replies.length > 0) {
                        setMessages(prev => {
                            let newMessages = [...prev];
                            let added = false;
                            
                            res.data.admin_replies.forEach(reply => {
                                const replyKey = `${reply.text || ''}|${reply.attachment || ''}`;
                                const alreadyExists = newMessages.some(
                                    m => m.type === "admin" && `${m.text || ''}|${m.attachmentPath || ''}` === replyKey
                                );
                                if (!alreadyExists) {
                                    newMessages.push({ 
                                        type: "admin", 
                                        text: reply.text,
                                        attachment: reply.attachment ? `/storage/${reply.attachment}` : null,
                                        attachmentPath: reply.attachment || null,
                                        attachmentName: reply.attachment ? reply.attachment.split('/').pop() : null,
                                        isImage: reply.attachment ? /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(reply.attachment) : false
                                    });
                                    added = true;
                                }
                            });
                            
                            return added ? newMessages : prev;
                        });
                        // Notice: we no longer set messageId(null) so polling continues for the active session!
                    }
                })
                .catch(() => {});
        };

        const interval = setInterval(checkReply, 5000);
        return () => clearInterval(interval);
    }, [messageId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: false }));
        }
    };

    const handleFocus = (field) => {
        setFocused((prev) => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field) => {
        setFocused((prev) => ({ ...prev, [field]: false }));
    };

    const validateStep1 = () => {
        const newErrors = {
            name: !formData.name.trim(),
            email:
                !formData.email.trim() ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
        };

        setErrors(newErrors);

        if (newErrors.name || newErrors.email) {
            if (newErrors.name && newErrors.email) {
                gooeyToast.error("Missing Information", {
                    description: "Please fill in your name and email.",
                    duration: 3000,
                    icon: <XCircle className="w-5 h-5 text-red-500" />,
                });
            } else if (newErrors.name) {
                gooeyToast.error("Name Required", {
                    description: "Please enter your name.",
                    duration: 3000,
                    icon: <Info className="w-5 h-5 text-red-500" />,
                });
            } else if (newErrors.email) {
                gooeyToast.error("Invalid Email", {
                    description: "Please enter a valid email address.",
                    duration: 3000,
                    icon: <Info className="w-5 h-5 text-red-500" />,
                });
            }
            return false;
        }

        return true;
    };

    const handleNextStep = () => {
        if (!validateStep1()) return;

        setStep(2);
        setMessages([
            {
                type: "bot",
                text: `Hi ${formData.name}! What would you like to discuss?`,
            },
        ]);
    };

    const handleBackStep = () => {
        setStep(1);
        setMessages([]);
        setFormData((prev) => ({ ...prev, message: "" }));
        setErrors((prev) => ({ ...prev, message: false }));
    };

    const getBotReply = (msg) => {
        const lower = msg.toLowerCase();

        // Projects
        if (lower.match(/project|built|made|portfolio|work|app|website|web app/)) {
            return "Kylle has built several projects! His main ones are:\n\n• **Portfolio Website** — A modern personal portfolio built with Laravel, React, Inertia.js & TailwindCSS (100% complete).\n• **E-Commerce Platform** — A full-featured online store with payment integration, inventory management & admin dashboard (65% in progress).\n\nWould you like to know more about any specific project?";
        }

        // Skills / Tech
        if (lower.match(/skill|tech|stack|language|framework|tool|know|learn|code|program/)) {
            return "Kylle's tech stack includes:\n\n**Front-End:** HTML, CSS, JavaScript, React, TailwindCSS\n**Back-End:** PHP, Laravel, Node.js\n**Tools:** Git, VS Code, Postman, Figma, Vercel, draw.io\n**Database:** PostgreSQL, MongoDB\n\nHe's always learning and expanding his skills!";
        }

        // Experience / Background
        if (lower.match(/experience|background|about|who|yourself|bio|story|age|old/)) {
            return "Kylle is a 22-year-old fresh graduate and aspiring web developer. He's passionate about building clean, modern web applications and is currently looking for opportunities to grow, contribute to a great team, and deliver beautiful digital experiences!";
        }

        // Hire / Work / Job
        if (lower.match(/hire|job|work together|collaborate|freelance|available|open|opportunity|employ/)) {
            return "Yes, Kylle is currently open to opportunities! Whether it's a full-time role, freelance project, or collaboration — he'd love to hear about it. You can share the details here and he'll get back to you! 🚀";
        }

        // Contact Info
        if (lower.match(/contact|email|reach|connect|social|github|linkedin/)) {
            return "You can reach Kylle through:\n\n📧 **Email:** kylleedrian71@gmail.com\n💻 **GitHub:** github.com/kylleedriangalceran-ops\n\nOr just leave your message right here and he'll respond!";
        }

        // Education
        if (lower.match(/education|school|college|university|degree|graduate|study|course/)) {
            return "Kylle is a fresh graduate with a strong foundation in web development. He's been building projects throughout his academic journey and continues to learn through hands-on experience and self-study!";
        }

        // Hobbies
        if (lower.match(/hobby|hobbies|fun|free time|interest|like to do|basketball|anime|music|game|movie/)) {
            return "Outside of coding, Kylle enjoys:\n\n🏀 Basketball\n🎮 Playing mobile games\n🎵 Music\n📺 Anime & Movies\n\nA well-rounded dev with great taste! 😄";
        }

        // Greeting
        if (lower.match(/^(hi|hello|hey|good morning|good afternoon|good evening|sup|yo|what's up)/)) {
            return `Hey there! 👋 Welcome! I'm Kylle's assistant bot. Feel free to ask me about his projects, skills, experience, or anything else. How can I help you today?`;
        }

        // Thanks
        if (lower.match(/thank|thanks|thx|appreciate|awesome|great|cool|nice/)) {
            return "You're welcome! 😊 Is there anything else you'd like to know about Kylle? I'm happy to help!";
        }

        // Goodbye
        if (lower.match(/bye|goodbye|see you|later|take care|gotta go/)) {
            return "Thanks for chatting! Kylle will review your messages and get back to you soon. Have a great day! 👋";
        }

        // Default
        return `Thanks for your message! I've noted that down for Kylle. He'll review it and get back to you at ${formData.email} as soon as possible. In the meantime, feel free to ask me about his projects, skills, or experience!`;
    };

    const handleSendMessage = async () => {
        if (!formData.message.trim()) {
            setErrors((prev) => ({ ...prev, message: true }));
            gooeyToast.error("Message Required", {
                description: "Please type a message before sending.",
                duration: 3000,
                icon: <Info className="w-5 h-5 text-red-500" />,
            });
            return;
        }

        const userMessage = formData.message;
        setMessages((prev) => [...prev, { 
            type: "user", 
            text: userMessage,
            attachment: attachment ? URL.createObjectURL(attachment) : null,
            attachmentName: attachment ? attachment.name : null,
            isImage: attachment ? attachment.type.startsWith('image/') : false
        }]);
        setFormData((prev) => ({ ...prev, message: "" }));
        setIsLoading(true);

        // Generate smart reply
        const botReply = getBotReply(userMessage);

        // Save to database using FormData for file support
        const formPayload = new FormData();
        formPayload.append('name', formData.name);
        formPayload.append('email', formData.email);
        formPayload.append('message', userMessage);
        if (attachment) formPayload.append('attachment', attachment);

        const currentAttachment = attachment;
        setAttachment(null);

        axios.post("/contact", formPayload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((response) => {
            if (response.data.message && response.data.message.id) {
                setMessageId(response.data.message.id);
            }
            // Simulate typing delay for natural feel
            setTimeout(() => {
                setIsLoading(false);
                setMessages((prev) => [
                    ...prev,
                    { type: "bot", text: botReply },
                ]);
            }, 800 + Math.random() * 700);
        })
        .catch(() => {
            setIsLoading(false);
            setMessages((prev) => [
                ...prev,
                {
                    type: "bot",
                    text: "Sorry, something went wrong and I couldn't save your message. Please try again!",
                },
            ]);
            gooeyToast.error("Failed to send", {
                description: "Something went wrong. Please try again.",
                duration: 3000,
                icon: <XCircle className="w-5 h-5 text-red-500" />,
            });
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const isLabelFloating = (field) => focused[field] || formData[field];

    return (
        <div className="w-full">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-3 mb-12">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            step >= 1
                                ? "bg-sky-primary text-white"
                                : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                    >
                        1
                    </div>
                    <span
                        className={`text-xs font-medium transition-colors duration-300 hidden sm:inline ${
                            step >= 1 ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
                        }`}
                    >
                        Info
                    </span>
                </div>

                <div className="w-16 h-px bg-gray-200">
                    <div
                        className={`h-full bg-sky-primary transition-all duration-500 ${
                            step >= 2 ? "w-full" : "w-0"
                        }`}
                    ></div>
                </div>

                <div className="flex items-center gap-2">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                            step >= 2
                                ? "bg-sky-primary text-white"
                                : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                    >
                        2
                    </div>
                    <span
                        className={`text-xs font-medium transition-colors duration-300 hidden sm:inline ${
                            step >= 2 ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"
                        }`}
                    >
                        Message
                    </span>
                </div>
            </div>

            {/* Admin Online Status Badge */}
            <div className={`flex justify-center transition-all duration-500 ${step === 2 ? 'mb-6 opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden'}`}>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-full shadow-sm">
                    <div className="relative flex h-2.5 w-2.5">
                        {isAdminOnline && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAdminOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        {isAdminOnline ? 'Admin Online' : 'Admin Away'}
                    </span>
                </div>
            </div>

            {/* Step 1: Name & Email */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                onFocus={() => handleFocus("name")}
                                onBlur={() => handleBlur("name")}
                                className={`peer w-full text-base text-gray-900 dark:text-white bg-transparent border-b-2 pt-5 pb-2 px-0 focus:outline-none transition-colors duration-200 ${
                                    errors.name
                                        ? "border-red-400 dark:border-red-500/60"
                                        : "border-gray-300 focus:border-sky-primary"
                                }`}
                            />
                            <label
                                htmlFor="name"
                                className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                                    isLabelFloating("name")
                                        ? "top-0 text-xs"
                                        : "top-5 text-base"
                                } ${
                                    errors.name
                                        ? "text-red-400 dark:text-red-500/70"
                                        : focused.name
                                          ? "text-sky-primary"
                                          : "text-gray-500"
                                }`}
                            >
                                Name
                            </label>
                            {errors.name && (
                                <p className="text-xs text-red-400 dark:text-red-500/70 mt-1">
                                    Name is required
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onFocus={() => handleFocus("email")}
                                onBlur={() => handleBlur("email")}
                                className={`peer w-full text-base text-gray-900 dark:text-white bg-transparent border-b-2 pt-5 pb-2 px-0 focus:outline-none transition-colors duration-200 ${
                                    errors.email
                                        ? "border-red-400 dark:border-red-500/60"
                                        : "border-gray-300 focus:border-sky-primary"
                                }`}
                            />
                            <label
                                htmlFor="email"
                                className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                                    isLabelFloating("email")
                                        ? "top-0 text-xs"
                                        : "top-5 text-base"
                                } ${
                                    errors.email
                                        ? "text-red-400 dark:text-red-500/70"
                                        : focused.email
                                          ? "text-sky-primary"
                                          : "text-gray-500"
                                }`}
                            >
                                Email
                            </label>
                            {errors.email && (
                                <p className="text-xs text-red-400 dark:text-red-500/70 mt-1">
                                    Valid email is required
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleNextStep}
                        className="w-full bg-sky-primary hover:bg-sky-600 text-white font-medium py-3 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group mt-8"
                    >
                        Continue
                        <ChevronRight
                            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                            strokeWidth={2}
                        />
                    </button>
                </div>
            )}

            {/* Step 2: Chat Interface */}
            {step === 2 && (
                <div className="space-y-6">
                    {/* Back Button */}
                    <button
                        onClick={handleBackStep}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-sky-primary transition-colors group"
                    >
                        <ArrowLeft
                            className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
                            strokeWidth={2}
                        />
                        Back
                    </button>

                    {/* Chat Messages */}
                    <div className="h-64 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex gap-2 ${
                                    msg.type === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                {/* Bot Profile Picture */}
                                {(msg.type === "bot" || msg.type === "admin") && (
                                    <div className="w-8 h-8 rounded-full shrink-0 bg-sky-primary/10 dark:bg-sky-500/20 border-2 border-sky-primary/20 flex items-center justify-center relative overflow-hidden">
                                        {msg.type === "admin" ? (
                                            <span className="text-xs font-bold text-sky-primary">Me</span>
                                        ) : (
                                            <Bot className="w-4 h-4 text-sky-primary" strokeWidth={2} />
                                        )}
                                    </div>
                                )}

                                {/* Message Bubble */}
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                                        msg.type === "user"
                                            ? "bg-sky-primary text-white rounded-br-none"
                                            : "bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-white/10 shadow-sm"
                                    }`}
                                >
                                    {msg.type === "admin" && (
                                        <div className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">
                                            Kylle (Admin)
                                        </div>
                                    )}
                                    {/* Attachment Preview */}
                                    {msg.attachment && (
                                        <div className="mb-2">
                                            {msg.isImage ? (
                                                <a href={msg.attachment} target="_blank" rel="noopener noreferrer">
                                                    <img src={msg.attachment} alt="Attached" className="rounded-lg max-h-32 w-auto object-cover" />
                                                </a>
                                            ) : (
                                                <a href={msg.attachment} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs underline opacity-80 hover:opacity-100">
                                                    <FileText className="w-3.5 h-3.5" />
                                                    <span>{msg.attachmentName || 'Attachment'}</span>
                                                </a>
                                            )}
                                        </div>
                                    )}
                                    {msg.text && (
                                        <p className="leading-relaxed whitespace-pre-wrap">
                                            {msg.text}
                                        </p>
                                    )}
                                </div>

                                {/* User Profile Icon */}
                                {msg.type === "user" && (
                                    <div className="w-8 h-8 rounded-full bg-sky-primary/10 flex items-center justify-center shrink-0 border-2 border-sky-primary/20">
                                        <User
                                            className="w-4 h-4 text-sky-primary"
                                            strokeWidth={2}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}

                            {isLoading && (
                            <div className="flex gap-2 justify-start">
                                {/* Bot Icon for Loading */}
                                <div className="w-8 h-8 rounded-full shrink-0 bg-sky-primary/10 dark:bg-sky-500/20 border-2 border-sky-primary/20 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-sky-primary" strokeWidth={2} />
                                </div>

                                <div className="bg-white dark:bg-[#1a1a1a] px-4 py-2 rounded-2xl rounded-bl-none border border-gray-200 dark:border-white/10">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.1s" }}
                                        ></div>
                                        <div
                                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                            style={{ animationDelay: "0.2s" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Message Input with Attachment + Send */}
                    <div className="space-y-3">
                        {/* Attachment Preview */}
                        {attachment && (
                            <div className="flex items-center gap-2 px-3 py-2 bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 rounded-xl">
                                {attachment.type.startsWith('image/') ? (
                                    <Image className="w-4 h-4 text-sky-500" strokeWidth={2} />
                                ) : (
                                    <FileText className="w-4 h-4 text-sky-500" strokeWidth={2} />
                                )}
                                <span className="text-xs text-sky-700 dark:text-sky-300 font-medium truncate flex-1">{attachment.name}</span>
                                <button onClick={() => setAttachment(null)} className="text-sky-500 hover:text-red-500 transition-colors">
                                    <X className="w-4 h-4" strokeWidth={2} />
                                </button>
                            </div>
                        )}
                        <div className="flex gap-3 items-end">
                            {/* Paperclip Button */}
                            <button
                                onClick={() => guestFileRef.current?.click()}
                                className="self-end p-3 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 hover:text-sky-500 transition-all border border-gray-200 dark:border-white/10"
                                title="Attach file"
                            >
                                <Paperclip className="w-4 h-4" strokeWidth={2} />
                            </button>
                            <input
                                ref={guestFileRef}
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                                onChange={(e) => {
                                    if (e.target.files[0]) setAttachment(e.target.files[0]);
                                    e.target.value = '';
                                }}
                            />
                            <div className="flex-1 relative">
                                <textarea
                                    name="message"
                                    id="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    onFocus={() => handleFocus("message")}
                                    onBlur={() => handleBlur("message")}
                                    onKeyPress={handleKeyPress}
                                    rows="1"
                                    className={`peer w-full text-base text-gray-900 bg-transparent border-b-2 pt-5 pb-2 px-0 focus:outline-none resize-none transition-colors duration-200 ${
                                        errors.message
                                            ? "border-red-400 dark:border-red-500/60"
                                            : "border-gray-300 focus:border-sky-primary"
                                    }`}
                                    style={{
                                        minHeight: "48px",
                                        maxHeight: "120px",
                                    }}
                                />
                                <label
                                    htmlFor="message"
                                    className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                                        isLabelFloating("message")
                                            ? "top-0 text-xs"
                                            : "top-5 text-base"
                                    } ${
                                        errors.message
                                            ? "text-red-400 dark:text-red-500/70"
                                            : focused.message
                                              ? "text-sky-primary"
                                              : "text-gray-500"
                                    }`}
                                >
                                    Message
                                </label>
                                {errors.message && (
                                    <p className="text-xs text-red-400 dark:text-red-500/70 mt-1">
                                        Please type a message
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={handleSendMessage}
                                disabled={isLoading || !formData.message.trim()}
                                className="bg-sky-primary hover:bg-sky-600 disabled:bg-gray-300 text-white p-3 rounded-full transition-all duration-200 disabled:cursor-not-allowed group"
                            >
                                <Send
                                    className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                                    strokeWidth={2}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
