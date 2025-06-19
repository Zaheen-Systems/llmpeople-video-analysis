import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const PermissionHandler: React.FC = () => {
  const [permissions, setPermissions] = useState<{
    microphone: PermissionState;
    camera: PermissionState;
  }>({
    microphone: 'prompt',
    camera: 'prompt'
  });

  const [error, setError] = useState<string | null>(null);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setUnsupported(true);
      return;
    }
    // Do not auto-request permissions on mount (better for mobile)
    // Only check permission state if Permissions API is available
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then(micPermission => {
        setPermissions(prev => ({ ...prev, microphone: micPermission.state }));
        micPermission.onchange = () => setPermissions(prev => ({ ...prev, microphone: micPermission.state }));
      });
      navigator.permissions.query({ name: 'camera' as PermissionName }).then(cameraPermission => {
        setPermissions(prev => ({ ...prev, camera: cameraPermission.state }));
        cameraPermission.onchange = () => setPermissions(prev => ({ ...prev, camera: cameraPermission.state }));
      });
    }
  }, []);

  const requestPermissions = async () => {
    setError(null);
    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setUnsupported(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getTracks().forEach(track => track.stop());
      // After requesting, update permission state if possible
      if (navigator.permissions) {
        const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermissions({
          microphone: micPermission.state,
          camera: cameraPermission.state
        });
      }
    } catch (error) {
      setError('Failed to get permissions. Please check your browser settings.');
    }
  };

  if (unsupported) {
    return (
      <PermissionContainer>
        <PermissionMessage>
          Your browser does not support camera/microphone access.<br />
          Please use a modern browser like Chrome, Firefox, or Safari.
        </PermissionMessage>
      </PermissionContainer>
    );
  }

  if (permissions.microphone === 'granted' && permissions.camera === 'granted') {
    return null;
  }

  return (
    <PermissionContainer>
      <PermissionMessage>
        {error || 'This app needs access to your microphone and camera to function properly.'}
      </PermissionMessage>
      <PermissionButton onClick={requestPermissions}>
        Allow Access
      </PermissionButton>
      <PermissionHint>
        On mobile: Tap the camera/microphone icon in your browser's address bar after clicking Allow Access.
      </PermissionHint>
    </PermissionContainer>
  );
};

const PermissionContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  z-index: 1000000;
  max-width: 90%;
  width: 300px;
  backdrop-filter: blur(8px);
`;

const PermissionMessage = styled.p`
  color: white;
  margin-bottom: 16px;
  font-size: 14px;
  line-height: 1.4;
`;

const PermissionButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  margin-bottom: 12px;

  &:hover {
    background: #2563eb;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 12px;
  }
`;

const PermissionHint = styled.p`
  color: #9ca3af;
  font-size: 12px;
  margin: 0;
  line-height: 1.4;
`;

export default PermissionHandler;