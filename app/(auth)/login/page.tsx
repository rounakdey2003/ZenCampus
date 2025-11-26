"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button, Input, Label, Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const slides = [
  {
    title: "Slot Scheduler",
    svg: (
      <svg viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="100%" height="100%" rx="20" fill="hsl(var(--muted))" />
        <g transform="translate(180,80)">
          <rect x="0" y="0" width="360" height="240" rx="16" fill="hsl(var(--card))" stroke="hsl(var(--border) / 0.6)" />
          <rect x="0" y="0" width="360" height="48" rx="12" fill="hsl(var(--primary))" />
          <text x="180" y="34" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="16" fontWeight="700">Slot Scheduler</text>
          <g transform="translate(24,72)" fill="hsl(var(--popover))">
            <rect x="0" y="0" width="72" height="40" rx="8" />
            <rect x="88" y="0" width="72" height="40" rx="8" />
            <rect x="176" y="0" width="72" height="40" rx="8" />
            <rect x="264" y="0" width="72" height="40" rx="8" />
          </g>
          <rect x="88" y="72" width="72" height="40" rx="8" fill="hsl(var(--primary))" />
        </g>
      </svg>
    ),
  },
  {
    title: "Laundry Booking",
    svg: (
      <svg viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="100%" height="100%" rx="20" fill="hsl(var(--muted))" />
        <g transform="translate(180,80)">
          <rect x="0" y="0" width="360" height="240" rx="16" fill="hsl(var(--card))" stroke="hsl(var(--border) / 0.6)" />
          <rect x="0" y="0" width="360" height="48" rx="12" fill="hsl(var(--primary))" />
          <text x="180" y="34" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="16" fontWeight="700">Laundry Booking</text>
          <g transform="translate(120,96)">
            <circle cx="60" cy="24" r="48" fill="hsl(var(--popover))" stroke="hsl(var(--border) / 0.6)" strokeWidth="6" />
            <circle cx="60" cy="24" r="18" fill="hsl(var(--primary))" />
          </g>
        </g>
      </svg>
    ),
  },
  {
    title: "Complaints & Cleaning",
    svg: (
      <svg viewBox="0 0 720 480" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="100%" height="100%" rx="20" fill="hsl(var(--muted))" />
        <g transform="translate(180,80)">
          <rect x="0" y="0" width="360" height="240" rx="16" fill="hsl(var(--card))" stroke="hsl(var(--border) / 0.6)" />
          <rect x="0" y="0" width="360" height="48" rx="12" fill="hsl(var(--primary))" />
          <text x="180" y="34" textAnchor="middle" fill="hsl(var(--primary-foreground))" fontSize="16" fontWeight="700">Complaints & Cleaning</text>
          <g transform="translate(64,84)">
            <rect x="0" y="0" width="128" height="160" rx="8" fill="hsl(var(--popover))" />
            <rect x="168" y="24" width="128" height="96" rx="8" fill="hsl(var(--popover))" />
            <path d="M300 160 L340 220" stroke="hsl(var(--primary))" strokeWidth="8" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    ),
  },
];

