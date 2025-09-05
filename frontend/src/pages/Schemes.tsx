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
  FileText,
  ArrowRight,
  User,
  IndianRupee,
  Calendar,
} from "lucide-react";

type Scheme = {
  id: number;
  name: string;
  income_limit: number | string | null;
  crop_type: string;
  region: string;
  deadline: string;
  description: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Eligible":
      return "bg-primary text-primary-foreground";
    case "Recommended":
      return "bg-accent text-accent-foreground";
    case "Pre-approved":
      return "bg-primary-glow text-primary-foreground";
    case "Apply Now":
      return "bg-secondary text-secondary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Schemes() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/schemes");
        if (!res.ok) throw new Error("Failed to fetch schemes");
        const data = await res.json();

        // ✅ update state here
        setSchemes(data);
      } catch (err) {
        console.error("Error fetching schemes data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading schemes....</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            Government Schemes & Loans
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            AI-curated schemes and loans based on your profile. Get personalized
            recommendations to maximize your agricultural benefits.
          </p>
        </div>

        {/* AI Recommendation Banner (static for now) */}
        {/* <Card className="mb-8 bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  🤖 AI Recommendation
                </h3>
                <p className="opacity-90">
                  Based on your profile (e.g. Small farmer, 5 acres, Kerala),
                  we’ll highlight the most relevant schemes for you.
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Update Profile
              </Button>
            </div>
          </CardContent>
        </Card> */}

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.length === 0 ? (
            <p className="text-center col-span-3 text-muted-foreground">
              No schemes found.
            </p>
          ) : (
            schemes.map((scheme) => (
              <Card
                key={scheme.id}
                className="bg-gradient-card hover-lift group h-full"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {scheme.crop_type}
                    </Badge>
                    <Badge className={getStatusColor("Eligible")}>
                      Eligible
                    </Badge>
                  </div>

                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {scheme.name}
                  </CardTitle>

                  <CardDescription className="text-muted-foreground">
                    {scheme.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-1">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <IndianRupee className="h-4 w-4 mr-2 text-accent" />
                      <span className="font-medium">
                        {scheme.income_limit && scheme.income_limit !== "none"
                          ? `Income limit: ₹${scheme.income_limit}`
                          : "No income limit"}
                      </span>
                    </div>

                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{scheme.region}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Deadline: {scheme.deadline}</span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button className="w-full group-hover:shadow-glow transition-all">
                      <FileText className="h-4 w-4 mr-2" />
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
