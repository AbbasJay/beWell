import { styled } from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

export const ScrollView = styled.ScrollView`
  flex: 1;
`;

export const ImageContainer = styled.View`
  padding-horizontal: 0px;
  padding-vertical: 0px;
`;

export const HeroImage = styled.Image`
  width: 100%;
  height: 218px;
  border-radius: 0px;
`;

export const Content = styled.View`
  padding-horizontal: 16px;
`;

export const ClassTitle = styled.Text`
  color: #111714;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: -0.3px;
  padding-bottom: 12px;
  padding-top: 20px;
`;

export const ClassDescription = styled.Text`
  color: #111714;
  font-size: 16px;
  line-height: 24px;
  padding-bottom: 12px;
  padding-top: 4px;
`;

export const SectionTitle = styled.Text`
  color: #111714;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: -0.3px;
  padding-bottom: 8px;
  padding-top: 16px;
`;

export const ClassDetails = styled.View`
  gap: 16px;
  padding-vertical: 16px;
`;

export const DetailItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const DetailIcon = styled.View`
  width: 48px;
  height: 48px;
  background-color: #f0f4f2;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

export const DetailInfo = styled.View`
  flex: 1;
`;

export const DetailLabel = styled.Text`
  color: #111714;
  font-size: 16px;
  font-weight: 500;
`;

export const DetailValue = styled.Text`
  color: #648772;
  font-size: 14px;
`;

export const ReviewsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 32px;
  padding-vertical: 16px;
`;

export const RatingSummary = styled.View`
  align-items: center;
`;

export const RatingNumber = styled.Text`
  color: #111714;
  font-size: 36px;
  font-weight: 900;
  letter-spacing: -0.3px;
`;

export const StarsContainer = styled.View`
  flex-direction: row;
  gap: 2px;
  margin-vertical: 8px;
`;

export const ReviewCount = styled.Text`
  color: #111714;
  font-size: 16px;
`;

export const RatingDistribution = styled.View`
  flex: 1;
  min-width: 200px;
  max-width: 400px;
`;

export const RatingRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const RatingLabel = styled.Text`
  color: #111714;
  font-size: 14px;
  width: 20px;
`;

export const ProgressBar = styled.View`
  flex: 1;
  height: 8px;
  background-color: #dce5df;
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.View<{ percentage: number }>`
  height: 100%;
  background-color: #111714;
  border-radius: 4px;
  width: ${({ percentage }) => percentage}%;
`;

export const Percentage = styled.Text`
  color: #648772;
  font-size: 14px;
  width: 40px;
  text-align: right;
`;

export const ReviewsList = styled.View`
  gap: 16px;
  padding-vertical: 12px;
`;

export const ReviewItem = styled.View`
  gap: 10px;
  background-color: #fff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #e6ece9;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.04;
  shadow-radius: 4px;
  elevation: 1;
`;

export const ReviewHeader = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const AuthorImage = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;

export const AuthorInfo = styled.View`
  flex: 1;
`;

export const AuthorName = styled.Text`
  color: #111714;
  font-size: 16px;
  font-weight: 500;
`;

export const ReviewDate = styled.Text`
  color: #648772;
  font-size: 14px;
`;

export const ReviewStars = styled.View`
  flex-direction: row;
  gap: 2px;
`;

export const ReviewText = styled.Text`
  color: #111714;
  font-size: 16px;
  line-height: 24px;
`;

export const ReviewActions = styled.View`
  flex-direction: row;
  gap: 36px;
`;

export const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const ActionText = styled.Text`
  color: #648772;
  font-size: 16px;
`;

export const ScheduleItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 16px;
  min-height: 72px;
  padding-vertical: 8px;
`;

export const ScheduleIcon = styled.View`
  width: 48px;
  height: 48px;
  background-color: #f0f4f2;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

export const ScheduleInfo = styled.View`
  flex: 1;
`;

export const ScheduleDay = styled.Text`
  color: #111714;
  font-size: 16px;
  font-weight: 500;
`;

export const ScheduleTime = styled.Text`
  color: #648772;
  font-size: 14px;
`;

export const BookButtonContainer = styled.View`
  padding-horizontal: 16px;
  padding-vertical: 12px;
  background-color: #fff;
  border-top-width: 1px;
  border-top-color: #f0f4f2;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const BookButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: #38e07b;
  border-radius: 12px;
  height: 48px;
  justify-content: center;
  align-items: center;
  min-width: 84px;
  max-width: 480px;
  flex: 1;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

export const BookButtonText = styled.Text`
  color: #111714;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.3px;
`;