export default function LoginPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotUsn, setForgotUsn] = useState("");
  const [forgotMobile, setForgotMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usn, setUsn] = useState("");
  const [password, setPassword] = useState("");
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  useState(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        usn,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
        toast.error("Invalid credentials. Please try again.");
      } else if (result?.ok) {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    setAdminLoading(true);

    try {
      const result = await signIn("credentials", {
        usn: adminId,
        password: adminPassword,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (result?.error) {
        setAdminError("Invalid admin credentials. Please try again.");
        toast.error("Invalid admin credentials. Please try again.");
      } else if (result?.ok) {
        setShowAdminModal(false);
      }
    } catch (err) {
      setAdminError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
      console.error("Admin login error:", err);
    } finally {
      setAdminLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (forgotStep === 1) {
      setForgotError("");
      
      try {
        const response = await fetch("/api/users/" + forgotUsn.toUpperCase());
        const result = await response.json();

        if (!response.ok || !result.success) {
          setForgotError("User not found");
          setForgotLoading(false);
          return;
        }

        const user = result.data;
        if (user.mobile !== forgotMobile) {
          setForgotError("Mobile number does not match our records");
          setForgotLoading(false);
          return;
        }

        setForgotStep(2);
        setForgotError("");
      } catch (err) {
        setForgotError("Failed to verify credentials");
      } finally {
        setForgotLoading(false);
      }
    } else {
      if (newPassword !== confirmPassword) {
        return;
      }

      if (newPassword.length < 6) {
        setForgotError("Password must be at least 6 characters");
        return;
      }

      setForgotError("");
      setForgotLoading(true);

      try {
        const response = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usn: forgotUsn,
            mobile: forgotMobile,
            newPassword,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          setForgotError(result.error || "Failed to reset password");
          return;
        }

        toast.success("Password reset successfully! You can now login with your new password.");
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotUsn("");
        setForgotMobile("");
        setNewPassword("");
        setConfirmPassword("");
      } catch {
        toast.error("Failed to reset password");
      } finally {
        setForgotLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-7xl bg-card rounded-3xl shadow-sm border border-border/50 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="flex-1 bg-secondary/30 p-6 md:p-8 lg:p-16 flex flex-col items-center justify-center border-r border-border/50">
          {/* Illustration */}
          <div className="w-full max-w-2xl mb-8">
            <div className="relative h-[320px] lg:h-[480px]">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-800",
                    currentSlide === index ? "opacity-100" : "opacity-0"
                  )}
                >
                  {slide.svg}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
              ZenCampus
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 leading-relaxed">
              Book laundry, cleaners & complaints — instantly.
            </p>

            {/* Pagination */}
            <div className="flex gap-3 justify-center">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    currentSlide === index
                      ? "w-8 bg-primary"
                      : "w-2 bg-primary/20 hover:bg-primary/40"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-6 md:p-8 lg:p-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Welcome to <span className="text-primary">ZEN</span>
              </h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="usn">USN (College ID)</Label>
                <Input
                  id="usn"
                  type="text"
                  placeholder="e.g. 1RV17CS001"
                  value={usn}
                  onChange={(e) => setUsn(e.target.value)}
                  required
                  maxLength={16}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
              )}

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-primary font-semibold hover:text-primary-dark transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setShowAdminModal(true)}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 14a4 4 0 100-8 4 4 0 000 8z" />
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" />
                </svg>
                Admin Login
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal isOpen={showForgotModal} onClose={() => {
        setShowForgotModal(false);
        setForgotStep(1);
        setForgotError("");
        setForgotUsn("");
        setForgotMobile("");
        setNewPassword("");
        setConfirmPassword("");
      }}>
        <ModalHeader onClose={() => setShowForgotModal(false)}>
          Reset Password
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleForgotPassword} id="forgot-password-form" className="space-y-4">
            {forgotStep === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fp-usn">USN</Label>
                  <Input 
                    id="fp-usn" 
                    type="text" 
                    placeholder="Enter your USN"
                    value={forgotUsn}
                    onChange={(e) => setForgotUsn(e.target.value)}
                    required 
                    maxLength={16} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fp-mobile">Mobile number</Label>
                  <Input 
                    id="fp-mobile" 
                    type="tel" 
                    placeholder="10-digit mobile" 
                    value={forgotMobile}
                    onChange={(e) => setForgotMobile(e.target.value)}
                    required 
                    pattern="\d{10}" 
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="fp-new">New password</Label>
                  <Input 
                    id="fp-new" 
                    type="password" 
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required 
                    minLength={6} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fp-confirm">Confirm password</Label>
                  <Input 
                    id="fp-confirm" 
                    type="password" 
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required 
                    minLength={6} 
                  />
                </div>
              </>
            )}
            {forgotError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {forgotError}
              </div>
            )}
          </form>
        </ModalBody>
        <ModalFooter>
          {forgotStep === 2 && (
            <Button variant="outline" onClick={() => {
              setForgotStep(1);
              setForgotError("");
            }}>
              Back
            </Button>
          )}
          <Button 
            type="submit" 
            form="forgot-password-form"
            disabled={forgotLoading}
          >
            {forgotLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (forgotStep === 1 ? "Verify" : "Change password")}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Admin Modal */}
      <Modal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)}>
        <ModalHeader onClose={() => setShowAdminModal(false)}>
          Admin Login
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleAdminLogin} id="admin-login-form" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-id">Admin ID</Label>
              <Input 
                id="admin-id" 
                type="text" 
                placeholder="Enter admin ID" 
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input 
                id="admin-password" 
                type="password" 
                placeholder="Enter password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required 
              />
            </div>
            {adminError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                {adminError}
              </div>
            )}
          </form>
        </ModalBody>
        <ModalFooter>
          <Button 
            type="submit"
            form="admin-login-form"
            className="w-full" 
            disabled={adminLoading}
          >
            {adminLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Access Admin Panel"
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
