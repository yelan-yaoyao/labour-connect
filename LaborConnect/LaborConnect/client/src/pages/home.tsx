import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sprout, HardHat, Sparkles, Wrench, CheckCircle, Zap, DollarSign } from "lucide-react";

export default function Home() {
  const categories = [
    {
      icon: <Sprout className="w-6 h-6" />,
      title: "Farming",
      description: "Agricultural workers, farm hands, and crop specialists for seasonal and full-time work.",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: <HardHat className="w-6 h-6" />,
      title: "Construction",
      description: "Skilled carpenters, electricians, plumbers, and general construction workers.",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Cleaning",
      description: "Professional cleaners for residential, commercial, and specialized cleaning services.",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "General Labor",
      description: "Versatile workers for moving, delivery, warehouse, and general assistance tasks.",
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-primary-foreground" />,
      title: "Verified Workers",
      description: "All workers are background-checked and verified for your peace of mind.",
      bgColor: "bg-primary",
    },
    {
      icon: <Zap className="w-8 h-8 text-accent-foreground" />,
      title: "Fast Matching",
      description: "Get connected with the right workers for your needs in minutes.",
      bgColor: "bg-accent",
    },
    {
      icon: <DollarSign className="w-8 h-8 text-white" />,
      title: "Secure Payments",
      description: "Safe and secure payment processing for all transactions.",
      bgColor: "bg-green-500",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="gradient-bg" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6" data-testid="hero-title">
              Connecting Employers with Reliable Workers
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto" data-testid="hero-description">
              Find skilled professionals for your projects or discover new work opportunities. Join thousands of workers and employers building success together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/find-people" data-testid="button-find-workers">
                <Button size="lg" className="bg-white text-primary hover:bg-white/95 text-lg px-8 py-4">
                  Find Workers
                </Button>
              </Link>
              <Link href="/register" data-testid="button-join-worker">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
                >
                  Join as Worker
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" data-testid="categories-section">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="categories-title">
            Find Workers by Category
          </h2>
          <p className="text-lg text-muted-foreground" data-testid="categories-description">
            Browse through our diverse categories of skilled professionals
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link href="/find-people" key={index} data-testid={`category-card-${category.title.toLowerCase()}`}>
              <div className="bg-card rounded-lg p-6 shadow-md card-hover cursor-pointer">
                <div className={`w-12 h-12 ${category.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <div className={category.iconColor}>
                    {category.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-2" data-testid={`category-title-${category.title.toLowerCase()}`}>
                  {category.title}
                </h3>
                <p className="text-muted-foreground" data-testid={`category-description-${category.title.toLowerCase()}`}>
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted" data-testid="features-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="features-title">
              Why Choose Labor Connect?
            </h2>
            <p className="text-lg text-muted-foreground" data-testid="features-description">
              The most trusted platform for connecting employers and workers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center" data-testid={`feature-${index}`}>
                <div className={`w-16 h-16 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`feature-title-${index}`}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground" data-testid={`feature-description-${index}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
