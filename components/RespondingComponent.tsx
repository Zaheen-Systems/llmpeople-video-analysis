import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: #22409a;
  color: white;
  padding: 24px;
  border-radius: 44px;
  margin: 0 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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

interface RespondingComponentProps {
  respondingData: RespondingData;
}

const RespondingComponent: React.FC<RespondingComponentProps> = ({ respondingData }) => {
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

  return (
    <Container>
      <Title>Responding</Title>

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
          <StrongText>You did well at:</StrongText> {respondingData.feedback.positiveAreas}
        </FeedbackText>
        <FeedbackText>
          <StrongText>You can improve by focusing on:</StrongText>{" "}
          {respondingData.feedback.improvementSuggestions}
        </FeedbackText>
      </Section>
    </Container>
  );
};

export default RespondingComponent;
