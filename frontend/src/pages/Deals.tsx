import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  ShoppingCart,
  MapPin,
  Truck,
  Users,
  Heart,
  PlusCircle,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

const categories = [
  "All",
  "Equipment",
  "Seeds",
  "Fertilizer",
  "Tools",
  "Irrigation",
];

interface Product {
  id: number;
  title: string;
  description: string;
  originalPrice: number;
  discountPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  category: string;
  location: string;
  seller: string;
  delivery: string;
  inStock: boolean;
  image?: string;
}

export default function Deals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { state: cartState, dispatch } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // --- THIS IS THE CHANGE ---
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseURL}/api/products`);
        // -------------------------

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products data:", err);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    dispatch({ type: "ADD_ITEM", product });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
              Agricultural Deals & Marketplace
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Discover the best deals on farming equipment, seeds, fertilizers,
              and tools. Connect directly with trusted Kerala suppliers.
            </p>
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => navigate("/add-product")}
              variant="outline"
              className="flex items-center"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Product
            </Button>
            <Button onClick={() => navigate("/cart")} variant="default">
              View Cart ({cartState.items.length})
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={category === selectedCategory ? "default" : "outline"}
              className="px-4 py-2 cursor-pointer hover:shadow-glow transition-all"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="bg-gradient-card hover-lift group overflow-hidden"
            >
              <div className="relative">
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-accent text-accent-foreground font-semibold">
                    {product.discount}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-background/20"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Product Image or Placeholder */}
                <div className="h-48 bg-gradient-primary/20 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-contain h-full"
                    />
                  ) : (
                    <div className="text-6xl opacity-30">🚜</div>
                  )}
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  {!product.inStock && (
                    <Badge variant="secondary" className="text-xs">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {product.title}
                </CardTitle>

                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-primary">
                    ₹{product.discountPrice}
                  </span>
                  <span className="text-sm text-muted-foreground line-through">
                    ₹{product.originalPrice}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium ml-1">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {product.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {product.seller}
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-3 w-3 mr-1" />
                    {product.delivery}
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    className="flex-1 group-hover:shadow-glow transition-all"
                    disabled={!product.inStock}
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Notify Me"}
                  </Button>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 bg-gradient-card">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Become a Seller</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Are you a supplier or manufacturer? Join our platform to reach
              thousands of farmers across Kerala. List your products and grow
              your business.
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
