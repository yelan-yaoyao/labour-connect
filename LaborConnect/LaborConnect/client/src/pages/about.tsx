import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Zap, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" data-testid="about-page">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="page-title">
          About Labor Connect
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="page-description">
          We're bridging the gap between skilled workers and employers who need them. Our platform makes it easier than ever to find reliable labor and meaningful work opportunities.
        </p>
      </div>

      {/* Mission Section */}
      <Card className="mb-12" data-testid="mission-section">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground mb-4" data-testid="mission-title">
                Our Mission
              </h2>
              <p className="text-muted-foreground mb-4" data-testid="mission-description-1">
                To create a trusted, efficient marketplace that connects hardworking individuals with employers who value their skills and dedication. We believe everyone deserves access to fair work opportunities and reliable workers.
              </p>
              <p className="text-muted-foreground" data-testid="mission-description-2">
                Since our founding, we've facilitated thousands of successful job matches across farming, construction, cleaning, and general labor sectors.
              </p>
            </div>
            <div className="gradient-bg rounded-lg p-8 text-center">
              <div className="text-white">
                <div className="text-4xl font-bold mb-2" data-testid="stat-matches">10,000+</div>
                <div className="text-lg mb-4">Successful Matches</div>
                <div className="text-4xl font-bold mb-2" data-testid="stat-workers">5,000+</div>
                <div className="text-lg mb-4">Active Workers</div>
                <div className="text-4xl font-bold mb-2" data-testid="stat-employers">2,500+</div>
                <div className="text-lg">Employers Served</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Why Choose Us */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-foreground text-center mb-8" data-testid="features-title">
          Why Choose Labor Connect?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card data-testid="feature-verified">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Verified Professionals
              </h3>
              <p className="text-muted-foreground">
                All workers undergo background checks and skill verification for your peace of mind.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="feature-quick">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Quick Connections
              </h3>
              <p className="text-muted-foreground">
                Our smart matching system connects you with the right workers in minutes, not days.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="feature-secure">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Secure Platform
              </h3>
              <p className="text-muted-foreground">
                Safe payment processing, dispute resolution, and 24/7 customer support.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Vision */}
      <div className="bg-muted rounded-lg p-8" data-testid="vision-section">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="vision-title">
            Our Vision
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto" data-testid="vision-description">
            We envision a future where finding quality work and reliable workers is seamless, transparent, and mutually beneficial. 
            By leveraging technology and building trust, we're creating opportunities that strengthen communities and drive economic growth.
          </p>
        </div>
      </div>
    </div>
  );
}
