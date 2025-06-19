import { useGameContext } from "@/components/GameContextProvider";
import { Scenario1, Scenario2, scenario3, scenario4, scenario5 } from "@/lib/constants";
import { useVideoRecording } from "@/lib/hooks/useVideoRecording";
import { Headphones, Languages, User, Users } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

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

// Modal styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200000;
`;
const ModalBox = styled.div`
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  padding: 36px 32px 28px 32px;
  min-width: 320px;
  max-width: 90vw;
  text-align: center;
  @media (max-width: 600px) {
    min-width: 90vw;
    padding: 18px 8px 16px 8px;
    font-size: 0.98rem;
  }
`;
const ModalTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 18px;
`;
const ModalButton = styled.button`
  background: #22c55e;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 18px;
  cursor: pointer;
  transition: background 0.18s;
  &:hover {
    background: #16a34a;
  }
  @media (max-width: 600px) {
    padding: 10px 18px;
    font-size: 1rem;
  }
`;

// Sidebar styles
const Sidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${(props) => (props.$collapsed ? "60px" : "260px")};
  background: #fff;
  border-right: 2px solid #e5e7eb;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
  z-index: 100001;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: width 0.2s;
  padding: 0;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    background: #f3f4f6;
  }
  @media (max-width: 600px) {
    width: ${(props) => (props.$collapsed ? "44px" : "160px")};
  }
`;
const SidebarTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  padding: 24px 0 16px 0;
  color: #222;
  letter-spacing: 0.5px;
  display: ${(props) => (props.$collapsed ? "none" : "block")};
  text-align: center;
  width: 100%;
  @media (max-width: 600px) {
    font-size: 1.1rem;
    padding: 16px 0 10px 0;
  }
`;
const SidebarButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  padding-left: 0;
`;
const ScenarioButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.$collapsed ? "0" : "12px")};
  width: ${(props) => (props.$collapsed ? "44px" : "90%")};
  height: 44px;
  margin: 0;
  padding: 0 0 0 16px;
  border: none;
  border-radius: 24px;
  background: ${(props) => (props.$active ? "#e0e7ff" : "transparent")};
  color: ${(props) => (props.$active ? "#3730a3" : "#222")};
  font-weight: 500;
  font-size: 1.08rem;
  cursor: pointer;
  outline: none;
  position: relative;
  transition: background 0.2s, color 0.2s;
  justify-content: flex-start;
  border-left: none;
  min-height: 44px;
  min-width: 44px;
  text-align: left;
  &:hover {
    background: #f1f5ff;
    color: #3730a3;
  }
  @media (max-width: 600px) {
    width: ${(props) => (props.$collapsed ? "36px" : "100%")};
    height: 36px;
    min-height: 36px;
    min-width: 36px;
    font-size: 0.95rem;
    border-radius: 18px;
    padding: 0 0 0 8px;
  }
`;
const ScenarioButtonText = styled.span`
  display: ${(props) => (props.$collapsed ? "none" : "inline")};
  margin-left: 16px;
  font-size: 1.08rem;
  font-weight: 500;
  text-align: left;
  @media (max-width: 600px) {
    font-size: 0.95rem;
    margin-left: 8px;
  }
`;
const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  font-size: 1.3rem;
  @media (max-width: 600px) {
    min-width: 22px;
    font-size: 1.1rem;
  }
`;

// Constants
const LANGUAGE_ENFORCEMENT =
  "You must always respond in English only. Never use Spanish, Italian, or any other language. All responses must be in clear, natural English.";

const FloatingResultsButton = styled.button`
  position: fixed;
  left: 50%;
  bottom: 36px;
  transform: translateX(-50%);
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 14px 36px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 300000;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 0.18s;
  &:hover {
    background: #1d4ed8;
  }
  @media (max-width: 600px) {
    padding: 10px 18px;
    font-size: 1rem;
    bottom: 16px;
  }
  @media (max-width: 400px) {
    padding: 8px 8px;
    font-size: 0.95rem;
    bottom: 8px;
  }
