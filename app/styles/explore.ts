import styled from "styled-components/native";

export const OuterContainer = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 0;
`;

export const CardContainer = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    padding: 0,
    alignItems: "center",
  },
}))`
  flex: 1;
  width: 100%;
`;

export const MainCard = styled.View`
  width: 100%;
  max-width: 600px;
  background-color: #fff;
  border-radius: 24px;
  flex: 1;
  min-height: 100%;
`;

export const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  padding: 24px 24px 8px 24px;
  justify-content: space-between;
`;

export const HeaderTitle = styled.Text`
  color: #111714;
  font-size: 24px;
  font-weight: 900;
  flex: 1;
  text-align: center;
  padding-right: 24px;
  flex-shrink: 1;
  flex-wrap: wrap;
`;

export const SearchContainer = styled.View`
  padding: 0 24px 16px 24px;
`;

export const SearchBar = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #e9f0ec;
  border-radius: 12px;
  padding-left: 16px;
  height: 48px;
`;

export const SearchInput = styled.TextInput`
  flex: 1;
  color: #648772;
  font-size: 18px;
  background-color: #e9f0ec;
  border: none;
  padding: 0 16px;
`;

export const FilterRow = styled.ScrollView`
  flex-direction: row;
  gap: 12px;
  padding: 0 24px 0 24px;
  margin-bottom: 8px;
  margin-top: 4px;
`;

export const FilterChip = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: #f0f4f2;
  border-radius: 16px;
  padding: 0 20px 0 10px;
  height: 36px;
  margin-right: 12px;
  active-opacity: 0.7;
`;

export const FilterChipText = styled.Text`
  color: #111714;
  font-size: 16px;
  font-weight: 600;
  margin-left: 8px;
`;

export const SectionTitle = styled.Text`
  color: #111714;
  font-size: 24px;
  font-weight: 900;
  padding: 0 24px 0 24px;
  margin-top: 20px;
  margin-bottom: 12px;
`;

export const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  row-gap: 20px;
  column-gap: 12px;
  padding: 0 24px 24px 24px;
`;

export const GridItem = styled.View`
  width: 47%;
  margin-bottom: 12px;
`;

export const GridImage = styled.Image`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  background-color: #eaeaea;
`;

export const GridTextContainer = styled.View`
  margin-top: 10px;
`;

export const GridTitle = styled.Text`
  color: #111714;
  font-size: 18px;
  font-weight: 700;
`;

export const GridSubtitle = styled.Text`
  color: #648772;
  font-size: 15px;
  font-weight: 400;
  margin-top: 2px;
`;
