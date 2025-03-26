import { useRef, useState } from "react";

interface FacialExpressions {
  calmAndApproachableExpression: string;
  engagedListening: string;
  noSignsOfFrustrationOrAnnoyance: string;
  supportiveGestures: string;
  openAndRelaxedFacialFeatures: string;
}

interface SoundToneOfVoice {
  calmAndSteadyTone: string;
  empatheticTone: string;
  clearArticulation: string;
  nonDefensiveTone: string;
  appropriateVolume: string;
}

interface TextChoiceOfWords {
  acknowledgmentOfTheIssue: string;
  useOfPoliteLanguage: string;
  solutionOrientedWords: string;
  apologeticAndResponsibleLanguage: string;
  avoidanceOfBlamingLanguage: string;
}

interface Feedback {
  positiveAreas: string;
  improvementSuggestions: string;
}

interface RespondingData {
  facialExpressions: FacialExpressions;
  soundToneOfVoice: SoundToneOfVoice;
  textChoiceOfWords: TextChoiceOfWords;
  overallScore: number;
  feedback: Feedback;
}

const SESSION_STORAGE_KEY = "videoUploadData";

const useUploadVideo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Retrieve data from sessionStorage on client side only
  const respondingData = useRef<RespondingData | null>(
    typeof window !== "undefined"
      ? (() => {
          const storedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
          return storedData ? JSON.parse(storedData) : null;
        })()
      : null
  );

  const uploadVideo = async (videoTag: string, video: Blob | null) => {
    setLoading(true);
    setError(null);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "");
    }

    try {
      const formData = new FormData();
      formData.append("video_tag", videoTag);
      if (video !== null) {
        formData.append("video_file", video);
      }

      console.log("Sending request with formData:", {
        videoTag,
        hasVideo: video !== null,
      });

      const response = await fetch(
        "https://ial-backend.zaheen.ai/api/v1/activity-progress/ai-activity",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: formData,
        }
      );

      console.log("Response status:", response.status);
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const result: RespondingData | null = responseText ? JSON.parse(responseText) : {};
      console.log("Parsed result:", result);

      if (result !== null) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(result));
          console.log("Stored data in sessionStorage:", JSON.stringify(result));
        }
        respondingData.current = result;
      } else {
        throw new Error("Empty response from server");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return { uploadVideo, loading, error, respondingData };
};

export default useUploadVideo;
