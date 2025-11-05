"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordStepper() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  const { sendResetCode, verifyResetCode, resetPassword, isLoading } =
    useAuthStore();

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    const success = await sendResetCode(email);
    if (success) setStep(2);
  };

  const handleVerifyCode = async () => {
    if (!code.trim()) {
      toast.error("Enter the code");
      return;
    }
    const success = await verifyResetCode(email, code);
    if (success) setStep(3);
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const success = await resetPassword(email, newPassword);
    if (success) {
      toast.success("Password reset successful — you can now log in!");
      setStep(1);
      setEmail("");
      setCode("");
      setNewPassword("");
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          {step === 1
            ? "Forgot Password"
            : step === 2
            ? "Verify Code"
            : "Reset Password"}
        </h2>

        {/* Step 1: Send reset code */}
        {step === 1 && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Enter the email associated with your account. We&apos;ll send a 6-digit
              code.
            </p>
            <Input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 bg-gray-100"
            />
            <div className="flex gap-2">
              <Button
                className="bg-blue-500 hover:bg-blue-400"
                onClick={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Code"}
              </Button>
            </div>
          </>
        )}

        {/* Step 2: Verify code */}
        {step === 2 && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit code sent to <strong>{email}</strong>.
            </p>
            <Input
              placeholder="6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mb-4 bg-gray-100"
            />
            <div className="flex gap-2">
              <Button
                className="bg-blue-500 hover:bg-blue-400"
                onClick={handleVerifyCode}
                disabled={isLoading}
              >
                Verify Code
              </Button>
              <Button
                variant="outline"
                onClick={handleSendCode} // ✅ call the resend code function
                disabled={isLoading}
                // className="bg-blue-500 hover:bg-blue-400"
              >
                Resend Code
              </Button>
            </div>
          </>
        )}

        {/* Step 3: Reset password */}
        {step === 3 && (
          <>
            <p className="text-sm text-gray-600 mb-4">
              Set a new password for <strong>{email}</strong>.
            </p>
            <Input
              placeholder="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mb-4 bg-gray-100"
            />
            <div className="flex gap-2">
              <Button
                className="bg-blue-500 hover:bg-blue-400"
                onClick={handleResetPassword}
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
