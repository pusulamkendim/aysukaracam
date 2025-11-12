import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClassCard from "@/components/ClassCard";

import hathaImage from "@/assets/hatha-yoga.jpg";
import vinyasaImage from "@/assets/vinyasa-yoga.jpg";
import powerImage from "@/assets/power-yoga.jpg";
import meditationImage from "@/assets/meditation.jpg";

const Classes = () => {
  const allClasses = [
    {
      title: "Hatha Yoga",
      description: "Gentle practice focusing on basic poses and breathing techniques. Perfect for beginners or those seeking a slower-paced class.",
      duration: "60 min",
      difficulty: "Beginner" as const,
      image: hathaImage,
      students: 234,
    },
    {
      title: "Vinyasa Flow",
      description: "Dynamic sequences linking breath with movement. Build strength, flexibility, and mindfulness through flowing transitions.",
      duration: "75 min",
      difficulty: "Intermediate" as const,
      image: vinyasaImage,
      students: 189,
    },
    {
      title: "Power Yoga",
      description: "Intense workout combining strength, flexibility, and cardio. Challenge yourself with advanced poses and sequences.",
      duration: "90 min",
      difficulty: "Advanced" as const,
      image: powerImage,
      students: 156,
    },
    {
      title: "Meditation & Mindfulness",
      description: "Cultivate inner peace through guided meditation and breathing exercises. Reduce stress and enhance mental clarity.",
      duration: "45 min",
      difficulty: "Beginner" as const,
      image: meditationImage,
      students: 312,
    },
    {
      title: "Morning Energizer",
      description: "Start your day with energizing flows designed to awaken your body and mind. Perfect morning routine for all levels.",
      duration: "60 min",
      difficulty: "Beginner" as const,
      image: vinyasaImage,
      students: 267,
    },
    {
      title: "Restorative Yoga",
      description: "Gentle, relaxing practice using props to support the body. Ideal for recovery, stress relief, and deep relaxation.",
      duration: "75 min",
      difficulty: "Beginner" as const,
      image: hathaImage,
      students: 198,
    },
    {
      title: "Core & Balance",
      description: "Focus on building core strength and improving balance. Enhance stability and develop a strong foundation.",
      duration: "60 min",
      difficulty: "Intermediate" as const,
      image: powerImage,
      students: 145,
    },
    {
      title: "Flexibility Flow",
      description: "Dedicated practice for improving flexibility and range of motion. Deepen your stretches safely and effectively.",
      duration: "60 min",
      difficulty: "Intermediate" as const,
      image: vinyasaImage,
      students: 176,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Classes</h1>
            <p className="text-xl text-muted-foreground">
              Discover the perfect class for your journey. From gentle beginnings to advanced practices, 
              we offer sessions designed for every level and goal.
            </p>
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {allClasses.map((classItem, index) => (
              <div 
                key={index} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <ClassCard {...classItem} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Live & Recorded Sessions</h2>
            <p className="text-lg text-primary-foreground/90 mb-8">
              Premium members get access to live interactive sessions plus our entire library 
              of recorded classes. Practice anytime, anywhere, at your own pace.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="animate-fade-in">
                <div className="text-4xl font-bold mb-2">50+</div>
                <div className="text-primary-foreground/80">Live Classes Monthly</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="text-4xl font-bold mb-2">200+</div>
                <div className="text-primary-foreground/80">Recorded Sessions</div>
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-primary-foreground/80">Access Anytime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Classes;
