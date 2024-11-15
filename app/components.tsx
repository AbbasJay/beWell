import { View, Text } from "react-native";
import styled from "styled-components/native";
import Button from "./ui/button/button";

export default function Components() {
  return (
    <Container>
      <Section>
        <SectionTitle>Buttons</SectionTitle>
        <SectionContent>
          <Button title="Button" onPress={() => {}} />
        </SectionContent>
      </Section>
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  padding: 20px;
`;

const Section = styled(View)`
  margin-bottom: 20px;
`; 


const SectionTitle = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: uppercase;
  width: 100%;
  border-bottom-width: 4px;
  border-bottom-color: #000;
`;


const SectionContent = styled(View)``;

