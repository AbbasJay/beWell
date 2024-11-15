
import styled from "styled-components/native";
import MapView from "react-native-maps";

export const Container = styled.View<{ colours: { background: string } }>`
  flex: 1;
  background-color: ${(props) => props.colours.background};
`;

export const Map = styled(MapView)`
  width: '100%';
  height: '100%';
`;
