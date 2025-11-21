import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogIn, UserPlus, Building2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockClubs } from "@/lib/mockData";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  clubId?: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("login");

  const loginForm = useForm<LoginFormData>();
  const registerForm = useForm<RegisterFormData>();

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success("Login Successful!", {
          description: "Welcome back!",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error("Login Failed", {
        description: "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Password Mismatch", {
        description: "Passwords do not match.",
      });
      return;
    }

    if (data.phone.length !== 10) {
      toast.error("Invalid Phone Number", {
        description: "Phone number must be exactly 10 digits.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const clubData = data.clubId ? mockClubs.find((c) => c.id === data.clubId) : null;
      const success = await register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        clubId: data.clubId,
        clubName: clubData?.name,
        password: data.password,
      });

      if (success) {
        toast.success("Registration Successful!", {
          description: "Your account has been created.",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error("Registration Failed", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-3 glow-text">Welcome</h1>
        <p className="text-muted-foreground">Sign in to your account or create a new one</p>
      </div>

      <div className="glass-card p-8 rounded-xl">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  {...loginForm.register("email", { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...loginForm.register("password", { required: true })}
                />
              </div>

              <Button
                type="submit"
                className="w-full neon-border smooth-transition hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Logging in..."
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  {...registerForm.register("name", { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">Email *</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="your@email.com"
                  {...registerForm.register("email", { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="10-digit number"
                  maxLength={10}
                  {...registerForm.register("phone", { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clubId">Select Your Club (Optional)</Label>
                <Select onValueChange={(value) => registerForm.setValue("clubId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a club" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClubs.map((club) => (
                      <SelectItem key={club.id} value={club.id}>
                        {club.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-3 h-3" />
                  Or{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/create-club")}
                    className="text-primary hover:underline"
                  >
                    create your own club
                  </button>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">Password *</Label>
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="••••••••"
                  {...registerForm.register("password", { required: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...registerForm.register("confirmPassword", { required: true })}
                />
              </div>

              <Button
                type="submit"
                className="w-full neon-border smooth-transition hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Creating Account..."
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
