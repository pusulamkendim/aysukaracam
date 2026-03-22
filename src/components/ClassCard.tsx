"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ClassCardProps {
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  students?: number;
  price?: string;
  productId?: string;
}

const ClassCard = ({ title, description, duration, difficulty, image, students, price, productId }: ClassCardProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("Sepete eklenemedi");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`${title} sepete eklendi`, {
        action: {
          label: "Ödemeyi Tamamla",
          onClick: () => router.push("/cart"),
        },
        duration: 5000,
      });
    },
    onError: () => {
      toast.error("Sepete eklenirken bir hata oluştu");
    },
  });

  const handleBuy = () => {
    if (!session) {
      router.push("/auth/giris");
      return;
    }
    if (productId) {
      addToCart.mutate();
    }
  };

  const difficultyColors = {
    Beginner: "bg-secondary/80 text-white backdrop-blur-sm",
    Intermediate: "bg-accent/80 text-white backdrop-blur-sm",
    Advanced: "bg-primary/80 text-white backdrop-blur-sm",
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-[var(--shadow-hover)] transition-all duration-300 aspect-[3/4]">
      {image && (
        <Image
          src={image}
          alt={`${title} yoga dersi`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      )}
      <Badge className={`absolute top-4 right-4 z-10 text-xl px-3 py-1 ${difficultyColors[difficulty]}`}>
        {difficulty}
      </Badge>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-white/20" />
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 space-y-3">
        <div>
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
          <p className="text-xl text-white/80 line-clamp-2 mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-4 text-xl text-white/90 pb-2">
          <div className="flex items-center gap-1">
            <Clock size={22} />
            <span className="font-medium">{duration}</span>
          </div>
          {price && (
            <span className="font-semibold text-white">{price}</span>
          )}
          {students && (
            <div className="flex items-center gap-1">
              <Users size={22} />
              <span>{students} öğrenci</span>
            </div>
          )}
        </div>
        <Button
          className="w-full"
          variant="default"
          onClick={handleBuy}
          disabled={addToCart.isPending}
        >
          <ShoppingCart size={16} className="mr-2" />
          {addToCart.isPending ? "Ekleniyor..." : "Sepete Ekle"}
        </Button>
      </div>
    </Card>
  );
};

export default ClassCard;
