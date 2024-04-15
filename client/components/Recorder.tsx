"use client";
import React, { useContext } from "react";
import { ChatContext } from "./ChatProvider";
import Image from "next/image";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import activeAssistantIcon from "@/public/sirigif3.gif";
import inActiveAssistantIcon from "@/public/siri2.png";
export const mimeType = "audio/webm";

function Recorder({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) {
    const mediaRecorder = React.useRef<MediaRecorder | null>(null);

    const [permission, setPermission] = React.useState(false);
    const [stream, setStream] = React.useState<MediaStream | null>(null);

    const [recordingStatus, setRecordingStatus] = React.useState("inactive");
    const [audioChunks, setAudioChunks] = React.useState<Blob[]>([]);
    const { pending, setPending } = useContext(ChatContext);

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err: any) {
                alert(err.message);
            }
        } else {
            alert("Browser does not support MediaRecorder API");
        }
    };
    React.useEffect(() => {
        getMicrophonePermission();
    }, []);

    const startRecording = async () => {
        if (stream === null || pending || mediaRecorder === null) return;
        setRecordingStatus("recording");

        const media = new MediaRecorder(stream, { mimeType });
        mediaRecorder.current = media;
        mediaRecorder.current.start();

        let localAudioChunks: Blob[] = [];

        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;

            localAudioChunks.push(event.data);
        };

        setAudioChunks(localAudioChunks);
    };

    const stoprecording = async () => {
        if (mediaRecorder.current === null || pending) return;

        setRecordingStatus("inactive");
        setPending(true);
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const audiourl = URL.createObjectURL(audioBlob);

            //const anchor = document.createElement("a");
            //anchor.href = audiourl;
            //anchor.download = "audio.mp3";
            //anchor.click();

            uploadAudio(audioBlob);

            setAudioChunks([]);
        };
    };
    return (
        <div className="flex items-center justify-center text-white">
            {!permission && (
                <Button onClick={getMicrophonePermission}>
                    Get Microphone
                </Button>
            )}

            {pending && (
                <Image
                    src={activeAssistantIcon}
                    alt="recording"
                    width={50}
                    height={50}
                    priority
                    className="assistant grayscale"
                />
            )}
            {permission && recordingStatus === "inactive" && !pending && (
                <Image
                    src={inActiveAssistantIcon}
                    alt="not recording"
                    width={400}
                    height={400}
                    onClick={startRecording}
                    priority
                    className="assistant cursor-pointer hover:scale-150 duration-150 transition-all ease-in-out"
                    unoptimized={true}
                />
            )}
            {recordingStatus === "recording" && (
                <Image
                    src={activeAssistantIcon}
                    alt="recording"
                    width={50}
                    height={50}
                    onClick={stoprecording}
                    priority={true}
                    className="assistant cursor-pointer"
                    unoptimized={true}
                />
            )}
        </div>
    );
}

export default Recorder;
