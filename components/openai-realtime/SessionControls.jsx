import { useState } from "react";
import { CloudLightning, CloudOff } from "react-feather";
import styled from "styled-components";
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
  gap: 0.5rem;
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
      <Button
        onClick={() => {
          scenario1();
          handleStartSession();
        }}
        $isActive={isActivating}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "Language Learning Coach"}
      </Button>

      <Button
        onClick={() => {
          scenario2();
          handleStartSession();
        }}
        $isActive={isActivating}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "Sales Coach"}
      </Button>

      <Button
        onClick={() => {
          scenario3();
          handleStartSession();
        }}
        $isActive={isActivating}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "Customer Service Coach"}
      </Button>
    </SessionStoppedContainer>
  );
}

function SessionActive({ stopSession, sendTextMessage, isRecording }) {
  const [message, setMessage] = useState("");

  function handleSendClientEvent() {
    sendTextMessage(message);
    setMessage("");
  }

  return (
    <SessionActiveContainer>
      <Button onClick={stopSession} icon={<CloudOff height={16} />}>
        Submit
      </Button>
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
