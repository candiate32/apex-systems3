import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface AdminLoginFormData {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { loginAdmin, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit } = useForm<AdminLoginFormData>();

  // Redirect if already authenticated as admin
  if (isAdmin) {
    navigate("/admin");
    return null;
  }

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    try {
      const success = await loginAdmin(data.email, data.password);
      if (success) {
        toast.success("Admin Login Successful!", {
          description: "Welcome to the control panel.",
        });
        navigate("/admin");
      } else {
        toast.error("Login Failed", {
          description: "Invalid admin credentials.",
        });
      }
    } catch (error) {
      toast.error("Login Failed", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-slide-up">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
              <Shield className="w-8 h-8 text-destructive" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-destructive drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
            Admin Portal
          </h1>
          <p className="text-muted-foreground">Enter your admin credentials to continue</p>
        </div>

        <div className="glass-card p-8 rounded-xl border-destructive/30">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@sportsync.com"
                {...register("email", { required: true })}
                className="border-destructive/30 focus:border-destructive"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: true })}
                className="border-destructive/30 focus:border-destructive"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground border border-destructive smooth-transition hover:scale-105 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
              disabled={isLoading}
            >
              {isLoading ? (
                "Authenticating..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login as Admin
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Demo credentials: admin@sportsync.com / admin123
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
