import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Leaf, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { auth } from "@/lib/auth";
import { SignInData } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const DigiLockerLogo = () => (
    <img
      src="https://play-lh.googleusercontent.com/EqNJ0V0N0vzNKxdOl-Uz4OW5t8b4BhROYEKvQVqi1s1O_Ng2E_AobK1YB5hVFvpD5Yk"
      className="w-9 h-9 p-0 m-0 rounded-full"
    ></img>
  );

  const handleDigiLockerSignIn = () => {
    // This function will redirect the user to DigiLocker
    console.log("Redirecting to DigiLocker...");
    // window.location.href = '...your_digilocker_auth_url...';
  };

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await auth.signIn(data as SignInData);
      auth.setCurrentUser(user);
      dispatch({ type: "SET_USER", user });
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover "
      >
        <source src="/vidva.mp4" type="video/mp4" />
      </video>
      <div className="max-w-md mx-auto mt-4 p-3 backdrop-blur-sm border-none bg-[linear-gradient(to_right,#8aea00,#00ba18,#009613,#006c0d,#006c0d)] w-full rounded-3xl ">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/95  rounded-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Leaf className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to your Kerala AgriTech account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 ">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <button
              onClick={handleDigiLockerSignIn}
              className="w-full  my-2 flex items-center justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-[#007BFF] hover:bg-[#0069d9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056b3]"
            >
              <DigiLockerLogo />
              <span className="ml-3 text-md  text-white-500">DigiLocker</span>
            </button>

            <div className="my-4 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>

              <span className="mx-4 text-sm text-gray-500">
                Or with email and password
              </span>

              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-black">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...register("password")}
                    className={
                      errors.password ? "border-red-500 pr-10" : "pr-10"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign up
                </Link>
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Demo accounts:</p>
                <p>Admin: admin@keralaagritech.com / password</p>
                <p>Farmer: farmer@keralaagritech.com / password</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
