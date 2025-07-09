import { useEffect, useState } from "react";
import { Review } from "../components-data/class-reviews-data";

export function useClassReviews(classId: number) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState<
    { rating: number; percentage: number }[]
  >([]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mock: Review[] = [
        {
          id: "1",
          userId: "u1",
          userName: "Sophia Clark",
          userAvatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCKh-5ins07UK0OIshGMe_Stl3XImoAWiPBbbzxTco03NJmG18qBU9nxBqkrk9Sh2ut73VkgFlY4py0VIP_zj407WEl1iLFv7PI9HMk_3SY2mHajNpKBKNrh2jg1gM-3up8gZMGmPpk6mLApiBT9GLgGDdl7wr0t6gU4gAFIuozFfhW6SpHfOfZ2-t_02VFPqrN5lwOx5DgnqLg2DC8dA5nHZlY26f7IWJYtpJHRiH8K8WSlEflf-eVqcjp3UCaEJA_vvF5iLP6ZS2t",
          rating: 5,
          comment: "sup dawg",
          createdAt: "4 weeks ago",
          updatedAt: "4 weeks ago",
          likedCount: 15,
          dislikedCount: 2,
        },
        {
          id: "2",
          userId: "u2",
          userName: "Ethan Bennett",
          userAvatar:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCEElp7WF4K4mFEQ4nGJLIOb3oBlGWAfQ8cXsgx1tagE-UK0JyXaW1wVYQ29g4hA3dcIkDXiHtgH1TEkb5K2uUnT2m7pIXPJd27HMEeL9BNqGgT41IL6J9Iy4QvY-TQgBuRe0cT49cnlGxvPEik3lvNaBZ3NQFWkwcdkd9sYRAFZMH34BH8FAuWqLoiE2hfiP5O8LCqgJ6Mk9rVDPK2ERLkLaXNBLI0-n6YwNr7zQrNixl0KFHGIGlQ5OF4GcjxTMHQsPYAcyjHjGzR",
          rating: 4,
          comment:
            "Great class, but the studio was a bit crowded. The instructor was excellent and the flow was challenging but rewarding.",
          createdAt: "1 month ago",
          updatedAt: "1 month ago",
          likedCount: 8,
          dislikedCount: 1,
        },
      ];
      setReviews(mock);
      setTotalReviews(mock.length);
      const avg = mock.reduce((sum, r) => sum + r.rating, 0) / mock.length;
      setAverageRating(Number(avg.toFixed(1)));
      const dist = [5, 4, 3, 2, 1].map((star) => {
        const count = mock.filter((r) => r.rating === star).length;
        return {
          rating: star,
          percentage: Math.round((count / mock.length) * 100),
        };
      });
      setRatingDistribution(dist);
      setLoading(false);
    }, 500);
  }, [classId]);

  return { reviews, averageRating, totalReviews, ratingDistribution, loading };
}
