import { useGameContext } from "@/components/GameContextProvider";

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

export interface RespondingData {
  facialExpressions: FacialExpressions;
  soundToneOfVoice: SoundToneOfVoice;
  textChoiceOfWords: TextChoiceOfWords;
  overallScore: number;
  feedback: Feedback;
}

const useUploadVideo = () => {
  const { uploadLoading, setUploadError, setRespondingData } = useGameContext();

  const uploadVideo = async (videoTag: string, video: Blob | null, scenario: string = "1") => {
    uploadLoading.current = true;
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("scenario", scenario);
      if (video !== null) {
        formData.append("video_file", video);
      }

      console.log("Uploading video...");
      const response = await fetch("https://vira.zaheen.ai/run_ai_activity", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const responseText = await response.text();
      const result = responseText ? JSON.parse(responseText) : null;
      console.log("Result:", result);

      if (result !== null) {
        const dataToSet = result.result || result;
        console.log("Setting responding data:", dataToSet);

        // Validate data structure before setting
        if (typeof dataToSet === "object" && dataToSet !== null) {
          setRespondingData(dataToSet);
        } else {
          console.error("Invalid data structure received:", dataToSet);
          throw new Error("Invalid data structure received from server");
        }
      } else {
        throw new Error("Empty response from server");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError((err as Error).message);
    } finally {
      uploadLoading.current = false;
    }
  };

  return { uploadVideo };
};

export default useUploadVideo;
