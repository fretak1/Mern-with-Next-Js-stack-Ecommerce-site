"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import logo from "../../../../public/images/logo1.png";
import { ArrowLeft, Store } from "lucide-react";



export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(formData.email, formData.password);
    if (success) {
      toast("Login Successful");
      const user = useAuthStore.getState().user;
      router.push(
        user?.role === "SUPER_ADMIN" ? "/super-admin/products/list" : "/home"
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4 bg-gray-100">
      <AnimatePresence mode="wait">
        <motion.div
          key="login-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          <Card className="shadow-xl border border-gray-200 bg-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Store className="h-20 w-20 text-blue-500 stroke-blue-500" />
              </div>
              <CardTitle className="font-headline text-2xl">
                Welcome Back
              </CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={formData.email}
                    onChange={handleOnChange}
                    className="bg-gray-100"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgotPassword"
                      className="ml-auto inline-block text-sm underline text-gray-600"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={formData.password}
                    onChange={handleOnChange}
                    className="bg-gray-100"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white hover:bg-blue-400"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="flex justify-between">
                <Link
                  className="mt-4 flex justify-between  text-center text-sm"
                  href="/home"
                >
                  <ArrowLeft className="h-4 w-4 mt-0.5 mr-1" />
                  <p>back to site</p>
                </Link>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="underline font-bold text-black hover:opacity-80"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
