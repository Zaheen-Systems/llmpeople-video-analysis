import { Humanoid } from "@/lib/babylonjs/Humanoid";
import { RespondingData } from "@/lib/hooks/useUploadVideo";
import { CurrentSoundRef, HumanoidRef } from "@/lib/types";
import React, { ReactNode, createContext, useContext, useRef, useState } from "react";

type GameContext = {
  humanoidRef: HumanoidRef;
  currentSoundRef: CurrentSoundRef;
  uploadLoading: React.MutableRefObject<boolean | null>;
  uploadError: string | null;
  respondingData: React.MutableRefObject<RespondingData | null>;
  setUploadLoading: (loading: boolean | null) => void;
  setUploadError: (error: string | null) => void;
  setRespondingData: (data: RespondingData | null) => void;
};

const defaultGameContext: GameContext = {
  humanoidRef: { current: null },
  currentSoundRef: { current: null },
  uploadLoading: { current: null },
  uploadError: null,
  respondingData: { current: null },
  setUploadLoading: () => {},
  setUploadError: () => {},
  setRespondingData: () => {},
};

export const GameContextContext = createContext<GameContext>(defaultGameContext);

export const useGameContext = () => {
  return useContext(GameContextContext);
};

interface GameContextProviderProps {
  children: ReactNode;
}

export const GameContextProvider: React.FC<GameContextProviderProps> = ({ children }) => {
  const humanoidRef = useRef<Humanoid | null>(null);
  const currentSoundRef = useRef<HTMLAudioElement | null>(null);
  const uploadLoading = useRef<boolean | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const respondingData = useRef<RespondingData | null>(null);

  const setUploadLoading = (loading: boolean | null) => {
    uploadLoading.current = loading;
  };

  const setRespondingData = (data: RespondingData | null) => {
    respondingData.current = data;
  };

  const value = {
    humanoidRef,
    currentSoundRef,
    uploadLoading,
    uploadError,
    respondingData,
    setUploadLoading,
    setUploadError,
    setRespondingData,
  };

  return <GameContextContext.Provider value={value}>{children}</GameContextContext.Provider>;
};

export default GameContextProvider;
