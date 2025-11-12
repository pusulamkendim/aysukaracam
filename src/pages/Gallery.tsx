import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/TestimonialCard";

import hathaImage from "@/assets/hatha-yoga.jpg";
import vinyasaImage from "@/assets/vinyasa-yoga.jpg";
import powerImage from "@/assets/power-yoga.jpg";
import meditationImage from "@/assets/meditation.jpg";
import heroImage from "@/assets/hero-yoga.jpg";

const Gallery = () => {
  const galleryImages = [
    { src: heroImage, alt: "Peaceful outdoor yoga session" },
    { src: hathaImage, alt: "Hatha yoga class in studio" },
    { src: vinyasaImage, alt: "Dynamic vinyasa flow session" },
    { src: powerImage, alt: "Power yoga workout class" },
    { src: meditationImage, alt: "Meditation and mindfulness practice" },
    { src: hathaImage, alt: "Morning yoga practice" },
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Yoga Enthusiast",
      content: "Serenity Yoga transformed my life. The instructors are knowledgeable and the community is so supportive. I've never felt better!",
      rating: 5,
    },
    {
      name: "David Chen",
      role: "Premium Member",
      content: "Best investment I've made in my wellness journey. The live sessions are incredible and the personalized guidance has helped me progress so much.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Beginner Yogi",
      content: "As a complete beginner, I felt welcomed and guided every step of the way. The community here is amazing!",
      rating: 5,
    },
    {
      name: "Michael Johnson",
      role: "Standard Member",
      content: "The variety of classes keeps me engaged. From power yoga to meditation, there's something for every mood and goal.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Premium Member",
      content: "The monthly consultations have been game-changing. Having personalized guidance makes all the difference in my practice.",
      rating: 5,
    },
    {
      name: "Alex Thompson",
      role: "Yoga Enthusiast",
      content: "I've tried many online yoga platforms, but Serenity Yoga stands out. The instruction quality and community support are unmatched.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Gallery & Testimonials</h1>
            <p className="text-xl text-muted-foreground">
              Explore moments from our yoga community and hear from our amazing students
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
            Studio Moments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white p-6 font-medium">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 animate-fade-in">
            What Our Students Say
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join thousands of satisfied students who have transformed their lives through yoga
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-5xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/80">Happy Students</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-primary-foreground/80">Classes Conducted</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl font-bold mb-2">4.9/5</div>
              <div className="text-primary-foreground/80">Average Rating</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-5xl font-bold mb-2">10+</div>
              <div className="text-primary-foreground/80">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
