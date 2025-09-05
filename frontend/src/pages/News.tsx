import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight, Newspaper, TrendingUp } from 'lucide-react';

const newsArticles = [
  {
    title: 'Kerala Receives ₹500 Crore Agricultural Modernization Fund',
    summary: 'State government announces major investment in farming technology and infrastructure development across all 14 districts.',
    category: 'Government Policy',
    date: '2024-03-15',
    author: 'Kerala Agricultural Department',
    readTime: '3 min read',
    trending: true,
    image: '🏛️'
  },
  {
    title: 'Monsoon Forecast: Normal Rainfall Expected This Season',
    summary: 'IMD predicts normal to above-normal rainfall for Kerala, beneficial for paddy and spice cultivation.',
    category: 'Weather',
    date: '2024-03-14',
    author: 'Kerala Weather Bureau', 
    readTime: '2 min read',
    trending: true,
    image: '🌧️'
  },
  {
    title: 'Coconut Prices Surge to ₹35 per Piece in Kerala Markets',
    summary: 'Demand from neighboring states drives coconut prices up by 25% compared to last month.',
    category: 'Market Update',
    date: '2024-03-13',
    author: 'Kerala Market Intelligence',
    readTime: '2 min read',
    trending: false,
    image: '🥥'
  },
  {
    title: 'Success Story: Organic Farmer Earns ₹2L Monthly from 2-Acre Plot',
    summary: 'Thrissur farmer adopts innovative organic methods, increases income by 300% through direct marketing.',
    category: 'Success Story',
    date: '2024-03-12',
    author: 'Agriculture Today',
    readTime: '5 min read',
    trending: false,
    image: '🌱'
  },
  {
    title: 'New Pest Alert: Brown Plant Hopper Spotted in Palakkad',
    summary: 'Agricultural officers issue advisory for paddy farmers to take preventive measures against pest outbreak.',
    category: 'Advisory',
    date: '2024-03-11',
    author: 'Plant Protection Office',
    readTime: '3 min read',
    trending: false,
    image: '🚨'
  },
  {
    title: 'Digital Agriculture Platform Launched for Kerala Farmers',
    summary: 'New mobile app provides real-time market prices, weather alerts, and expert advice in Malayalam.',
    category: 'Technology',
    date: '2024-03-10',
    author: 'Kerala IT Mission',
    readTime: '4 min read',
    trending: false,
    image: '📱'
  },
  {
    title: 'Cardamom Auction Prices Hit Record High of ₹2,800/kg',
    summary: 'International demand and quality produce from Western Ghats drive cardamom prices to new heights.',
    category: 'Market Update',
    date: '2024-03-09',
    author: 'Spice Board India',
    readTime: '2 min read',
    trending: false,
    image: '🫚'
  },
  {
    title: 'Water Conservation: 1,000 Farm Ponds Constructed This Year',
    summary: 'State completes ambitious water conservation project, benefiting over 5,000 farmers across Kerala.',
    category: 'Infrastructure',
    date: '2024-03-08',
    author: 'Water Resources Department',
    readTime: '3 min read',
    trending: false,
    image: '💧'
  }
];

const categories = ['All', 'Government Policy', 'Weather', 'Market Update', 'Technology', 'Success Story'];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    'Government Policy': 'bg-primary text-primary-foreground',
    'Weather': 'bg-accent text-accent-foreground',
    'Market Update': 'bg-secondary text-secondary-foreground',
    'Technology': 'bg-primary-glow text-primary-foreground',
    'Success Story': 'bg-primary-accent text-primary-foreground',
    'Advisory': 'bg-destructive text-destructive-foreground',
    'Infrastructure': 'bg-muted text-muted-foreground'
  };
  return colors[category] || 'bg-muted text-muted-foreground';
};

export default function News() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            Agricultural News & Updates
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Stay informed with the latest agricultural news, market updates, weather alerts, 
            and government announcements relevant to Kerala farmers.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={category === 'All' ? 'default' : 'outline'}
              className="px-4 py-2 cursor-pointer hover:shadow-glow transition-all"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Trending News */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-accent mr-2" />
            <h2 className="text-2xl font-bold">Trending News</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {newsArticles.filter(article => article.trending).map((article, index) => (
              <Card key={index} className="bg-gradient-card hover-lift cursor-pointer group">
                <CardContent className="p-0">
                  <div className="flex h-full">
                    <div className="w-24 bg-gradient-primary flex items-center justify-center text-4xl flex-shrink-0">
                      {article.image}
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      
                      <CardDescription className="text-sm mb-3 line-clamp-2">
                        {article.summary}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(article.date).toLocaleDateString()}
                          </div>
                          <span>{article.readTime}</span>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          Read More <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All News */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <Newspaper className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-2xl font-bold">Latest News</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsArticles.map((article, index) => (
              <Card key={index} className="bg-gradient-card hover-lift cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(article.category)} variant="outline">
                      {article.category}
                    </Badge>
                    {article.trending && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-6xl mb-4 text-center opacity-70">
                    {article.image}
                  </div>
                  
                  <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                  
                  <CardDescription className="text-sm line-clamp-3">
                    {article.summary}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {article.author}
                    </div>
                    <span>{article.readTime}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(article.date).toLocaleDateString()}
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Read <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Stay Updated</h3>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              Get daily agricultural news, market prices, and weather alerts delivered 
              to your phone via WhatsApp or SMS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Button variant="secondary" className="flex-1">
                WhatsApp Updates
              </Button>
              <Button variant="outline" className="flex-1 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                SMS Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}