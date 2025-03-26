import { useCallback, useRef, useState } from "react";

interface VideoRecordingHook {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  isRecording: boolean;
  error: string | null;
}

export const useVideoRecording = (): VideoRecordingHook => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const chunksRef = useRef<Blob[]>([]); // New ref to store chunks
  const startRecording = async (): Promise<void> => {
    chunksRef.current = []; // Clear chunks ref
    setRecordedChunks([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (!videoRef.current) {
        videoRef.current = document.createElement("video");
        videoRef.current.autoplay = true;
        videoRef.current.style.position = "absolute";
        videoRef.current.style.top = "10px";
        videoRef.current.style.left = "10px";
        videoRef.current.style.width = "320px";
        videoRef.current.style.zIndex = "100";
        videoRef.current.volume = 0;
        document.body.appendChild(videoRef.current);
      }

      videoRef.current.srcObject = stream;

      // Check available MIME types
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : "video/webm";

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps
      });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          console.log("Received chunk of size:", event.data.size);
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        console.log("Total chunks collected:", chunksRef.current.length);
        console.log(
          "Total size of chunks:",
          chunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0)
        );

        const blob = new Blob(chunksRef.current, { type: mimeType });
        console.log("Final blob size:", blob.size);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = `session-recording-${new Date().toISOString()}.webm`;
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        chunksRef.current = [];
        setRecordedChunks([]);
      };

      // Request data more frequently
      recorder.start(100); // Collect data every 100ms
      console.log("Recording started with MIME type:", mimeType);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start recording";
      setError(errorMessage);
      console.error("Error starting recording:", err);
    }
  };

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        console.log("Stopping recording...");

        // Request final data
        if (mediaRecorder.state === "recording") {
          mediaRecorder.requestData();
        }

        mediaRecorder.onstop = async () => {
          console.log("Total chunks collected:", chunksRef.current.length);
          console.log(
            "Total size of chunks:",
            chunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0)
          );

          const mimeType = mediaRecorder.mimeType;
          const blob = new Blob(chunksRef.current, { type: mimeType });
          console.log("Final blob size:", blob.size);

          // Cleanup
          chunksRef.current = [];
          setRecordedChunks([]);
          resolve(blob);
        };

        // Small delay to ensure we get the last chunk
        setTimeout(() => {
          // Stop all tracks
          if (videoRef.current?.srcObject instanceof MediaStream) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          }

          // Remove video element
          if (videoRef.current) {
            document.body.removeChild(videoRef.current);
            videoRef.current = null;
          }

          // Stop the recording
          mediaRecorder.stop();
          setIsRecording(false);
          setMediaRecorder(null);
        }, 100);
      } else {
        resolve(null);
      }
    });
  }, [mediaRecorder]);

  return {
    startRecording,
    stopRecording,
    isRecording,
    error,
  };
};
