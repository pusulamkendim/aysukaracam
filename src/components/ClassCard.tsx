import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

interface ClassCardProps {
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  students?: number;
}

const ClassCard = ({ title, description, duration, difficulty, image, students }: ClassCardProps) => {
  const difficultyColors = {
    Beginner: "bg-secondary/20 text-secondary-foreground",
    Intermediate: "bg-accent/20 text-accent-foreground",
    Advanced: "bg-primary/20 text-primary-foreground",
  };

  return (
    <Card className="group overflow-hidden hover:shadow-[var(--shadow-hover)] transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={`${title} yoga class`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className={`absolute top-4 right-4 ${difficultyColors[difficulty]}`}>
          {difficulty}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{duration}</span>
          </div>
          {students && (
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{students} students</span>
            </div>
          )}
        </div>
        <Button className="w-full" variant="default">
          Join Class
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClassCard;
