import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      title: "Free Trial",
      price: "Free",
      description: "Perfect for trying out our platform",
      features: [
        "7 days full access",
        "Access to 1 live class",
        "3 recorded sessions",
        "Basic progress tracking",
        "Community forum access",
      ],
      buttonText: "Start Free Trial",
    },
    {
      title: "Standard",
      price: "₹799",
      description: "For dedicated practitioners",
      features: [
        "Unlimited recorded sessions",
        "5 live classes per month",
        "Advanced progress tracking",
        "Downloadable resources",
        "Priority email support",
        "Monthly wellness newsletter",
      ],
      isPopular: false,
      buttonText: "Get Started",
    },
    {
      title: "Premium",
      price: "₹1,499",
      description: "The complete wellness experience",
      features: [
        "Everything in Standard",
        "Unlimited live sessions",
        "1-on-1 monthly consultation",
        "Personalized practice plans",
        "Exclusive workshops & retreats",
        "Early access to new content",
        "Priority booking",
        "Custom diet recommendations",
      ],
      isPopular: true,
      buttonText: "Go Premium",
    },
  ];

  const faqs = [
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
    },
    {
      question: "Do I need any equipment?",
      answer: "All you need is a yoga mat and comfortable clothing. Props like blocks and straps are optional but can enhance your practice.",
    },
    {
      question: "Are classes suitable for beginners?",
      answer: "Absolutely! We offer classes for all levels, from complete beginners to advanced practitioners.",
    },
    {
      question: "What's included in the live sessions?",
      answer: "Live sessions include real-time instruction, the ability to ask questions, and personalized feedback from our instructor.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground">
              Start your wellness journey today with a plan that fits your lifestyle. 
              All plans include access to our supportive community.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PricingCard {...plan} />
              </div>
            ))}
          </div>
          
          {/* Money-back guarantee */}
          <div className="text-center mt-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/20 rounded-full">
              <Check className="text-secondary" size={20} />
              <span className="text-sm font-medium">30-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
              Compare Plans
            </h2>
            <div className="bg-card rounded-xl shadow-[var(--shadow-soft)] overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="text-left p-4">Feature</th>
                    <th className="text-center p-4">Free Trial</th>
                    <th className="text-center p-4">Standard</th>
                    <th className="text-center p-4">Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4">Recorded Sessions</td>
                    <td className="text-center p-4">3</td>
                    <td className="text-center p-4">Unlimited</td>
                    <td className="text-center p-4">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-4">Live Classes</td>
                    <td className="text-center p-4">1</td>
                    <td className="text-center p-4">5/month</td>
                    <td className="text-center p-4">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-4">Progress Tracking</td>
                    <td className="text-center p-4"><Check className="mx-auto text-secondary" size={20} /></td>
                    <td className="text-center p-4"><Check className="mx-auto text-secondary" size={20} /></td>
                    <td className="text-center p-4"><Check className="mx-auto text-secondary" size={20} /></td>
                  </tr>
                  <tr>
                    <td className="p-4">1-on-1 Consultation</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4"><Check className="mx-auto text-secondary" size={20} /></td>
                  </tr>
                  <tr>
                    <td className="p-4">Personalized Plans</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4">-</td>
                    <td className="text-center p-4"><Check className="mx-auto text-secondary" size={20} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-xl bg-card shadow-[var(--shadow-soft)] animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                  <p className="text-foreground/80">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
