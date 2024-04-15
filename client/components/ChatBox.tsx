import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "./ChatProvider"; // Adjust the import path
import { Badge } from "@/components/ui/badge";
import { TextGenerateEffect } from "@/components/textgeneration";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
function ChatBox() {
    //var messages: ChatMessage[] = [];
    const { messages, language, setLanguage } = useContext(ChatContext);
    //const [language, setLanguage] = useState<string>("fr");
    var messageList = messages;
    useEffect(() => {
        messageList = messages;
        console.log(messageList);
    }, [messages]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="text-xl text-white font-extrabold flex flex-row gap-x-40">
                chatBox
                <Select
                    onValueChange={(value) => setLanguage(value)}
                    defaultValue={language}
                >
                    <SelectTrigger className="w-[180px] text-black">
                        <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Language</SelectLabel>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="js">Japanese</SelectItem>
                            <SelectItem value="ta">Tamil</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {messageList.length == 0 && <div>No messages yet</div>}
            {messageList.length > 0 && (
                <div className="w-full h-full flex flex-col items-start gap-y-4 justify-start ">
                    {messageList.map((message) => (
                        <div
                            className="chat chat-start max-w-2/3"
                            key={message.id}
                        >
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                                    />
                                </div>
                            </div>
                            <div className="chat-bubble bg-purple-500 hover:bg-violet-900">
                                <TextGenerateEffect words={message.message} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ChatBox;
