import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  glass?: boolean;
}

const TestimonialCard = ({ name, role, content, rating, image, glass }: TestimonialCardProps) => {
  return (
    <Card className={`h-full transition-all duration-300 ${
      glass
        ? "bg-white/5 backdrop-blur-[4px] md:bg-white/10 md:backdrop-blur-md border-white/20"
        : "hover:shadow-[var(--shadow-hover)]"
    }`}>
      <CardContent className="pt-6 space-y-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? "fill-secondary text-secondary" : glass ? "text-white/30" : "text-muted"}
            />
          ))}
        </div>
        <p className={`text-lg italic ${glass ? "text-white/90" : "text-foreground/80"}`}>"{content}"</p>
        <div className="flex items-center gap-3 pt-2">
          {image && (
            <img
              src={image}
              alt={name}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <p className={`font-semibold text-lg ${glass ? "text-white" : ""}`}>{name}</p>
            <p className={`text-xs ${glass ? "text-white/60" : "text-muted-foreground"}`}>{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
