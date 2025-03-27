import { useState } from "react";
import { CloudLightning, CloudOff, List } from "react-feather";
import styled from "styled-components";
import { useGameContext } from "../GameContextProvider";
import Button from "./Button";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Input = styled.input`
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 0.5rem;
  flex: 1;
`;

const SessionStoppedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 1rem;

  /* Make buttons stack on smaller screens */
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    max-width: 230px;
    margin: 0 auto;
  }
`;

const ScenarioButton = styled(Button)`
  width: 230px; /* Fixed width for scenario buttons */
`;

const SessionActiveContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 0.5rem;
`;

function SessionStopped({ startSession, scenario1, scenario2, scenario3 }) {
  const [isActivating, setIsActivating] = useState(false);

  function handleStartSession() {
    if (isActivating) return;
    setIsActivating(true);
    startSession();
  }

  return (
    <SessionStoppedContainer>
      <ScenarioButton
        onClick={() => {
          scenario1();
          handleStartSession();
        }}
        $isActive={isActivating}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "Language Learning Coach"}
      </ScenarioButton>

      <ScenarioButton
        onClick={() => {
          scenario2();
          handleStartSession();
        }}
        $isActive={isActivating}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "Sales Coach"}
      </ScenarioButton>

      <ScenarioButton
        onClick={() => {
          scenario3();
          handleStartSession();
        }}
        $isActive={isActivating}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "Customer Service Coach"}
      </ScenarioButton>
    </SessionStoppedContainer>
  );
}

function SessionActive({ stopSession, sendTextMessage, isRecording }) {
  const [message, setMessage] = useState("");
  const { uploadLoading } = useGameContext();

  function handleSendClientEvent() {
    sendTextMessage(message);
    setMessage("");
  }

  return (
    <SessionActiveContainer>
      <Button
        disabled={uploadLoading.current === null}
        onClick={stopSession}
        icon={<CloudOff height={16} />}
      >
        Submit
      </Button>

      {uploadLoading.current !== null && (
        <Button disabled={uploadLoading.current} onClick={stopSession} icon={<List height={16} />}>
          Results
        </Button>
      )}
    </SessionActiveContainer>
  );
}

const RecordingIndicator = styled.div`
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 16px;
`;

export default function SessionControls({
  startSession,
  stopSession,
  sendClientEvent,
  sendTextMessage,
  serverEvents,
  isSessionActive,
  scenario1,
  scenario2,
  scenario3,
  isRecording,
}) {
  return (
    <Container>
      {isSessionActive ? (
        <SessionActive
          stopSession={stopSession}
          sendClientEvent={sendClientEvent}
          sendTextMessage={sendTextMessage}
          serverEvents={serverEvents}
          isRecording={isRecording}
        />
      ) : (
        <SessionStopped
          startSession={startSession}
          scenario1={scenario1}
          scenario2={scenario2}
          scenario3={scenario3}
        />
      )}
    </Container>
  );
}
