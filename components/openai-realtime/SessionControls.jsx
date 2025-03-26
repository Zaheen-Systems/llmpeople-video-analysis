import { useState } from "react";
import { CloudLightning, CloudOff, MessageSquare } from "react-feather";
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

function SessionStopped({ startSession, scenario2, scenario3 }) {
  const [isActivating, setIsActivating] = useState(false);

  function handleStartSession() {
    if (isActivating) return;

    setIsActivating(true);
    startSession();
  }

  return (
    <SessionStoppedContainer>
      <Button
        onClick={handleStartSession}
        $isActive={isActivating}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "start scenario 1"}
      </Button>

      <Button
        onClick={() => {
          scenario2();
          handleStartSession();
        }}
        $isActive={isActivating}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "start scenario 2"}
      </Button>

      <Button
        onClick={() => {
          scenario3();
          handleStartSession();
        }}
        $isActive={isActivating}
        icon={<CloudLightning height={16} />}
      >
        {isActivating ? "starting session..." : "start scenario 3"}
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
      <Input
        onKeyDown={(e) => {
          if (e.key === "Enter" && message.trim()) {
            handleSendClientEvent();
          }
        }}
        type="text"
        placeholder="send a text message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        onClick={() => {
          if (message.trim()) {
            handleSendClientEvent();
          }
        }}
        icon={<MessageSquare height={16} />}
      >
        send text
      </Button>
      <Button onClick={stopSession} icon={<CloudOff height={16} />}>
        disconnect
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
        <SessionStopped startSession={startSession} scenario2={scenario2} scenario3={scenario3} />
      )}
    </Container>
  );
}
