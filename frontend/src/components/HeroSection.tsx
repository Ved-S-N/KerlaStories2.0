import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Leaf, Users, TrendingUp, Shield, MessageCircle, Link as LinkIcon, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: MessageCircle,
    title: 'AI Assistant',
    description: 'AI-powered agricultural solutions for better yields'
  },
  {
    icon: FileText,
    title: 'Government Schemes & Loans',
    description: 'Access curated government schemes and loan options'
  },
  {
    icon: LinkIcon,
    title: 'DigiLocker Linking',
    description: 'Securely link your DigiLocker for easy document access'
  },
  {
    icon: Shield,
    title: 'Legal Protection',
    description: 'Connect with law firms for agricultural legal support'
  }
];

export function HeroSection() {
  return (
    <section className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 transform scale-125 -translate-y-12"
      >
        <source src="/vidva.mp4" type="video/mp4" />
      </video>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-primary/30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          {/* Hero Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-glow">
              Kerala's Future of
              <span className="block bg-gradient-accent bg-clip-text text-transparent">
                Smart Agriculture
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Empowering Kerala's farmers with AI-driven solutions, government schemes, 
              market access, and community support. Join the agricultural revolution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/schemes">
                <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
                  Explore Schemes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/chat">
                <Button variant="outline" size="lg" className="hover-lift">
                  AI Assistant
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 bg-gradient-card border-border/50 hover-lift group cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:animate-glow transition-all duration-300">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-slide-up">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">10,000+</div>
            <div className="text-muted-foreground">Farmers Connected</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">₹50L+</div>
            <div className="text-muted-foreground">Loans Facilitated</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-accent mb-2">24/7</div>
            <div className="text-muted-foreground">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
