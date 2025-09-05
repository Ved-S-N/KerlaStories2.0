import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Scale, MapPin, Phone, Star, Users, FileText, ArrowRight } from 'lucide-react';

const lawFirms = [
  {
    name: 'Kerala Agricultural Legal Associates',
    specialization: 'Land Rights & Crop Insurance',
    rating: 4.8,
    reviews: 156,
    location: 'Kochi, Kerala',
    phone: '+91 98765 43210',
    experience: '15+ Years',
    languages: 'English, Malayalam, Hindi',
    expertise: ['Land Disputes', 'Insurance Claims', 'Contract Farming', 'Water Rights']
  },
  {
    name: 'Farmers Legal Aid Centre',
    specialization: 'Government Schemes & Subsidies',
    rating: 4.6,
    reviews: 89,
    location: 'Thiruvananthapuram, Kerala',
    phone: '+91 87654 32109',
    experience: '12+ Years',
    languages: 'Malayalam, English',
    expertise: ['Subsidy Claims', 'Loan Disputes', 'Labour Laws', 'Organic Certification']
  },
  {
    name: 'Rural Rights Law Firm',
    specialization: 'Environmental & Pesticide Issues',
    rating: 4.7,
    reviews: 203,
    location: 'Thrissur, Kerala',
    phone: '+91 76543 21098',
    experience: '20+ Years',
    languages: 'English, Malayalam, Tamil',
    expertise: ['Environmental Law', 'Pesticide Compensation', 'Cooperative Societies', 'Tax Issues']
  }
];

const legalServices = [
  'Land ownership disputes',
  'Crop insurance claim denials',
  'Government subsidy rejections',
  'Agricultural loan issues',
  'Contract farming disputes',
  'Water rights conflicts',
  'Pesticide damage claims',
  'Labour law violations'
];

export default function Legal() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            Legal Support for Farmers
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with experienced agricultural lawyers who understand Kerala farming laws. 
            Get expert legal guidance for land, insurance, and government scheme issues.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Legal Consultation Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Scale className="h-6 w-6 mr-2 text-primary" />
                  Request Legal Consultation
                </CardTitle>
                <CardDescription>
                  Describe your legal issue and we'll connect you with the right lawyer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Legal Issue Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {legalServices.slice(0, 6).map((service, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors p-2 text-center"
                      >
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Describe Your Issue</label>
                  <Textarea 
                    placeholder="Please provide details about your legal issue, including dates, documents involved, and any previous actions taken..."
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Preferred Language</label>
                  <div className="flex space-x-2">
                    {['Malayalam', 'English', 'Hindi'].map((lang) => (
                      <Badge key={lang} variant="outline" className="cursor-pointer">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all">
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Consultation Request
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Contact */}
          <div className="space-y-6">
            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Emergency Legal Helpline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-2">1800-123-FARM</div>
                  <p className="text-sm text-muted-foreground">Available 24/7 for urgent legal matters</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Common Legal Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {legalServices.map((service, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2 flex-shrink-0" />
                    {service}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Featured Law Firms */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-glow">
            Featured Agricultural Law Firms
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawFirms.map((firm, index) => (
              <Card key={index} className="bg-gradient-card hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      Legal Services
                    </Badge>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 fill-accent text-accent mr-1" />
                      <span className="font-medium">{firm.rating}</span>
                      <span className="text-muted-foreground ml-1">({firm.reviews})</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-xl">{firm.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {firm.specialization}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {firm.location}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {firm.phone}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      {firm.experience} Experience
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {firm.expertise.map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button className="w-full" variant="outline">
                      Contact Lawyer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Legal Resources */}
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Free Legal Resources</h3>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              Access our library of legal guides, templates, and know-your-rights information 
              specifically designed for Kerala farmers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary">
                Download Legal Guide
              </Button>
              <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Legal Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}