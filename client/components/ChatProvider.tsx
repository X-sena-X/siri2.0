"use client";
import React, { createContext, useState, useEffect } from "react";

export interface ChatMessage {
    message: string;
    id: string;
}

type Props = {
    children: React.ReactNode;
};
interface ChatContextValue {
    messages: ChatMessage[];
    addMessage: (message: string) => void;
    language: string;
    setLanguage: (language: string) => void;
    pending: boolean;
    setPending: (pending: boolean) => void;
}

const defaultChatContextValue: ChatContextValue = {
    messages: [],
    addMessage: () => {},
    language: "",
    setLanguage: (language: string) => {},
    pending: false,
    setPending: () => {},
};

export const ChatContext = createContext<ChatContextValue>(
    defaultChatContextValue
);

function ChatProvider({ children }: Props) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [language, setLanguage] = useState<string>("fr");
    const [pending, setPending] = useState<boolean>(false);
    const addMessage = (message: string) => {
        const newId =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        setMessages((prevMessages) => [
            ...prevMessages,
            { message, id: newId },
        ]);
    };
    useEffect(() => {
        console.log(messages);
    }, [messages]);
    return (
        <ChatContext.Provider
            value={{
                messages,
                addMessage,
                language,
                setLanguage,
                pending,
                setPending,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export default ChatProvider;
