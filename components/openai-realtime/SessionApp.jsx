import { useGameContext } from "@/components/GameContextProvider";
import { Scenario1, Scenario2, scenario3 } from "@/lib/constants";
import { useVideoRecording } from "@/lib/hooks/useVideoRecording";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SessionControls from "./SessionControls";

const ControlsSection = styled.section`
  position: absolute;
  height: 32px; /* equivalent to h-32 */
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px; /* equivalent to p-4 */
  background-color: rgb(255, 255, 255); /* equivalent to bg-red-800 */
  z-index: 10;
`;

export default function SessionApp({ mainStateDispatch }) {
  const [systemMessage, setSystemMessage] = useState(Scenario1);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const peerConnection = useRef(null);
  const audioElement = useRef(null);
  const { humanoidRef, uploadLoading } = useGameContext();
  const { startRecording, stopRecording, isRecording, error: recordingError } = useVideoRecording();

  const setScenario1 = () => {
    setSystemMessage(Scenario1);
  };

  const setScenario2 = () => {
    setSystemMessage(Scenario2);
  };

  const setScenario3 = () => {
    setSystemMessage(scenario3);
  };

  useEffect(() => {
    if (recordingError) {
      console.error("Recording error:", recordingError);
      // Handle recording error (e.g., show to user)
    }
  }, [recordingError]);

  useEffect(() => {
    console.log("events changed:", events);
  }, [events]);

  async function startSession() {
    // Get an ephemeral key from the Fastify server
    let tokenResponse;
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    try {
      const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          voice: "verse",
        }),
      });
      tokenResponse = await response.json();
    } catch (error) {
      console.error("Token generation error:", error);
      return;
    }
    const data = tokenResponse;
    const EPHEMERAL_KEY = data.client_secret.value;

    // Create a peer connection
    const pc = new RTCPeerConnection();

    // Set up to play remote audio from the model
    audioElement.current = document.createElement("audio");
    audioElement.current.autoplay = true;

    pc.ontrack = (e) => {
      console.log("Received audio track");

      if (!audioElement.current) {
        audioElement.current = document.createElement("audio");
        audioElement.current.autoplay = true;
        document.body.appendChild(audioElement.current); // Ensure it's part of the DOM
      }

      const stream = e.streams[0];
      audioElement.current.srcObject = stream;

      // Log when the audio starts playing
      stream.getAudioTracks().forEach((track) => {
        track.addEventListener("started", () => console.log("Audio track started"));
        track.addEventListener("ended", () => console.log("Audio track ended"));
      });

      audioElement.current.onplay = () => {
        console.log("Audio element started playing.");
      };

      audioElement.current.onended = () => {
        console.log("Audio element playback ended.");
      };
    };

    // Add local audio track for microphone input in the browser
    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    pc.addTrack(ms.getTracks()[0]);

    // Set up data channel for sending and receiving events
    const dc = pc.createDataChannel("oai-events");
    setDataChannel(dc);

    // Start the session using the Session Description Protocol (SDP)
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-realtime-preview-2024-12-17";
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${EPHEMERAL_KEY}`,
        "Content-Type": "application/sdp",
      },
    });

    const answer = {
      type: "answer",
      sdp: await sdpResponse.text(),
    };
    await pc.setRemoteDescription(answer);

    peerConnection.current = pc;
    await startRecording();
  }

  // Stop current session, clean up peer connection and data channel
  async function stopSession() {
    humanoidRef.current.talkAnimationEnd();
    if (dataChannel) {
      dataChannel.close();
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setDataChannel(null);
    setIsSessionActive(false);
    mainStateDispatch({ type: "SET_IS_LOADING", payload: true });
    await stopRecording();
    while (uploadLoading.current) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    mainStateDispatch({ type: "SET_IS_LOADING", payload: false });

    mainStateDispatch({ type: "SHOW_RESPONDING_COMPONENT", payload: true });
  }

  // Send a message to the model via the data channel
  function sendClientEvent(message) {
    if (dataChannel) {
      message.event_id = message.event_id || crypto.randomUUID();
      dataChannel.send(JSON.stringify(message));
      setEvents((prev) => [message, ...prev]);
    } else {
      console.error("Failed to send message - no data channel available", message);
    }
  }

  // Send a user text message to the model
  function sendTextMessage(message) {
    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      },
    };

    sendClientEvent(event);
    sendClientEvent({ type: "response.create" });
  }

  // Send a system message to the model
  function sendSystemMessage(message) {
    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "system",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      },
    };

    sendClientEvent(event);
  }

  // Attach event listeners to the data channel when it is created
  useEffect(() => {
    if (dataChannel) {
      // Listen for server events
      dataChannel.addEventListener("message", (e) => {
        console.log("Session APP: Received server event:", e.data);
        const data = JSON.parse(e.data);
        if (data.type === "output_audio_buffer.started") {
          humanoidRef.current.talkAnimationStart();
        }
        if (data.type === "output_audio_buffer.stopped") {
          humanoidRef.current.talkAnimationEnd();
        }
        console.log("Session App data: ", data);
        setEvents((prev) => [data, ...prev]);
      });

      // When the data channel opens, set the session active,
      // clear previous events, and send the fixed system message.
      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);
        sendSystemMessage(systemMessage);
        sendTextMessage("Hey There, Explain about yourself, be consice");
      });
    }
  }, [dataChannel]);

  return (
    <>
      <ControlsSection>
        <SessionControls
          startSession={startSession}
          stopSession={stopSession}
          sendClientEvent={sendClientEvent}
          sendTextMessage={sendTextMessage}
          events={events}
          isSessionActive={isSessionActive}
          isRecording={isRecording}
          scenario1={setScenario1}
          scenario2={setScenario2}
          scenario3={setScenario3}
        />
      </ControlsSection>
    </>
  );
}
