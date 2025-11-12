import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

const TestimonialCard = ({ name, role, content, rating, image }: TestimonialCardProps) => {
  return (
    <Card className="h-full hover:shadow-[var(--shadow-hover)] transition-all duration-300">
      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? "fill-secondary text-secondary" : "text-muted"}
            />
          ))}
        </div>
        <p className="text-sm text-foreground/80 italic">"{content}"</p>
        <div className="flex items-center gap-3 pt-2">
          {image && (
            <img
              src={image}
              alt={name}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <p className="font-semibold text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
