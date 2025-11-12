import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ClassCard from "@/components/ClassCard";
import TestimonialCard from "@/components/TestimonialCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Heart, Users, TrendingUp } from "lucide-react";

import hathaImage from "@/assets/hatha-yoga.jpg";
import vinyasaImage from "@/assets/vinyasa-yoga.jpg";
import powerImage from "@/assets/power-yoga.jpg";

const Index = () => {
  const featuredClasses = [
    {
      title: "Hatha Yoga",
      description: "Gentle practice focusing on basic poses and breathing techniques",
      duration: "60 min",
      difficulty: "Beginner" as const,
      image: hathaImage,
      students: 234,
    },
    {
      title: "Vinyasa Flow",
      description: "Dynamic sequences linking breath with movement",
      duration: "75 min",
      difficulty: "Intermediate" as const,
      image: vinyasaImage,
      students: 189,
    },
    {
      title: "Power Yoga",
      description: "Intense workout combining strength, flexibility, and cardio",
      duration: "90 min",
      difficulty: "Advanced" as const,
      image: powerImage,
      students: 156,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Yoga Enthusiast",
      content: "Serenity Yoga transformed my life. The instructors are knowledgeable and the community is so supportive.",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Premium Member",
      content: "Best investment I've made in my wellness journey. The live sessions are incredible!",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Beginner Yogi",
      content: "As a complete beginner, I felt welcomed and guided every step of the way.",
      rating: 5,
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Holistic Wellness",
      description: "Improve physical and mental health through mindful practice",
    },
    {
      icon: Users,
      title: "Community",
      description: "Join a supportive community of like-minded individuals",
    },
    {
      icon: Award,
      title: "Expert Guidance",
      description: "Learn from certified instructors with years of experience",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your journey with personalized analytics",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Featured Classes */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Featured Classes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our most popular yoga sessions designed for all skill levels
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredClasses.map((classItem, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <ClassCard {...classItem} />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/classes">
              <Button size="lg" variant="outline">
                View All Classes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">Why Choose Serenity Yoga?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience transformative benefits that go beyond the mat
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-lg bg-card hover:shadow-[var(--shadow-hover)] transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied students on their wellness journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Begin Your Transformation Today
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90">
              Join our community and start your journey towards a healthier, more balanced life.
              First 7 days are completely free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  View Pricing Plans
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
