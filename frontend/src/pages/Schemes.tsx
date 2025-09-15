import { useEffect, useState, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  // Filter states
  const [selectedIncomeLimit, setSelectedIncomeLimit] = useState<string>("");
  const [selectedCropType, setSelectedCropType] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedDeadline, setSelectedDeadline] = useState<string>("");

  // Options states
  const [incomeOptions, setIncomeOptions] = useState<string[]>([]);
  const [cropOptions, setCropOptions] = useState<string[]>([]);
  const [regionOptions, setRegionOptions] = useState<string[]>([]);
  const [deadlineOptions, setDeadlineOptions] = useState<string[]>([]);

  // Helper function to get month-year from deadline string
  const getMonthYear = (deadline: string) => {
    try {
      const date = new Date(deadline);
      if (isNaN(date.getTime())) return "Ongoing";
      return date.toLocaleString("default", { month: "long", year: "numeric" });
    } catch {
      return "Ongoing";
    }
  };

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${baseURL}/api/schemes`);
        if (!res.ok) throw new Error("Failed to fetch schemes");
        const data = await res.json();

        // ✅ update state here
        setSchemes(data);

        // Compute filter options
        const incomes = [
          ...new Set(
            (data as Scheme[]).map((s) => s.income_limit?.toString() || "None")
          ),
        ].sort();
        const crops = [
          ...new Set((data as Scheme[]).map((s) => s.crop_type)),
        ].sort();
        const regions = [
          ...new Set((data as Scheme[]).map((s) => s.region)),
        ].sort();
        const deadlines = [
          ...new Set((data as Scheme[]).map((s) => getMonthYear(s.deadline))),
        ].sort();

        setIncomeOptions(incomes);
        setCropOptions(crops);
        setRegionOptions(regions);
        setDeadlineOptions(deadlines);
      } catch (err) {
        console.error("Error fetching schemes data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  // Filtered schemes
  const filteredSchemes = useMemo(() => {
    return schemes.filter((scheme) => {
      if (
        selectedIncomeLimit &&
        (scheme.income_limit?.toString() || "None") !== selectedIncomeLimit
      )
        return false;
      if (selectedCropType && scheme.crop_type !== selectedCropType)
        return false;
      if (selectedRegion && scheme.region !== selectedRegion) return false;
      if (
        selectedDeadline &&
        getMonthYear(scheme.deadline) !== selectedDeadline
      )
        return false;
      return true;
    });
  }, [
    schemes,
    selectedIncomeLimit,
    selectedCropType,
    selectedRegion,
    selectedDeadline,
  ]);

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

        {/* Filter Section */}
        <div className="mb-6 flex flex-wrap gap-4 justify-center">
          <Select
            onValueChange={(value) =>
              setSelectedIncomeLimit(value === "all" ? "" : value)
            }
            value={selectedIncomeLimit || "all"}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Income Limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {incomeOptions.map((income) => (
                <SelectItem key={income} value={income}>
                  {income === "None" ? "No income limit" : `₹${income}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              setSelectedCropType(value === "all" ? "" : value)
            }
            value={selectedCropType || "all"}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Crop Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"></SelectItem>
              {cropOptions.map((crop) => (
                <SelectItem key={crop} value={crop}>
                  {crop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              setSelectedRegion(value === "all" ? "" : value)
            }
            value={selectedRegion || "all"}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all"></SelectItem>
              {regionOptions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              setSelectedDeadline(value === "all" ? "" : value)
            }
            value={selectedDeadline || "all"}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {deadlineOptions.map((deadline) => (
                <SelectItem key={deadline} value={deadline}>
                  {deadline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.length === 0 ? (
            <p className="text-center col-span-3 text-muted-foreground">
              No schemes found.
            </p>
          ) : (
            filteredSchemes.map((scheme) => (
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
