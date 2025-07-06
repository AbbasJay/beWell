import { Class } from "@/app/contexts/ClassesContext";
import BeWellIcons from "@/assets/icons/icons";
import * as CSS from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import {
  formattedStartDate,
  formatDuration,
} from "@/app/utils/helper-functions/format-time-and-dates";
import { useState } from "react";
import { ErrorMessage } from "@/app/ui/error-message";
import { TouchableOpacity, Image } from "react-native";

interface ClassesCardProps {
  item: Class;
  isFull?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  imageIndex?: number;
}

export const ClassesCard = ({
  item,
  isFull = false,
  onPress,
  disabled = false,
  imageIndex = 0,
}: ClassesCardProps) => {
  const [error, setError] = useState<Error | null>(null);

  if (!item) {
    return null; // Don't render anything if item is missing
  }

  // Placeholder images array
  const placeholderImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCDFGoARibO-t6Rb3Wv_okWMXOjwxMgF8Z7DxGVEULa8jVAiir_iDP8ovlS7AwDyvxj0u_xUvgSjlaQLRVsfUFU6MKiyW-xmkdsBFs3drmtHcgD74BirF-NLhsusmgdP39wSQvqS-6X2UI5eqp2PU3sp6CMbjFEnbqkRBnffF-Fdfvnn084AXJseMbCQBUkxCmZZ0Cbm-RxJ5bYXZivF3g16wev59ont29Ox233v_Q1dQCUazBAmYQ0x1AlNiTXtDAb5UZLiRSoSosC",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDEOfDsBo681ffuj5VfPH7hLFyDrJ0ptKZRfe6a7M9K1I9t46V3xkpbazJDGTA3H2zYsxfcVH-mleGFCt8cUurI6ttOi2eqRnBxqVkBvcOPY9iiGun4upBB6fAQ4R5xAaoaKtn1lzypMklUmGdhgFwRIcb1fHCdDg_efL9kAg8k6DMV-ZmivNEHeAz3zpMhn6720he5h6Iz_XFpBfc0pQFjAkgJ9MZcsxvAXtWPTC7wYI3KJ1xzJuaK-0-0vWjeh7xHGaUdPOkq_SZS",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCC3n4-SpFSOEYPSXqbWq4aoGPb_Tu03U_jtV94cV_NIvpo_0d-l1MhAbIvti-RA6MvQY2-WTLspj76_WLnVtPtj_TTMzWl7EArmJsM_jWmc6BpOzuEwg1UvSQ6Zk_VDAPU2riGE-j6ktlcd1zGWToOFASN1c-41wzCmESD6UbR8gy4tCQTkLv08EBjsFoVbq91j0AOLX7Y00D3iZsJopbYmzGvKbP0qJAENVbkV8VsNa0L5o_a9RShOHStVEpW2Rqd5NFlxlM8T7BX",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCkMy8HOYbApTugS5HO0vGj5M7zekrFWqt9bjqdMdA0Lopk7Q_5Mfd81KLsC-hMzPA0S3XPjcDitK3SyKWDjIxdR-aRG6hYpuvRzYneoGVLjIXpP65Ox0EUlB1h_XVIdH--QYZibcJ-rCEK8yXQG3iU0fmEKzSR41I0KuVzdvHXW6ULyvVLrcpSlb_IjaqBQqmCuBnYHqWU33BgGRLTkIfHy81TF4gSlgUIwVM5_JhGGICkduUVKSLv85rsQ88M_lGaHbOgTYsz8j3c",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCmLwsFGpD8VpubDO5e0nc-wrwXxHpoFzngc9fVGOs41sNQ3U8KskZHlS8MAMUEWs676jIfzjL7v_K4HpsHYg_e_2GYqluvci_b516YRt6yU0cL2m96ouvjCSoEWAHAhSzbpdC7OIbzBH5PGammvaxAWraGyo6mdxA51CeXgZD27dkOlUbY9cdH34gyqmAoRrVdKFIdipdGHbX2jFPybYYUTFfrK644QHMg4cnqBp99x5nx4AYkzI-PoODxz5F5A0OjiYi_Lg4aCXh1",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBg3xahnCxR08kBK5Q5_69PRMpVw9DsiJkkGQBTaNvODyiPY-4kogfE5uA-gS8wTwFsD2LXii0Z2xjwRCKBy1HF_9nVQV8Z1pWvmcxmLx7D5TvXZ-ruyF5uoQBX_mHXddVqb7o3tLbOdWafHJwAitxG3tD4kh4vdfQYZu4Orl04Ad3_99D9gdIxMvqGWqLIniUSynQBAk9EVe8eoycvmE4NakscaDmJQb-_SLpNgyyNStnUuX7gXxQTmkbSNAb4qhAbPLpzGOR9cpHu",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDpgmFkcHANmDsutmmg-rhCxpTEnw9tDtJcmd7AgT-P6tDPyXJDrNloHsMT5WsGwIbZJWSZhU8mMn1QrLDH2Fmkptr_P20-rvuIWUQ1pKEjEGdblM5hg8Y9pbUe0aUvaz7sJxPhYLNRV-0vDPeGJgJrUl2VeHoN6gZu3N0wFMwHVOa2oygr9CQ4d19JwAKACqbxuKWCb_ZaodQNY8GA-3DcsCUwpB9_6qJ3KfreRf41zORJh0gNL-f8IvwaYW-wlj6cxh7yafz48rdQ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCa-c60blal0Sl6KA5adOBCmAoRapUjT4UFInz6y4f6Kqb_4iMzUQk6l3oXbWETafpA_ox-D1tiL1BDBhGgRRhK2rxlth5cp2dnOA7D5kVDoc-JIs1vBAw6gVHPdKXz2QdEpKy6MHrpUsOp6Nxcm84mVvvJbFQSdVl8jdXHdYuqr9dPpgUbcnHPwpcCHzKs8fE4a6UjMYRfp44BT5vkor0j45AeqadukMapw7lIaE7JPBbKN4NT4fkiPktzjNzSPzVt7nvqG2LPFn14",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDY93WscHRz0qm9NVcWh5Ek7d3EWQkEV6at5slPlHR0U-1OXSMbABRbpkinKLvlfDjSC3MDbVTP5Km_yrJvbn3LcQlhwKlmdGqKd4aUvQcHpQEj6YLtFixVdZJgv3tIy-qqEtqLOk8VAZnas54DUWWWDIEwA4X3CJcsSzHQMYzVFBKSeb2xRbtEdRZRqil90OfYus4zc1aW3gsoREC_-ey_933-VG49ZB3eTNUezulP3ZeGcFhgvfoQ2y_HeRRhfk4NiMsBd4G9tivS",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD7mHCUsC8Ufu4y0dnODe94Twpe1a2CLKCfrxGwikAWYzAQIFunTUaPI1kXmvt_QcgJVJL9f5ysXwt5dDgdIvO_W4Vuk6YQruKl26MD9QTfkcwnJF7-T7zEOClxMcNsxmWZyZny__DduQbtb-qZY1tNQgMh27AlqlrkVC9zAxgvyEr52YaHJrgZsEiHXvrUSnVFiLunm_6NQlTIv_jO2CD81Ld22HsdrWUgohJdezmvB14mp9ssOEnF6eUoncJS-LbUln7JY03h4LmG",
  ];

  return (
    <CSS.Container key={item.id}>
      {error && <ErrorMessage error={error} />}
      <CSS.Card
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled || isFull}
      >
        <CSS.CardImageContainer>
          <CSS.CardImage
            source={{
              uri: placeholderImages[imageIndex % placeholderImages.length],
            }}
            resizeMode="cover"
            fadeDuration={0}
          />
        </CSS.CardImageContainer>
        <CSS.CardInfo>
          <CSS.CardTitle numberOfLines={1}>{item.name}</CSS.CardTitle>
          <CSS.CardSubtitle numberOfLines={2}>
            {new Date(item.startDate).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            · {formatDuration(item.duration)} · with {item.instructor || "-"}
          </CSS.CardSubtitle>
        </CSS.CardInfo>
      </CSS.Card>
    </CSS.Container>
  );
};
