"use client";
import Image from "next/image";
import { AnimatedTooltipPreview } from "../components/animated-profile";
import Recorder from "@/components/Recorder";
import axios from "axios";
import { useRef, useContext } from "react";
import { ChatContext } from "../components/ChatProvider"; // Adjust the import path
import ChatBox from "@/components/ChatBox";
export default function Home() {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const chat = useContext(ChatContext);
    const uploadAudio = async (blob: Blob) => {
        const file = new File([blob], "audio.webm", { type: blob.type });

        if (fileRef.current) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileRef.current.files = dataTransfer.files;

            const audio = fileRef.current.files[0];
            //console.log(audio);

            const formData = new FormData();
            formData.append("file", audio);
            formData.append("language", chat.language);
            //console.log(formData.get("file"));
            axios
                .post(
                    "http://127.0.0.1:8080/whisper",

                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "Access-Control-Allow-Origin": "*",
                        },
                    }
                )
                .then((response) => {
                    chat.setPending(false);
                    console.log(response.data.results[0].translation_text);
                    const text = response.data.results[0].translation_text;
                    chat.addMessage(text);
                });
        }
    };
    return (
        <main className="flex min-h-screen flex-col items-center justify-between py-8 overflow-y-scroll bg-black ">
            <AnimatedTooltipPreview />
            <div className="flex w-full items-center justify-center">
                <form className="flex flex-col justify-center items-center w-[60%]">
                    <div className="w-full ">
                        <ChatBox />
                    </div>
                    <input type="file" name="audio" hidden ref={fileRef} />
                    <button type="submit" hidden ref={buttonRef} />
                    <div className="fixed bottom-0 h-30 w-full overflow-hidden rounded-t-3x items-center justify-center bg-black left-0">
                        <Recorder uploadAudio={uploadAudio} />
                    </div>
                </form>
            </div>
        </main>
    );
}
