import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-yoga.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Peaceful yoga session at sunrise"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 text-white">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your Mind & Body with Every Breath
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 font-light">
            Join a community of wellness seekers. Experience the power of yoga through live sessions, 
            expert guidance, and a journey towards inner peace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/pricing">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/classes">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              >
                Explore Classes
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
