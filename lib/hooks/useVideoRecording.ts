import { useCallback, useRef, useState } from "react";
import useUploadVideo from "./useUploadVideo";

interface VideoRecordingHook {
  startRecording: (scenarioOverride?: string) => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  isRecording: boolean;
  error: string | null;
}

const ONE_MINUTE = 60000; // 1 minute in milliseconds

export const useVideoRecording = (currentScenario?: string): VideoRecordingHook => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const oneMinuteChunksRef = useRef<Blob[]>([]);
  const hasUploadedOneMinute = useRef<boolean>(false);
  const recordingStartTime = useRef<number>(0);
  const scenarioRef = useRef<string | undefined>(undefined);
  const { uploadVideo } = useUploadVideo();

  const handleOneMinuteRecording = useCallback(async () => {
    // Double-check to prevent multiple calls
    if (hasUploadedOneMinute.current) {
      return;
    }

    console.log("Starting 1-minute upload process...");
    hasUploadedOneMinute.current = true; // Set this BEFORE the upload to prevent race conditions

    // Create a temporary recorder to get a proper 1-minute segment
    try {
      const currentRecorder = mediaRecorderRef.current;
      if (!currentRecorder || currentRecorder.state !== "recording") {
        console.log("No active recorder for 1-minute upload");
        return;
      }

      // Request data to ensure we have the latest chunk
      currentRecorder.requestData();

      // Wait a bit longer for the data to be available
      await new Promise(resolve => setTimeout(resolve, 200));

      const mimeType = currentRecorder.mimeType || "video/webm";
      const oneMinuteBlob = new Blob(oneMinuteChunksRef.current, { type: mimeType });

      console.log("1-minute blob size:", oneMinuteBlob.size, "chunks:", oneMinuteChunksRef.current.length);

      // Only upload if we have substantial data
      if (oneMinuteBlob.size > 50000) { // Increased threshold to 50KB
        const scenarioToUse = scenarioRef.current || currentScenario;
        console.log("Uploading video with scenario:", scenarioToUse);
        await uploadVideo("responding", oneMinuteBlob, scenarioToUse);
      } else {
        console.log("Skipping 1-minute upload - insufficient data:", oneMinuteBlob.size);
        hasUploadedOneMinute.current = false; // Reset so we can try again
      }
    } catch (error) {
      console.error("Error in 1-minute upload:", error);
      hasUploadedOneMinute.current = false; // Reset on error
    }
  }, [uploadVideo, currentScenario]);

  const startRecording = async (scenarioOverride?: string): Promise<void> => {
    console.log("startRecording called with scenarioOverride:", scenarioOverride);
    chunksRef.current = [];
    oneMinuteChunksRef.current = [];
    hasUploadedOneMinute.current = false;
    recordingStartTime.current = Date.now();
    scenarioRef.current = scenarioOverride;
    console.log("scenarioRef.current set to:", scenarioRef.current);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          frameRate: { ideal: 15 }
        },
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
        videoBitsPerSecond: 500000, // 0.5 Mbps (reduced from 2.5 Mbps)
      });

      // Set up a single timeout for the one-minute mark
      const oneMinuteTimeout = setTimeout(() => {
        if (!hasUploadedOneMinute.current) {
          handleOneMinuteRecording();
        }
      }, ONE_MINUTE);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);

          // Only store chunks for the first minute
          if (!hasUploadedOneMinute.current) {
            oneMinuteChunksRef.current.push(event.data);
          }
        }
      };

      recorder.onstop = () => {
        clearTimeout(oneMinuteTimeout); // Clean up timeout if recording stops early
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
        oneMinuteChunksRef.current = [];
      };

      // Request data less frequently to reduce memory usage
      recorder.start(1000); // Collect data every 1000ms (1 second)
      console.log("Recording started with MIME type:", mimeType);
      setMediaRecorder(recorder);
      mediaRecorderRef.current = recorder;
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
          mediaRecorderRef.current = null;
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