`;

// Add placeholder scenario constants for 6 and 7
const scenario6 = "Roleplay 3 instructions.";
const scenario7 = "Roleplay 4 instructions.";

export default function SessionApp({ mainStateDispatch }) {
  const [systemMessage, setSystemMessage] = useState(Scenario1);
  const [currentScenario, setCurrentScenario] = useState("1");
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const peerConnection = useRef(null);
  const audioElement = useRef(null);
  const microphoneStream = useRef(null);
  const {
    humanoidRef,
    uploadLoading,
    setCurrentScenario: setGameContextScenario,
    respondingData,
  } = useGameContext();
  const { startRecording, stopRecording, isRecording, error: recordingError } = useVideoRecording();
  // SSR-safe sidebar collapsed state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [pendingScenario, setPendingScenario] = React.useState(null);
  const [showSideBar, setShowSideBar] = useState(true);

  // Scenario configurations
  const scenarios = {
    1: Scenario1,
    2: Scenario2,
    3: scenario3,
    4: scenario4,
    5: scenario5,
    6: scenario6,
    7: scenario7,
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
  const setScenario6 = () => setScenario("6");
  const setScenario7 = () => setScenario("7");

  // Function to mute the microphone
  const muteMicrophone = () => {
    if (microphoneStream.current) {
      microphoneStream.current.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
      console.log("Microphone muted");
    }
  };

  // Function to unmute the microphone
  const unmuteMicrophone = () => {
    if (microphoneStream.current) {
      microphoneStream.current.getAudioTracks().forEach((track) => {
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
      microphoneStream.current.getTracks().forEach((track) => track.stop());
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
              model: "whisper-1",
            },
          },
        };
        sendClientEvent(sessionUpdateEvent);

        console.log("Data channel opened for scenario:", currentScenario);

        if (currentScenario === "4") {
          // For scenario 4, send the role rule and unmute after audio completes
          sendSystemMessage(
            systemMessage +
              "\n\nIMPORTANT: Start the conversation by saying exactly 'Hey there boss! How is it going?' with a little tired or low on energy, reflecting your current overwhelmed state. Then wait for the manager's response."
          );
          sendTextMessage("Begin the roleplay now.");
          // Note: microphone will be unmuted after the introduction audio completes
          console.log("Scenario 4 session ready, waiting for introduction audio to complete...");
        } else if (currentScenario === "5") {
          // For scenario 5, modify system message to include opening line
          sendSystemMessage(
            systemMessage +
              "\n\nIMPORTANT: Start the conversation by saying exactly 'Hey there boss! How is it going?' with a little tired or low on energy, reflecting your current overwhelmed state. Then wait for the manager's response."
          );
          sendTextMessage("Begin the roleplay now.");
          console.log("Scenario 5 session ready with modified system message");
        } else {
          // For scenarios 1-3, send system message and auto-start (mic stays muted until avatar finishes)
          sendSystemMessage(systemMessage);
          sendTextMessage("Hey there! Could you introduce yourself briefly?");
          console.log(
            `Scenario ${currentScenario} session ready, mic will unmute after avatar's first message`
          );
        }
      });
    }
  }, [dataChannel, currentScenario]);

  // Handler for sidebar click (ignores clicks on scenario buttons)
  function handleSidebarClick(e) {
    // If the click is on a scenario button or its child, do not toggle
    if (e.target.closest("[data-scenario-button]")) return;
    setSidebarCollapsed((c) => !c);
  }

  function handleScenarioClick(scenarioNumber, setScenarioFn) {
    setPendingScenario({ scenarioNumber, setScenarioFn });
    setShowModal(true);
  }
  function handleStartSession() {
    if (pendingScenario) {
      pendingScenario.setScenarioFn();
      startSession(pendingScenario.scenarioNumber);
      setShowModal(false);
      setShowSideBar(false);
      setPendingScenario(null);
    }
  }

  return (
    <>
      {showSideBar ? (
        <Sidebar $collapsed={sidebarCollapsed} onClick={handleSidebarClick}>
          <SidebarTitle $collapsed={sidebarCollapsed}>Scenarios</SidebarTitle>
          <SidebarButtons>
            <ScenarioButton
              data-scenario-button
              $active={currentScenario === "1"}
              $collapsed={sidebarCollapsed}
              onClick={(e) => {
                e.stopPropagation();
                handleScenarioClick("1", setScenario1);
              }}
              title="Language Learning"
            >
              <IconWrapper>
                <Languages size={22} />
              </IconWrapper>
              <ScenarioButtonText $collapsed={sidebarCollapsed}>
                Language Learning
              </ScenarioButtonText>
            </ScenarioButton>
            <ScenarioButton
              data-scenario-button
              $active={currentScenario === "2"}
              $collapsed={sidebarCollapsed}
              onClick={(e) => {
                e.stopPropagation();
                handleScenarioClick("2", setScenario2);
              }}
              title="Sales"
            >
              <IconWrapper>
                <User size={22} />
              </IconWrapper>
              <ScenarioButtonText $collapsed={sidebarCollapsed}>Sales</ScenarioButtonText>
            </ScenarioButton>
            <ScenarioButton
              data-scenario-button
              $active={currentScenario === "3"}
              $collapsed={sidebarCollapsed}
              onClick={(e) => {
                e.stopPropagation();
                handleScenarioClick("3", setScenario3);
              }}
              title="Customer Service"
            >
              <IconWrapper>
                <Headphones size={22} />
              </IconWrapper>
              <ScenarioButtonText $collapsed={sidebarCollapsed}>
                Customer Service
              </ScenarioButtonText>
            </ScenarioButton>
            <ScenarioButton
              data-scenario-button
              $active={currentScenario === "4"}
              $collapsed={sidebarCollapsed}
              onClick={(e) => {
                e.stopPropagation();
                handleScenarioClick("4", setScenario4);
              }}
              title="Roleplay 1"
            >
              <IconWrapper>
                <Users size={22} />
              </IconWrapper>
              <ScenarioButtonText $collapsed={sidebarCollapsed}>Roleplay 1</ScenarioButtonText>
            </ScenarioButton>
            <ScenarioButton
              data-scenario-button
              $active={currentScenario === "5"}
              $collapsed={sidebarCollapsed}
              onClick={(e) => {
                e.stopPropagation();
                handleScenarioClick("5", setScenario5);
              }}
              title="Roleplay 2"
            >
              <IconWrapper>
                <Users size={22} />
              </IconWrapper>
              <ScenarioButtonText $collapsed={sidebarCollapsed}>Roleplay 2</ScenarioButtonText>
            </ScenarioButton>
            <ScenarioButton
              data-scenario-button
              $active={currentScenario === "6"}
              $collapsed={sidebarCollapsed}
              onClick={(e) => {
                e.stopPropagation();
                handleScenarioClick("6", setScenario6);
              }}
              title="Roleplay 3"
            >
              <IconWrapper>
                <Users size={22} />
              </IconWrapper>
              <ScenarioButtonText $collapsed={sidebarCollapsed}>Roleplay 3</ScenarioButtonText>
            </ScenarioButton>
            <ScenarioButton
              data-scenario-button
              $active={currentScenario === "7"}
              $collapsed={sidebarCollapsed}
              onClick={(e) => {
                e.stopPropagation();
                handleScenarioClick("7", setScenario7);
              }}
              title="Roleplay 4"
            >
              <IconWrapper>
                <Users size={22} />
              </IconWrapper>
              <ScenarioButtonText $collapsed={sidebarCollapsed}>Roleplay 4</ScenarioButtonText>
            </ScenarioButton>
          </SidebarButtons>
        </Sidebar>
      ) : null}
      {showModal && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>Welcome to the scenario</ModalTitle>
            <ModalButton onClick={handleStartSession}>Start Session</ModalButton>
          </ModalBox>
        </ModalOverlay>
      )}
      {isSessionActive && (
        <FloatingResultsButton
          onClick={stopSession}
          disabled={uploadLoading.current !== false || respondingData.current === null}
          style={{
            opacity: uploadLoading.current !== false || respondingData.current === null ? 0.6 : 1,
            pointerEvents:
              uploadLoading.current !== false || respondingData.current === null ? "none" : "auto",
          }}
        >
          <span style={{ display: "flex", alignItems: "center" }}>
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-list"
              viewBox="0 0 24 24"
            >
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            Results
          </span>
        </FloatingResultsButton>
      )}
    </>
  );
}
