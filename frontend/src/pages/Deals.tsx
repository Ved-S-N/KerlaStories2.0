import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, MapPin, Truck, Users, Heart } from 'lucide-react';

const deals = [
  {
    title: 'Premium Tractor - Mahindra 575 DI',
    description: 'Heavy-duty tractor suitable for all farming operations',
    originalPrice: '₹8,50,000',
    discountPrice: '₹7,25,000',
    discount: '15% OFF',
    rating: 4.8,
    reviews: 234,
    category: 'Equipment',
    location: 'Kochi, Kerala',
    seller: 'Mahindra Dealership',
    delivery: 'Free Delivery',
    inStock: true
  },
  {
    title: 'Organic Cow Dung Fertilizer',
    description: 'Premium quality organic fertilizer for healthy crop growth',
    originalPrice: '₹450',
    discountPrice: '₹320',
    discount: '29% OFF',
    rating: 4.6,
    reviews: 456,
    category: 'Fertilizer',
    location: 'Thrissur, Kerala',
    seller: 'Kerala Organics',
    delivery: '₹50 Delivery',
    inStock: true
  },
  {
    title: 'Rice Seeds - Ponni Variety',
    description: 'High-yield paddy seeds suitable for Kerala climate',
    originalPrice: '₹180',
    discountPrice: '₹145',
    discount: '19% OFF',
    rating: 4.9,
    reviews: 189,
    category: 'Seeds',
    location: 'Palakkad, Kerala',
    seller: 'Kerala Seed Corp',
    delivery: 'Free Delivery',
    inStock: false
  },
  {
    title: 'Drip Irrigation Kit',
    description: 'Complete drip irrigation system for 1-acre farm',
    originalPrice: '₹25,000',
    discountPrice: '₹19,500',
    discount: '22% OFF',
    rating: 4.5,
    reviews: 78,
    category: 'Irrigation',
    location: 'Ernakulam, Kerala',
    seller: 'AquaTech Solutions',
    delivery: 'Free Installation',
    inStock: true
  },
  {
    title: 'Coconut Harvester Tool',
    description: 'Traditional Kerala coconut climbing and harvesting equipment',
    originalPrice: '₹3,200',
    discountPrice: '₹2,650',
    discount: '17% OFF',
    rating: 4.7,
    reviews: 123,
    category: 'Tools',
    location: 'Kozhikode, Kerala',
    seller: 'Kerala Tools',
    delivery: '₹30 Delivery',
    inStock: true
  },
  {
    title: 'Pesticide Spray Pump',
    description: 'Battery-operated spray pump for efficient pesticide application',
    originalPrice: '₹8,500',
    discountPrice: '₹6,800',
    discount: '20% OFF',
    rating: 4.4,
    reviews: 92,
    category: 'Equipment',
    location: 'Thiruvananthapuram, Kerala',
    seller: 'Agri Equipment Hub',
    delivery: 'Free Delivery',
    inStock: true
  }
];

const categories = ['All', 'Equipment', 'Seeds', 'Fertilizer', 'Tools', 'Irrigation'];

export default function Deals() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            Agricultural Deals & Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the best deals on farming equipment, seeds, fertilizers, and tools. 
            Connect directly with trusted Kerala suppliers.
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

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, index) => (
            <Card key={index} className="bg-gradient-card hover-lift group overflow-hidden">
              {/* Deal Badge */}
              <div className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-accent text-accent-foreground font-semibold">
                    {deal.discount}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-background/20">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Placeholder Image */}
                <div className="h-48 bg-gradient-primary/20 flex items-center justify-center">
                  <div className="text-6xl opacity-30">🚜</div>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {deal.category}
                  </Badge>
                  {!deal.inStock && (
                    <Badge variant="secondary" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {deal.title}
                </CardTitle>
                
                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                  {deal.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary">{deal.discountPrice}</span>
                  <span className="text-sm text-muted-foreground line-through">{deal.originalPrice}</span>
                </div>

                {/* Rating & Reviews */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium ml-1">{deal.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({deal.reviews} reviews)</span>
                </div>

                {/* Location & Seller */}
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {deal.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {deal.seller}
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-3 w-3 mr-1" />
                    {deal.delivery}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    className="flex-1 group-hover:shadow-glow transition-all"
                    disabled={!deal.inStock}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {deal.inStock ? 'Add to Cart' : 'Notify Me'}
                  </Button>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Seller Info */}
        <Card className="mt-12 bg-gradient-card">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Become a Seller</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Are you a supplier or manufacturer? Join our platform to reach thousands of farmers 
              across Kerala. List your products and grow your business.
            </p>
            <Button size="lg" variant="outline">
              Register as Seller
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}