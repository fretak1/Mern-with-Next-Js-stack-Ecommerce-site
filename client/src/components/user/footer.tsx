import Link from "next/link";
import { Store } from "lucide-react";
import { FaTelegramPlane, FaInstagram, FaTiktok } from "react-icons/fa";
import { useState } from "react";
import { useMessageStore } from "@/store/useMessageStore";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useProductStore } from "@/store/useProductStore";

export function Footer() {
  const {
    sendComment,
    isSending,
    success: commentSuccess,
    error: commentError,
  } = useMessageStore();

  const { subscribeEmail, newsletterLoading } = useProductStore();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Handle newsletter subscription
  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    try {
      setLoading(true);
      setSuccess("");
      setError("");

      const result = await subscribeEmail(email);

      if (result.success) {
        setSuccess(result.message);
        toast.success(result.message);
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
      setEmail("");
    }
  };

  // Handle comment form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendComment(form.name, form.email, form.message);
    setForm({ name: "", email: "", message: "" });
    if (commentSuccess) toast(commentSuccess);
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
          {/* 1. Socials/Branding Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Store className="h-8 w-8 text-blue-500 stroke-blue-500" />
              <p className="font-bold text-lg">EthioMarket</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Modern e-commerce for modern living.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="https://t.me/EthioMarket41"
                className="text-muted-foreground flex items-center gap-4 hover:text-blue-500"
              >
                <FaTelegramPlane className="text-blue-500 text-3xl hover:text-blue-600 cursor-pointer transition-colors" />
                <p>Telegram</p>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground flex items-center gap-4 hover:text-pink-600"
              >
                <FaInstagram className="text-pink-500 text-3xl hover:text-pink-600 cursor-pointer transition-colors" />
                <p>Instagram</p>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground flex items-center gap-4 hover:text-gray-900"
              >
                <FaTiktok className="text-gray-800 text-3xl hover:text-gray-900 cursor-pointer transition-colors" />
                <p>Tiktok</p>
              </Link>
            </div>
          </div>

          {/* 2. Leave a Comment Section */}
          <div className="space-y-4">
            <h3 className="font-bold mb-4">Leave a Comment</h3>
            <p className="text-sm text-muted-foreground">
              Share your feedback or suggestions with us.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-md p-2"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded-md p-2"
              />
              <textarea
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border h-30 rounded-md p-2"
              />
              <Button
                type="submit"
                variant="default"
                className="w-full !bg-blue-500 hover:!bg-blue-400 text-white transition-colors"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Submit Comment"}
              </Button>
            </form>
          </div>

          {/* 3. Subscribe Section */}
          <div className="space-y-4">
            <h3 className="font-bold">Subscribe to our newsletter</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest product updates.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || newsletterLoading}
              />
              <button
                onClick={handleSubscribe}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  loading || newsletterLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-400"
                }`}
                disabled={loading || newsletterLoading}
              >
                {loading || newsletterLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
            {success && <p className="text-blue-500 text-sm mt-1">{success}</p>}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} EthioMarket, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
