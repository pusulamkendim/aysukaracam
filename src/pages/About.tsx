import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Award, Heart, Users, Star } from "lucide-react";
import instructorImage from "@/assets/instructor.jpg";

const About = () => {
  const certifications = [
    "200-Hour RYT Certified",
    "Advanced Vinyasa Specialist",
    "Meditation & Mindfulness Coach",
    "Prenatal Yoga Certified",
  ];

  const achievements = [
    { icon: Users, label: "500+ Students", value: "Taught" },
    { icon: Award, label: "10+ Years", value: "Experience" },
    { icon: Heart, label: "10,000+ Hours", value: "Practice" },
    { icon: Star, label: "4.9/5", value: "Rating" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Meet Your Instructor</h1>
            <p className="text-xl text-muted-foreground">
              Dedicated to guiding you on your journey to wellness, balance, and inner peace
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <img
                src={instructorImage}
                alt="Yoga instructor profile"
                className="rounded-2xl shadow-[var(--shadow-soft)] w-full max-w-md mx-auto"
              />
            </div>
            <div className="space-y-6 animate-slide-up">
              <h2 className="text-4xl font-bold">About Maya Patel</h2>
              <p className="text-lg text-foreground/80">
                With over a decade of dedicated practice and teaching, I've had the privilege of 
                guiding thousands of students on their yoga journey. My approach blends traditional 
                wisdom with modern wellness science to create a transformative experience.
              </p>
              <p className="text-lg text-foreground/80">
                I believe yoga is more than just physical poses—it's a holistic practice that 
                nurtures the mind, body, and spirit. Whether you're a complete beginner or an 
                experienced practitioner, my classes are designed to meet you where you are.
              </p>
              <div className="pt-4">
                <h3 className="text-2xl font-semibold mb-4">Certifications</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {certifications.map((cert, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={index} 
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="mx-auto mb-3" size={40} />
                  <div className="text-3xl font-bold mb-1">{achievement.value}</div>
                  <div className="text-primary-foreground/80">{achievement.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
              My Teaching Philosophy
            </h2>
            <div className="space-y-8">
              <div className="p-8 rounded-xl bg-muted/30 animate-slide-up">
                <h3 className="text-2xl font-semibold mb-4">Mindful Movement</h3>
                <p className="text-foreground/80">
                  Every practice is an opportunity to connect with yourself. I emphasize 
                  mindful movement that honors your body's unique capabilities and limitations.
                </p>
              </div>
              <div className="p-8 rounded-xl bg-muted/30 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-2xl font-semibold mb-4">Breath as Foundation</h3>
                <p className="text-foreground/80">
                  The breath is the bridge between body and mind. Through pranayama and 
                  conscious breathing, we unlock deeper levels of awareness and peace.
                </p>
              </div>
              <div className="p-8 rounded-xl bg-muted/30 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="text-2xl font-semibold mb-4">Community & Support</h3>
                <p className="text-foreground/80">
                  Yoga is a journey best shared. I cultivate a warm, inclusive environment 
                  where everyone feels welcome, supported, and empowered to grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
