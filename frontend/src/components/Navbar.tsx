import { useState, useEffect, useRef } from "react";
import {
  Menu,
  Leaf,
  User,
  Scale,
  Newspaper,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Home", href: "/", icon: Menu },
  { name: "Market Access", href: "/deals", icon: Leaf },
  { name: "Legal Actions", href: "/legal", icon: Scale },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Schemes", href: "/schemes", icon: AlertTriangle },
  { name: "AI Assistant", href: "/chat", icon: BarChart3 },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = () => {
    dispatch({ type: "SIGN_OUT" });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get initial from user's full name
  const getUserInitial = () => {
    if (!state.user || !state.user.name) return "";
    return state.user.name.charAt(0).toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center animate-glow">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-glow">FarmEazy</h1>
              <p className="text-xs text-muted-foreground">
                Smart India Hackathon
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all hover-lift ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden lg:flex items-center space-x-4 relative">
            {!state.isAuthenticated ? (
              <Link to="/signin">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold focus:outline-none"
                  aria-label="User menu"
                >
                  {getUserInitial()}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 rounded-lg bg-green-900 shadow-lg text-white z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-green-800"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 hover:bg-green-800"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 hover:bg-green-800"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-card">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all hover-lift ${
                        isActive(item.href)
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
                <div className="pt-4 border-t border-border">
                  {!state.isAuthenticated ? (
                    <Link to="/signin" onClick={() => setIsOpen(false)}>
                      <Button className="w-full" size="lg">
                        <User className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                  ) : (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={toggleDropdown}
                        className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center text-white font-bold focus:outline-none"
                        aria-label="User menu"
                      >
                        {getUserInitial()}
                      </button>
                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 rounded-lg bg-green-900 shadow-lg text-white z-50">
                          <Link
                            to="/profile"
                            className="block px-4 py-2 hover:bg-green-800"
                            onClick={() => {
                              setDropdownOpen(false);
                              setIsOpen(false);
                            }}
                          >
                            Profile
                          </Link>
                          <Link
                            to="/dashboard"
                            className="block px-4 py-2 hover:bg-green-800"
                            onClick={() => {
                              setDropdownOpen(false);
                              setIsOpen(false);
                            }}
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={() => {
                              handleSignOut();
                              setIsOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-green-800"
                          >
                            Sign Out
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
