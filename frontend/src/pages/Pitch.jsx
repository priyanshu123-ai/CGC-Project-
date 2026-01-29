import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Leaf, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp,
  Users,
  Target,
  Award,
  Globe
} from "lucide-react";

const slides = [
  {
    id: 1,
    type: "story",
    title: "The Story Begins...",
    icon: Globe,
    content: {
      heading: "A Journey Through Delhi's Air",
      story: `Meet Rahul, a software engineer living in Delhi. Every morning, his brother Amit leaves for office, navigating through the city's congested streets.

One smoggy winter morning, Amit checked his usual route — the AQI was 387. Dangerous. His eyes burned, throat scratched. He wondered: "Is there a better way?"

He tried Google Maps for the fastest route, but it didn't consider air quality. He switched to a bike some days, but wasn't sure if it actually helped. He bought "eco-friendly" products, but had no way to measure their real impact.

Amit wasn't alone. Millions face this daily — wanting to make better choices but lacking the tools to measure, track, and improve.`,
      image: "🌫️"
    }
  },
  {
    id: 2,
    type: "problem",
    title: "The Problem",
    icon: AlertTriangle,
    content: {
      heading: "Why Current Solutions Fail",
      problems: [
        {
          title: "No AQI-Aware Navigation",
          description: "Maps show fastest routes, not healthiest. You might save 5 minutes but inhale 10x more toxins."
        },
        {
          title: "Invisible Carbon Footprint",
          description: "People don't know how their daily choices — electricity, fuel, shopping — impact pollution."
        },
        {
          title: "Greenwashing Confusion",
          description: "Products claim to be 'eco-friendly' but there's no standardized way to compare their real environmental impact."
        },
        {
          title: "No Motivation to Change",
          description: "Without gamification, social comparison, or visible progress, sustainable habits don't stick."
        }
      ]
    }
  },
  {
    id: 3,
    type: "solution",
    title: "Our Solution",
    icon: Lightbulb,
    content: {
      heading: "Introducing EcoSense",
      tagline: "Your Personal Pollution Intelligence Platform",
      features: [
        {
          icon: "🎯",
          title: "Pollution Credit Score",
          description: "Like a CIBIL score for your environmental impact. Track your 0-900 score based on energy, transport, shopping & lifestyle."
        },
        {
          icon: "🗺️",
          title: "AQI-Aware Routes",
          description: "Navigate smarter, not just faster. We rank routes by pollution exposure, helping you breathe easier."
        },
        {
          icon: "📦",
          title: "Product Scanner",
          description: "Scan any product to see its environmental impact and discover sustainable alternatives instantly."
        },
        {
          icon: "👨‍👩‍👧‍👦",
          title: "Family Competition",
          description: "Challenge your family to reduce pollution together. Track, compare, and celebrate eco-wins."
        }
      ]
    }
  },
  {
    id: 4,
    type: "impact",
    title: "Environmental Impact",
    icon: TrendingUp,
    content: {
      heading: "What If Everyone Used EcoSense?",
      stats: [
        { value: "30%", label: "Reduction in toxic inhalation", description: "By choosing AQI-optimized routes" },
        { value: "45%", label: "More sustainable purchases", description: "When users see product impact scores" },
        { value: "2.5 Tons", label: "CO₂ saved per user/year", description: "Through behavior change & awareness" },
        { value: "10M+", label: "Trees equivalent", description: "If 1M Delhi residents adopt EcoSense" }
      ],
      beforeAfter: {
        before: "Without EcoSense: Amit inhales 12μg PM2.5 daily, uses single-use plastics, drives polluting routes",
        after: "With EcoSense: 40% less pollution exposure, sustainable product choices, family competing to go green"
      }
    }
  },
  {
    id: 5,
    type: "features",
    title: "Key Features",
    icon: Target,
    content: {
      heading: "Complete Ecosystem for Sustainable Living",
      categories: [
        {
          title: "🎮 Gamification",
          items: ["Weekly pollution challenges", "Leaderboards with friends", "Badges & rewards", "Streak bonuses"]
        },
        {
          title: "🔔 Smart Alerts",
          items: ["Predictive AQI forecasts", "High-pollution zone warnings", "Best travel time suggestions", "Real-time exposure tracking"]
        },
        {
          title: "📊 Insights",
          items: ["Route pollution heatmaps", "Monthly health reports", "Carbon footprint trends", "Improvement suggestions"]
        },
        {
          title: "👪 Family Mode",
          items: ["Household competition", "Combined family score", "Daily routine tracking", "Photo proof uploads"]
        }
      ]
    }
  },
  {
    id: 6,
    type: "demo",
    title: "See It In Action",
    icon: Users,
    content: {
      heading: "User Journey",
      steps: [
        { step: 1, title: "Onboard", description: "Answer lifestyle questionnaire, get initial pollution score" },
        { step: 2, title: "Navigate", description: "Search routes, see AQI comparison, choose healthiest path" },
        { step: 3, title: "Scan", description: "Scan products, see impact, discover eco alternatives" },
        { step: 4, title: "Compete", description: "Join family challenges, climb leaderboards, earn badges" },
        { step: 5, title: "Improve", description: "Track monthly reports, see your impact, celebrate wins" }
      ]
    }
  },
  {
    id: 7,
    type: "closing",
    title: "Join the Movement",
    icon: Award,
    content: {
      heading: "Every Breath Counts",
      message: "EcoSense isn't just an app — it's a movement towards conscious living. We're not asking people to change overnight. We're giving them the tools to see their impact, make informed choices, and celebrate every small win.",
      cta: "Be Part of the Solution",
      stats: [
        { icon: "🌱", label: "Start tracking your pollution score today" },
        { icon: "🏆", label: "Challenge your family to go green" },
        { icon: "🌍", label: "Join millions making Delhi breathable again" }
      ]
    }
  }
];

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];
  const SlideIcon = slide.icon;

  const renderSlideContent = () => {
    switch (slide.type) {
      case "story":
        return (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "80px", marginBottom: "24px" }}>{slide.content.image}</p>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#4ade80", marginBottom: "24px" }}>
              {slide.content.heading}
            </h2>
            <div style={{ 
              background: "rgba(34, 197, 94, 0.1)", 
              border: "1px solid rgba(34, 197, 94, 0.2)", 
              borderRadius: "16px", 
              padding: "24px",
              maxWidth: "700px",
              margin: "0 auto"
            }}>
              <p style={{ color: "#d1d5db", lineHeight: "1.8", whiteSpace: "pre-line", textAlign: "left" }}>
                {slide.content.story}
              </p>
            </div>
          </div>
        );

      case "problem":
        return (
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#EF4444", textAlign: "center", marginBottom: "32px" }}>
              {slide.content.heading}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {slide.content.problems.map((problem, index) => (
                <Card key={index} style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                  <CardContent style={{ padding: "20px" }}>
                    <h3 style={{ color: "#f0f5f2", fontWeight: "600", marginBottom: "8px" }}>{problem.title}</h3>
                    <p style={{ color: "#9ca3af", fontSize: "14px" }}>{problem.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "solution":
        return (
          <div>
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h2 style={{ fontSize: "32px", fontWeight: "bold", color: "#4ade80", marginBottom: "8px" }}>
                {slide.content.heading}
              </h2>
              <p style={{ color: "#9ca3af", fontSize: "18px" }}>{slide.content.tagline}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              {slide.content.features.map((feature, index) => (
                <Card key={index} style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                  <CardContent style={{ padding: "24px", textAlign: "center" }}>
                    <p style={{ fontSize: "40px", marginBottom: "12px" }}>{feature.icon}</p>
                    <h3 style={{ color: "#4ade80", fontWeight: "600", marginBottom: "8px" }}>{feature.title}</h3>
                    <p style={{ color: "#9ca3af", fontSize: "14px" }}>{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "impact":
        return (
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#4ade80", textAlign: "center", marginBottom: "32px" }}>
              {slide.content.heading}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
              {slide.content.stats.map((stat, index) => (
                <Card key={index} style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                  <CardContent style={{ padding: "20px", textAlign: "center" }}>
                    <p style={{ fontSize: "32px", fontWeight: "bold", color: "#4ade80" }}>{stat.value}</p>
                    <p style={{ color: "#f0f5f2", fontWeight: "500", marginBottom: "4px" }}>{stat.label}</p>
                    <p style={{ color: "#9ca3af", fontSize: "12px" }}>{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              <Card style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                <CardContent style={{ padding: "20px" }}>
                  <h3 style={{ color: "#EF4444", fontWeight: "600", marginBottom: "8px" }}>❌ Before EcoSense</h3>
                  <p style={{ color: "#9ca3af", fontSize: "14px" }}>{slide.content.beforeAfter.before}</p>
                </CardContent>
              </Card>
              <Card style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                <CardContent style={{ padding: "20px" }}>
                  <h3 style={{ color: "#4ade80", fontWeight: "600", marginBottom: "8px" }}>✅ After EcoSense</h3>
                  <p style={{ color: "#9ca3af", fontSize: "14px" }}>{slide.content.beforeAfter.after}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "features":
        return (
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#4ade80", textAlign: "center", marginBottom: "32px" }}>
              {slide.content.heading}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              {slide.content.categories.map((category, index) => (
                <Card key={index} style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)" }}>
                  <CardContent style={{ padding: "20px" }}>
                    <h3 style={{ color: "#4ade80", fontWeight: "600", marginBottom: "12px" }}>{category.title}</h3>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {category.items.map((item, i) => (
                        <li key={i} style={{ color: "#d1d5db", fontSize: "14px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80" }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "demo":
        return (
          <div>
            <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#4ade80", textAlign: "center", marginBottom: "32px" }}>
              {slide.content.heading}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "24px" }}>
              {slide.content.steps.map((step, index) => (
                <div key={index} style={{ textAlign: "center", position: "relative" }}>
                  <div style={{ 
                    width: "60px", 
                    height: "60px", 
                    borderRadius: "50%", 
                    background: "linear-gradient(135deg, #22c55e, #16a34a)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 12px",
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#030a06"
                  }}>
                    {step.step}
                  </div>
                  <h3 style={{ color: "#f0f5f2", fontWeight: "600", marginBottom: "4px" }}>{step.title}</h3>
                  <p style={{ color: "#9ca3af", fontSize: "12px", maxWidth: "120px" }}>{step.description}</p>
                  {index < slide.content.steps.length - 1 && (
                    <ChevronRight style={{ 
                      position: "absolute", 
                      right: "-20px", 
                      top: "20px", 
                      color: "#4ade80",
                      display: window.innerWidth > 640 ? "block" : "none"
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "closing":
        return (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "bold", color: "#4ade80", marginBottom: "24px" }}>
              {slide.content.heading}
            </h2>
            <p style={{ color: "#d1d5db", fontSize: "18px", lineHeight: "1.8", maxWidth: "700px", margin: "0 auto 32px" }}>
              {slide.content.message}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", marginBottom: "32px" }}>
              {slide.content.stats.map((stat, index) => (
                <div key={index} style={{ 
                  background: "rgba(34, 197, 94, 0.1)", 
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  borderRadius: "12px",
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <span style={{ fontSize: "24px" }}>{stat.icon}</span>
                  <span style={{ color: "#d1d5db" }}>{stat.label}</span>
                </div>
              ))}
            </div>
            <Button style={{ 
              background: "linear-gradient(135deg, #22c55e, #16a34a)", 
              color: "#030a06", 
              fontWeight: "600",
              padding: "16px 32px",
              fontSize: "18px"
            }}>
              <Leaf style={{ marginRight: "8px" }} />
              {slide.content.cta}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #030a06, #071a0f, #0a2915)" }} className="mt-16">
      <Navbar />
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 16px" }}>
        {/* Progress Bar */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{ 
                height: "8px", 
                flex: 1, 
                borderRadius: "4px", 
                background: index === currentSlide ? "#4ade80" : index < currentSlide ? "rgba(74, 222, 128, 0.5)" : "rgba(34, 197, 94, 0.2)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
            />
          ))}
        </div>

        {/* Slide Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "32px" }}>
          <div style={{ 
            width: "48px", 
            height: "48px", 
            borderRadius: "50%", 
            background: "rgba(34, 197, 94, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <SlideIcon style={{ color: "#4ade80" }} />
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#f0f5f2" }}>{slide.title}</h1>
          <span style={{ color: "#9ca3af" }}>({currentSlide + 1}/{slides.length})</span>
        </div>

        {/* Slide Content */}
        <div style={{ minHeight: "400px", marginBottom: "32px" }}>
          {renderSlideContent()}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button 
            onClick={prevSlide} 
            disabled={currentSlide === 0}
            style={{ 
              background: "rgba(34, 197, 94, 0.2)", 
              border: "1px solid rgba(34, 197, 94, 0.3)", 
              color: currentSlide === 0 ? "#6b7280" : "#4ade80",
              opacity: currentSlide === 0 ? 0.5 : 1
            }}
          >
            <ChevronLeft style={{ marginRight: "8px" }} />
            Previous
          </Button>

          <div style={{ display: "flex", gap: "8px" }}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{ 
                  width: "12px", 
                  height: "12px", 
                  borderRadius: "50%", 
                  background: index === currentSlide ? "#4ade80" : "rgba(34, 197, 94, 0.2)",
                  border: "none",
                  cursor: "pointer",
                  transform: index === currentSlide ? "scale(1.25)" : "scale(1)",
                  transition: "all 0.3s"
                }}
              />
            ))}
          </div>

          <Button 
            onClick={nextSlide} 
            disabled={currentSlide === slides.length - 1}
            style={{ 
              background: currentSlide === slides.length - 1 ? "rgba(34, 197, 94, 0.2)" : "linear-gradient(135deg, #22c55e, #16a34a)", 
              color: currentSlide === slides.length - 1 ? "#6b7280" : "#030a06",
              opacity: currentSlide === slides.length - 1 ? 0.5 : 1
            }}
          >
            Next
            <ChevronRight style={{ marginLeft: "8px" }} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Presentation;