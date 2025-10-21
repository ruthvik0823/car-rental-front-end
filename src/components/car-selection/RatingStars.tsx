import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: number;
}

export const RatingStars = ({ rating, size = 16 }: RatingStarsProps) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`${i < Math.floor(rating ) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};
