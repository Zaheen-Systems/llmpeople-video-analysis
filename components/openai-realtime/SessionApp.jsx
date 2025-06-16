import { useGameContext } from "@/components/GameContextProvider";
import { Scenario1, Scenario2, scenario3, scenario4, scenario5 } from "@/lib/constants";
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

// Constants
const LANGUAGE_ENFORCEMENT = "You must always respond in English only. Never use Spanish, Italian, or any other language. All responses must be in clear, natural English.";

export default function SessionApp({ mainStateDispatch }) {
  const [systemMessage, setSystemMessage] = useState(Scenario1);
  const [currentScenario, setCurrentScenario] = useState("1");
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const peerConnection = useRef(null);
  const audioElement = useRef(null);
  const microphoneStream = useRef(null);
  const { humanoidRef, uploadLoading, setCurrentScenario: setGameContextScenario } = useGameContext();
  const { startRecording, stopRecording, isRecording, error: recordingError } = useVideoRecording();

  // Scenario configurations
  const scenarios = {
    "1": Scenario1,
    "2": Scenario2,
    "3": scenario3,
    "4": scenario4,
    "5": scenario5
  };

  const setScenario = (scenarioNumber) => {
    setSystemMessage(scenarios[scenarioNumber]);
    setCurrentScenario(scenarioNumber);
  };

  const setScenario1 = () => setScenario("1");
  const setScenario2 = () => setScenario("2");
  const setScenario3 = () => setScenario("3");
  const setScenario4 = () => setScenario("4");
  const setScenario5 = () => setScenario("5");

  // Function to mute the microphone
  const muteMicrophone = () => {
    if (microphoneStream.current) {
      microphoneStream.current.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
      console.log("Microphone muted");
    }
  };

  // Function to unmute the microphone
  const unmuteMicrophone = () => {
    if (microphoneStream.current) {
      microphoneStream.current.getAudioTracks().forEach(track => {
        track.enabled = true;
      });
      console.log("Microphone unmuted");
    }
  };

  // Function to play pre-made audio for scenario 4 introduction
  const playIntroductionAudio = async () => {
    try {
      // Path to your pre-made audio file (you'll need to add this to your public folder)
      const audioUrl = "/audio/scenario4-intro.wav"; // Updated to use the correct .wav file

      return new Promise((resolve, reject) => {
        const audio = new Audio(audioUrl);

        audio.onended = () => {
          humanoidRef.current.talkAnimationEnd();
          console.log("Pre-made audio introduction completed");
          resolve();
        };

        audio.onerror = (error) => {
          humanoidRef.current.talkAnimationEnd();
          console.error("Error playing pre-made audio:", error);
          reject(error);
        };

        audio.onloadstart = () => {
          console.log("Starting to load pre-made audio...");
        };

        audio.oncanplay = () => {
          console.log("Pre-made audio can start playing");
          // Start avatar talking animation
          humanoidRef.current.talkAnimationStart();
          audio.play().catch(reject);
        };

        // Start loading the audio
        audio.load();
      });
    } catch (error) {
      console.error("Error setting up pre-made audio:", error);
      humanoidRef.current.talkAnimationEnd();
      throw error;
    }
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

  async function startSession(scenarioNumber) {
    // Store the active scenario in GameContext for use in RespondingComponent
    setGameContextScenario(scenarioNumber);

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
          modalities: ["text", "audio"],
          instructions: LANGUAGE_ENFORCEMENT,
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
    microphoneStream.current = ms;

    // Always mute microphone initially
    muteMicrophone();

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
    console.log(`Starting recording with 90 seconds duration for scenario:`, scenarioNumber);
    await startRecording(scenarioNumber);

    // For scenario 4, play introduction audio after session is established
    // if (scenarioNumber === "4") {
    //   try {
    //     console.log("Playing scenario 4 introduction audio...");
    //     await playIntroductionAudio();
    //     console.log("Audio introduction completed, unmuting microphone...");
    //     unmuteMicrophone();
    //   } catch (error) {
    //     console.error("Failed to play introduction audio:", error);
    //     // Unmute microphone even if audio fails
    //     unmuteMicrophone();
    //   }
    // }
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

    // Clean up microphone stream
    if (microphoneStream.current) {
      microphoneStream.current.getTracks().forEach(track => track.stop());
      microphoneStream.current = null;
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
            text: message + " (Please respond in English only)",
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
            text: message + LANGUAGE_ENFORCEMENT,
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
          // Unmute microphone after avatar finishes speaking
          unmuteMicrophone();
        }
        console.log("Session App data: ", data);
        setEvents((prev) => [data, ...prev]);
      });

      // When the data channel opens, set the session active,
      // clear previous events, and send the fixed system message.
      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);

        // First, update session to enforce English language
        const sessionUpdateEvent = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: LANGUAGE_ENFORCEMENT,
            voice: "verse",
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            input_audio_transcription: {
              model: "whisper-1"
            }
          }
        };
        sendClientEvent(sessionUpdateEvent);

        console.log("Data channel opened for scenario:", currentScenario);

        if (currentScenario === "4") {
          // For scenario 4, send the role rule and unmute after audio completes
          sendSystemMessage(systemMessage + "\n\nIMPORTANT: Start the conversation by saying exactly 'Hey there boss! How is it going?' with a little tired or low on energy, reflecting your current overwhelmed state. Then wait for the manager's response.");
          sendTextMessage("Begin the roleplay now.");
          // Note: microphone will be unmuted after the introduction audio completes
          console.log("Scenario 4 session ready, waiting for introduction audio to complete...");
        } else if (currentScenario === "5") {
          // For scenario 5, modify system message to include opening line
          sendSystemMessage(systemMessage + "\n\nIMPORTANT: Start the conversation by saying exactly 'Hey there boss! How is it going?' with a little tired or low on energy, reflecting your current overwhelmed state. Then wait for the manager's response.");
          sendTextMessage("Begin the roleplay now.");
          console.log("Scenario 5 session ready with modified system message");
        } else {
          // For scenarios 1-3, send system message and auto-start (mic stays muted until avatar finishes)
          sendSystemMessage(systemMessage);
          sendTextMessage("Hey there! Could you introduce yourself briefly?");
          console.log(`Scenario ${currentScenario} session ready, mic will unmute after avatar's first message`);
        }
      });
    }
  }, [dataChannel, currentScenario]);

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
          scenario4={setScenario4}
          scenario5={setScenario5}
        />
      </ControlsSection>
    </>
  );
}
