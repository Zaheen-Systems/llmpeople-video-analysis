"use client";

import media from "@/lib/styleUtils";
import {
  ChatMessage,
  ChatState,
  MainStateDispatch,
  SettingsType,
  SpeechRecognitionLanguageCode,
} from "@/lib/types";
import { memo, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import styled from "styled-components";
import { useGameContext } from "../GameContextProvider";
import { useInitialChatMessage } from "../hooks";
//import { LLMMessage } from "./LLMMessage.client";
type ChatMessagesProps = {
  messages: ChatMessage[];
};

const ChatMessages = memo(function ChatMessages({ messages }: ChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  return (
    <>
      {/* ✅ This removes both LLMMessage and UserMessage */}
      {messages.map((message, index) => (
        <div key={index} className="p-3 bg-gray-700 rounded-lg shadow-md">
          <p>{message.content}</p> {/* ✅ Only displays plain text */}
        </div>
      ))}
      <div ref={endRef} /> {/* Invisible div for auto scrolling purposes */}
    </>
  );
});

const listen = async (language: SpeechRecognitionLanguageCode): Promise<void> => {
  await SpeechRecognition.startListening({
    continuous: false,
    language,
  });
};

type ChatTextAreProps = {
  mainStateDispatch: MainStateDispatch;
  chatState: ChatState;
  settings: SettingsType;
};

export const ChatTextArea = ({ mainStateDispatch, chatState, settings }: ChatTextAreProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { currentSoundRef, humanoidRef } = useGameContext();
  const {
    transcript,
    listening,
    resetTranscript,
    isMicrophoneAvailable,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const { isLoadingMessage } = chatState;
  const hasText = textAreaRef.current ? textAreaRef.current.value.length > 0 : false;

  // The following useEffect is used to scroll to the bottom of the text area.
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  }, [textAreaRef]);

  // The following useEffect updates the text area value when the speech recognition transcript is updated.
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.value = transcript;
      mainStateDispatch({
        type: "UPDATE_CHAT_STATE",
        payload: { textAreaValue: transcript },
      });
    }
  }, [transcript, mainStateDispatch]);

  // return (
  //   <TextareaWrapper>
  //     <Textarea
  //       ref={textAreaRef}
  //       placeholder={isLoadingMessage ? "Loading message..." : "Type message here"}
  //       disabled={isLoadingMessage}
  //       onKeyDown={(e) => {
  //         if (e.key === "Enter" && !e.shiftKey) {
  //           e.preventDefault();
  //           sendChatMessage(
  //             textAreaRef,
  //             mainStateDispatch,
  //             currentSoundRef,
  //             humanoidRef,
  //             chatState,
  //             settings
  //           );
  //         }
  //       }}
  //       onChange={(e) => {
  //         mainStateDispatch({
  //           type: "UPDATE_CHAT_STATE",
  //           payload: { textAreaValue: e.target.value },
  //         });
  //       }}
  //     />
  //     <ChatButtonWrapper>
  //       <ChatButton
  //         disabled={isLoadingMessage || listening}
  //         onClick={() => {
  //           if (hasText) {
  //             sendChatMessage(
  //               textAreaRef,
  //               mainStateDispatch,
  //               currentSoundRef,
  //               humanoidRef,
  //               chatState,
  //               settings
  //             );
  //           } else if (!isMicrophoneAvailable) {
  //             window.alert("Microphone is not available :(");
  //           } else if (!browserSupportsSpeechRecognition) {
  //             window.alert("Speech Recognition API is not supported in your browser :(");
  //           } else {
  //             listen(settings.speechRecognitionLanguageCode);
  //           }
  //         }}
  //       >
  //         <ChatButtonIcon isLoadingMessage={isLoadingMessage} hasText={hasText} />
  //       </ChatButton>
  //     </ChatButtonWrapper>
  //   </TextareaWrapper>
  // );
};

type ChatProps = {
  mainStateDispatch: MainStateDispatch;
  chatState: ChatState;
  settings: SettingsType;
};

export const Chat = ({ mainStateDispatch, chatState, settings }: ChatProps) => {
  useInitialChatMessage(mainStateDispatch, settings);
  return <></>;
};

const ChatWrapper = styled.div`
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 300px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  overflow: auto;
  justify-content: flex-end;
  max-height: 100vh;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.25rem;
    bottom: 0;
    right: 0;
    left: 0;
  }
`;

const ChatMessagesWrapper = styled.div`
  margin-bottom: 0.5rem;
  overflow: auto;
  padding: 5px 10px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    max-height: 30vh;
    margin-bottom: 0.25rem;
    padding: 4px 8px;
  }
`;

const TextareaWrapper = styled.div`
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;

  @media (max-width: 768px) {
    padding: 6px;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 40px;
  max-height: 120px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  resize: none;
  font-size: 14px;
  line-height: 1.4;

  @media (max-width: 768px) {
    min-height: 36px;
    max-height: 100px;
    font-size: 16px; // Better for mobile input
    padding: 6px;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
  }
`;

const ChatButtonWrapper = styled.div`
  position: absolute;
  right: 8px;
  bottom: 8px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    right: 6px;
    bottom: 6px;
  }
`;

const ChatButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  @media (max-width: 768px) {
    padding: 6px;
  }

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
