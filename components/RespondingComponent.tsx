import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #22409a;
  color: white;
  padding: 24px;
  border-radius: 44px;
  margin: 0 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
`;

const Section = styled.div`
  text-align: left;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  margin-bottom: 4px;
`;

const StrongText = styled.strong`
  font-weight: 600;
`;

const StarsContainer = styled.div`
  font-size: 1.25rem;
`;

const FullStar = styled.span`
  color: #ffc107;
`;

const EmptyStar = styled.span`
  color: #ccc;
`;

const FeedbackText = styled.p`
  margin-bottom: 8px;
`;

const TryAgainButton = styled.button`
  background-color: white;
  color: #22409a;
  padding: 12px 24px;
  border-radius: 24px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 16px;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    opacity: 0.9;
  }
`;

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

interface Feedback {
  positiveAreas: string;
  improvementSuggestions: string;
}

interface AdamRubricEvaluation {
  empathyAndEmotionalSensitivity: { score: number; explanation: string };
  activeListening: { score: number; explanation: string };
  creatingPsychologicalSafety: { score: number; explanation: string };
  handlingDisclosure: { score: number; explanation: string };
  encouragingNextSteps: { score: number; explanation: string };
}

interface AdamRespondingData {
  rubricEvaluation: AdamRubricEvaluation;
  totalScore: number;
  scoreInterpretation: string;
  suggestionsForImprovement: string;
}

interface BenRubricEvaluation {
  feedbackonworkperformance: { score: number; explanation: string };
  problemsolvingandactionplanning: { score: number; explanation: string };
  empathyandaccountability: { score: number; explanation: string };
  careerguidance: { score: number; explanation: string };
  emotionalsensitivityandconversationmanagement: { score: number; explanation: string };
  listeningandverbalcommunication: { score: number; explanation: string };
  facialexpressions: { score: number; explanation: string };
  toneofvoice: { score: number; explanation: string };
  bodylanguageandposture: { score: number; explanation: string };
  responsivenesstoemotionalcues: { score: number; explanation: string };
}

interface BenRespondingData {
  rubricEvaluation: BenRubricEvaluation;
  totalScore: number;
  scoreInterpretation: string;
  suggestionsForImprovement: string;
}

interface BlakeRubricEvaluation {
  clarityofcommunication: { score: number; explanation: string };
  confidenceandprofessionalism: { score: number; explanation: string };
  relevanceofresponses: { score: number; explanation: string };
  demonstrationofrequiredtraits: { score: number; explanation: string };
  abilitytoaskandanswerquestionsprofessionally: { score: number; explanation: string };
}

interface BlakeRespondingData {
  rubricEvaluation: BlakeRubricEvaluation;
  totalScore: number;
  scoreInterpretation: string;
  suggestionsForImprovement: string;
}

interface JordanRubricEvaluation {
  empathyandactivelistening: { score: number; explanation: string };
  composureunderpressure: { score: number; explanation: string };
  clarityofcommunication: { score: number; explanation: string };
  takingownershipandproblemsolving: { score: number; explanation: string };
  professionalismandtone: { score: number; explanation: string };
}

interface JordanRespondingData {
  rubricEvaluation: JordanRubricEvaluation;
  totalScore: number;
  scoreInterpretation: string;
  suggestionsForImprovement: string;
}

// Update the main interface to handle all types
interface RespondingComponentProps {
  respondingData: RespondingData | AdamRespondingData | BenRespondingData | BlakeRespondingData | JordanRespondingData;
  scenario?: string;
}

const RespondingComponent: React.FC<RespondingComponentProps> = ({ respondingData, scenario }) => {
  // Add debugging to track when this component renders
  console.log("RespondingComponent rendering with data:", respondingData);
  console.log("RespondingComponent rendering with scenario:", scenario);

  const handleTryAgain = () => {
    window.location.reload();
  };

  const renderYesNo = (label: string, value: string) => (
    <ListItem>
      <StrongText>{label}:</StrongText> {value}
    </ListItem>
  );

  const renderStars = (rating: number) => (
    <StarsContainer>
      {[...Array(5)].map((_, i) =>
        i < rating ? <FullStar key={i}>★</FullStar> : <EmptyStar key={i}>☆</EmptyStar>
      )}
    </StarsContainer>
  );

  const renderRubricItem = (label: string, item: { score: number; explanation: string }) => (
    <ListItem>
      <StrongText>{label}:</StrongText> {renderStars(item.score)}
      <div style={{ marginLeft: "16px", fontSize: "0.9rem", marginTop: "4px" }}>
        {item.explanation}
      </div>
    </ListItem>
  );

  // Type guard to check if it's Adam scenario data
  const isAdamData = (data: any): data is AdamRespondingData => {
    return (
      "rubricEvaluation" in data &&
      data.rubricEvaluation !== undefined &&
      "empathyAndEmotionalSensitivity" in data.rubricEvaluation
    );
  };

  // Type guard to check if it's Ben scenario data (scenario 5)
  const isBenData = (data: any): data is BenRespondingData => {
    return (
      "rubricEvaluation" in data &&
      data.rubricEvaluation !== undefined &&
      "feedbackonworkperformance" in data.rubricEvaluation
    );
  };

  // Type guard to check if it's Blake scenario data (scenario 6)
  const isBlakeData = (data: any): data is BlakeRespondingData => {
    return (
      "rubricEvaluation" in data &&
      data.rubricEvaluation !== undefined &&
      "abilitytoaskandanswerquestionsprofessionally" in data.rubricEvaluation
    );
  };

  // Type guard to check if it's Jordan scenario data (scenario 7)
  const isJordanData = (data: any): data is JordanRespondingData => {
    return (
      "rubricEvaluation" in data &&
      data.rubricEvaluation !== undefined &&
      "empathyandactivelistening" in data.rubricEvaluation
    );
  };

  // Type guard to check if it's regular scenario data
  const isRegularData = (data: any): data is RespondingData => {
    return (
      "facialExpressions" in data &&
      "soundToneOfVoice" in data &&
      "textChoiceOfWords" in data &&
      data.facialExpressions !== undefined &&
      data.soundToneOfVoice !== undefined &&
      data.textChoiceOfWords !== undefined
    );
  };

  // Add error handling for malformed data
  if (
    !isAdamData(respondingData) &&
    !isBenData(respondingData) &&
    !isBlakeData(respondingData) &&
    !isJordanData(respondingData) &&
    !isRegularData(respondingData)
  ) {
    console.error("Invalid respondingData structure:", respondingData);
    return (
      <Container>
        <Title>Error: Invalid Data Structure</Title>
        <Section>
          <FeedbackText>
            The response data is not in the expected format. Please try again.
          </FeedbackText>
          <pre
            style={{ fontSize: "12px", background: "#f5f5f5", padding: "10px", overflow: "auto" }}
          >
            {JSON.stringify(respondingData, null, 2)}
          </pre>
        </Section>
        <TryAgainButton onClick={handleTryAgain}>Try Again</TryAgainButton>
      </Container>
    );
  }

  if (isAdamData(respondingData)) {
    // Render Adam scenario (scenario 4) layout
    return (
      <Container>
        <Title>Here is how you did</Title>

        {/* Rubric Evaluation */}
        <Section>
          <SectionTitle>Evaluation Rubric</SectionTitle>
          <List>
            {renderRubricItem(
              "Empathy and Emotional Sensitivity",
              respondingData.rubricEvaluation.empathyAndEmotionalSensitivity
            )}
            {renderRubricItem("Active Listening", respondingData.rubricEvaluation.activeListening)}
            {renderRubricItem(
              "Creating Psychological Safety",
              respondingData.rubricEvaluation.creatingPsychologicalSafety
            )}
            {renderRubricItem(
              "Handling Disclosure",
              respondingData.rubricEvaluation.handlingDisclosure
            )}
            {renderRubricItem(
              "Encouraging Next Steps",
              respondingData.rubricEvaluation.encouragingNextSteps
            )}
          </List>
        </Section>

        {/* Total Score */}
        <Section>
          <StrongText>Total Score:</StrongText> {respondingData.totalScore}/25 (
          {respondingData.scoreInterpretation})
        </Section>

        {/* Suggestions */}
        <Section>
          <FeedbackText>
            <StrongText>Suggestions for Improvement:</StrongText>{" "}
            {respondingData.suggestionsForImprovement}
          </FeedbackText>
        </Section>

        {/* Try Again Button */}
        <TryAgainButton onClick={handleTryAgain}>Try Again</TryAgainButton>
      </Container>
    );
  }

  if (isBenData(respondingData)) {
    // Render Ben scenario (scenario 5) layout
    return (
      <Container>
        <Title>Here is how you did</Title>

        {/* Rubric Evaluation */}
        <Section>
          <SectionTitle>Evaluation Rubric</SectionTitle>
          <List>
            {renderRubricItem(
              "Feedback on Work Performance",
              respondingData.rubricEvaluation.feedbackonworkperformance
            )}
            {renderRubricItem(
              "Problem Solving and Action Planning",
              respondingData.rubricEvaluation.problemsolvingandactionplanning
            )}
            {renderRubricItem(
              "Empathy and Accountability",
              respondingData.rubricEvaluation.empathyandaccountability
            )}
            {renderRubricItem("Career Guidance", respondingData.rubricEvaluation.careerguidance)}
            {renderRubricItem(
              "Emotional Sensitivity and Conversation Management",
              respondingData.rubricEvaluation.emotionalsensitivityandconversationmanagement
            )}
            {renderRubricItem(
              "Listening and Verbal Communication",
              respondingData.rubricEvaluation.listeningandverbalcommunication
            )}
            {renderRubricItem(
              "Facial Expressions",
              respondingData.rubricEvaluation.facialexpressions
            )}
            {renderRubricItem("Tone of Voice", respondingData.rubricEvaluation.toneofvoice)}
            {renderRubricItem(
              "Body Language and Posture",
              respondingData.rubricEvaluation.bodylanguageandposture
            )}
            {renderRubricItem(
              "Responsiveness to Emotional Cues",
              respondingData.rubricEvaluation.responsivenesstoemotionalcues
            )}
          </List>
        </Section>

        {/* Total Score */}
        <Section>
          <StrongText>Total Score:</StrongText> {respondingData.totalScore}/50 (
          {respondingData.scoreInterpretation})
        </Section>

        {/* Suggestions */}
        <Section>
          <FeedbackText>
            <StrongText>Suggestions for Improvement:</StrongText>{" "}
            {respondingData.suggestionsForImprovement}
          </FeedbackText>
        </Section>

        {/* Try Again Button */}
        <TryAgainButton onClick={handleTryAgain}>Try Again</TryAgainButton>
      </Container>
    );
  }

  if (isBlakeData(respondingData)) {
    // Render Blake scenario (scenario 6) layout
    return (
      <Container>
        <Title>Here is how you did</Title>

        {/* Rubric Evaluation */}
        <Section>
          <SectionTitle>Evaluation Rubric</SectionTitle>
          <List>
            {renderRubricItem(
              "Clarity of Communication",
              respondingData.rubricEvaluation.clarityofcommunication
            )}
            {renderRubricItem(
              "Confidence and Professionalism",
              respondingData.rubricEvaluation.confidenceandprofessionalism
            )}
            {renderRubricItem(
              "Relevance of Responses",
              respondingData.rubricEvaluation.relevanceofresponses
            )}
            {renderRubricItem(
              "Demonstration of Required Traits",
              respondingData.rubricEvaluation.demonstrationofrequiredtraits
            )}
            {renderRubricItem(
              "Ability to Ask and Answer Questions Professionally",
              respondingData.rubricEvaluation.abilitytoaskandanswerquestionsprofessionally
            )}
          </List>
        </Section>

        {/* Total Score */}
        <Section>
          <StrongText>Total Score:</StrongText> {respondingData.totalScore}/25 (
          {respondingData.scoreInterpretation})
        </Section>

        {/* Suggestions */}
        <Section>
          <FeedbackText>
            <StrongText>Suggestions for Improvement:</StrongText>{" "}
            {respondingData.suggestionsForImprovement}
          </FeedbackText>
        </Section>

        {/* Try Again Button */}
        <TryAgainButton onClick={handleTryAgain}>Try Again</TryAgainButton>
      </Container>
    );
  }

  if (isJordanData(respondingData)) {
    // Render Jordan scenario (scenario 7) layout
    return (
      <Container>
        <Title>Here is how you did</Title>

        {/* Rubric Evaluation */}
        <Section>
          <SectionTitle>Evaluation Rubric</SectionTitle>
          <List>
            {renderRubricItem(
              "Empathy and Active Listening",
              respondingData.rubricEvaluation.empathyandactivelistening
            )}
            {renderRubricItem(
              "Composure Under Pressure",
              respondingData.rubricEvaluation.composureunderpressure
            )}
            {renderRubricItem(
              "Clarity of Communication",
              respondingData.rubricEvaluation.clarityofcommunication
            )}
            {renderRubricItem(
              "Taking Ownership and Problem Solving",
              respondingData.rubricEvaluation.takingownershipandproblemsolving
            )}
            {renderRubricItem(
              "Professionalism and Tone",
              respondingData.rubricEvaluation.professionalismandtone
            )}
          </List>
        </Section>

        {/* Total Score */}
        <Section>
          <StrongText>Total Score:</StrongText> {respondingData.totalScore}/25 (
          {respondingData.scoreInterpretation})
        </Section>

        {/* Suggestions */}
        <Section>
          <FeedbackText>
            <StrongText>Suggestions for Improvement:</StrongText>{" "}
            {respondingData.suggestionsForImprovement}
          </FeedbackText>
        </Section>

        {/* Try Again Button */}
        <TryAgainButton onClick={handleTryAgain}>Try Again</TryAgainButton>
      </Container>
    );
  }

  // Render regular scenario (1, 2, 3) layout
  return (
    <Container>
      <Title>Here is how you did</Title>

      {/* Facial Expressions */}
      <Section>
        <SectionTitle>Facial Expressions</SectionTitle>
        <List>
          {renderYesNo(
            "Calm and Approachable Expression",
            respondingData.facialExpressions.calmAndApproachableExpression
          )}
          {renderYesNo("Engaged Listening", respondingData.facialExpressions.engagedListening)}
          {renderYesNo(
            "No Signs of Frustration or Annoyance",
            respondingData.facialExpressions.noSignsOfFrustrationOrAnnoyance
          )}
          {renderYesNo("Supportive Gestures", respondingData.facialExpressions.supportiveGestures)}
          {renderYesNo(
            "Open and Relaxed Facial Features",
            respondingData.facialExpressions.openAndRelaxedFacialFeatures
          )}
        </List>
      </Section>

      {/* Sound Tone of Voice */}
      <Section>
        <SectionTitle>Sound Tone of Voice</SectionTitle>
        <List>
          {renderYesNo("Calm and Steady Tone", respondingData.soundToneOfVoice.calmAndSteadyTone)}
          {renderYesNo("Empathetic Tone", respondingData.soundToneOfVoice.empatheticTone)}
          {renderYesNo("Clear Articulation", respondingData.soundToneOfVoice.clearArticulation)}
          {renderYesNo("Non-Defensive Tone", respondingData.soundToneOfVoice.nonDefensiveTone)}
          {renderYesNo("Appropriate Volume", respondingData.soundToneOfVoice.appropriateVolume)}
        </List>
      </Section>

      {/* Text Choice of Words */}
      <Section>
        <SectionTitle>Choice of Words</SectionTitle>
        <List>
          {renderYesNo(
            "Acknowledgment of the Issue",
            respondingData.textChoiceOfWords.acknowledgmentOfTheIssue
          )}
          {renderYesNo(
            "Use of Polite Language",
            respondingData.textChoiceOfWords.useOfPoliteLanguage
          )}
          {renderYesNo(
            "Solution-Oriented Words",
            respondingData.textChoiceOfWords.solutionOrientedWords
          )}
          {renderYesNo(
            "Apologetic and Responsible Language",
            respondingData.textChoiceOfWords.apologeticAndResponsibleLanguage
          )}
          {renderYesNo(
            "Avoidance of Blaming Language",
            respondingData.textChoiceOfWords.avoidanceOfBlamingLanguage
          )}
        </List>
      </Section>

      {/* Overall Score */}
      <Section>
        <StrongText>Overall Score:</StrongText> {renderStars(respondingData.overallScore)}
      </Section>

      {/* Feedback */}
      <Section>
        <FeedbackText>
          <StrongText>You did well at:</StrongText>{" "}
          {respondingData.feedback.positiveAreas
            .replaceAll("staff", "you")
            .replaceAll("Staff", "You")}
        </FeedbackText>
        <FeedbackText>
          <StrongText>You can improve by focusing on:</StrongText>{" "}
          {respondingData.feedback.improvementSuggestions
            .replaceAll("staff", "you")
            .replaceAll("Staff", "You")}
        </FeedbackText>
      </Section>

      {/* Try Again Button */}
      <TryAgainButton onClick={handleTryAgain}>Try Again</TryAgainButton>
    </Container>
  );
};

export default RespondingComponent;
