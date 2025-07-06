import { Business } from "@/app/contexts/BusinessContext";
import { View } from "react-native";
import { Skeleton } from "react-native-skeletons";
import {
  Card,
  CardImage,
  Info,
  Name,
  Description,
  SkeletonCard,
  SkeletonImage,
} from "./styles";

type BusinessCardProps = {
  item: Business;
  onPress?: () => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  isLoading?: boolean;
  distance?: number;
  imageIndex?: number;
};

export const BusinessCard = ({
  item,
  onPress,
  width = 160,
  height = 160,
  disabled,
  isLoading = false,
  distance,
  imageIndex = 0,
}: BusinessCardProps) => {
  // Placeholder images array for businesses
  const placeholderImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCDFGoARibO-t6Rb3Wv_okWMXOjwxMgF8Z7DxGVEULa8jVAiir_iDP8ovlS7AwDyvxj0u_xUvgSjlaQLRVsfUFU6MKiyW-xmkdsBFs3drmtHcgD74BirF-NLhsusmgdP39wSQvqS-6X2UI5eqp2PU3sp6CMbjFEnbqkRBnffF-Fdfvnn084AXJseMbCQBUkxCmZZ0Cbm-RxJ5bYXZivF3g16wev59ont29Ox233v_Q1dQCUazBAmYQ0x1AlNiTXtDAb5UZLiRSoSosC",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDEOfDsBo681ffuj5VfPH7hLFyDrJ0ptKZRfe6a7M9K1I9t46V3xkpbazJDGTA3H2zYsxfcVH-mleGFCt8cUurI6ttOi2eqRnBxqVkBvcOPY9iiGun4upBB6fAQ4R5xAaoaKtn1lzypMklUmGdhgFwRIcb1fHCdDg_efL9kAg8k6DMV-ZmivNEHeAz3zpMhn6720he5h6Iz_XFpBfc0pQFjAkgJ9MZcsxvAXtWPTC7wYI3KJ1xzJuaK-0-0vWjeh7xHGaUdPOkq_SZS",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCC3n4-SpFSOEYPSXqbWq4aoGPb_Tu03U_jtV94cV_NIvpo_0d-l1MhAbIvti-RA6MvQY2-WTLspj76_WLnVtPtj_TTMzWl7EArmJsM_jWmc6BpOzuEwg1UvSQ6Zk_VDAPU2riGE-j6ktlcd1zGWToOFASN1c-41wzCmESD6UbR8gy4tCQTkLv08EBjsFoVbq91j0AOLX7Y00D3iZsJopbYmzGvKbP0qJAENVbkV8VsNa0L5o_a9RShOHStVEpW2Rqd5NFlxlM8T7BX",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCkMy8HOYbApTugS5HO0vGj5M7zekrFWqt9bjqdMdA0Lopk7Q_5Mfd81KLsC-hMzPA0S3XPjcDitK3SyKWDjIxdR-aRG6hYpuvRzYneoGVLjIXpP65Ox0EUlB1h_XVIdH--QYZibcJ-rCEK8yXQG3iU0fmEKzSR41I0KuVzdvHXW6ULyvVLrcpSlb_IjaqBQqmCuBnYHqWU33BgGRLTkIfHy81TF4gSlgUIwVM5_JhGGICkduUVKSLv85rsQ88M_lGaHbOgTYsz8j3c",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCmLwsFGpD8VpubDO5e0nc-wrwXxHpoFzngc9fVGOs41sNQ3U8KskZHlS8MAMUEWs676jIfzjL7v_K4HpsHYg_e_2GYqluvci_b516YRt6yU0cL2m96ouvjCSoEWAHAhSzbpdC7OIbzBH5PGammvaxAWraGyo6mdxA51CeXgZD27dkOlUbY9cdH34gyqmAoRrVdKFIdipdGHbX2jFPybYYUTFfrK644QHMg4cnqBp99x5nx4AYkzI-PoODxz5F5A0OjiYi_Lg4aCXh1",
  ];

  if (isLoading) {
    return (
      <SkeletonCard width={width}>
        <Skeleton height={height} width={width} style={{ borderRadius: 12 }} />
        <Info>
          <Skeleton height={16} width="60%" style={{ marginBottom: 4 }} />
          <Skeleton height={14} width="80%" />
        </Info>
      </SkeletonCard>
    );
  }

  const imageSource = item.photo
    ? { uri: item.photo }
    : { uri: placeholderImages[imageIndex % placeholderImages.length] };

  return (
    <Card
      width={width}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <CardImage
        source={imageSource}
        width={width}
        height={height}
        resizeMode="cover"
        defaultSource={require("@/assets/images/home-gym.webp")}
      />
      <Info>
        <Name numberOfLines={1}>{item.name}</Name>
        <Description numberOfLines={1}>
          {distance
            ? `${distance.toFixed(1)} km away`
            : item.type || "Fitness Studio"}
        </Description>
      </Info>
    </Card>
  );
};
