"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import { useNewsletterStore } from "@/store/useNewsletterStore";
import { Button } from "@/components/ui/button";

export default function NewsletterPage() {
  const { subscribers, fetchSubscribers, deleteSubscriber, isLoading } =
    useNewsletterStore();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const confirmDelete = (email: string) => {
    setSelectedEmail(email);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!selectedEmail) return;
    const success = await deleteSubscriber(selectedEmail);
    if (success) toast.success("Subscriber removed!");
    else toast.error("Failed to delete subscriber.");
    setShowDeleteDialog(false);
    setSelectedEmail(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <p>No subscribers yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscribed At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((sub, index) => (
                  <TableRow key={sub.email}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{sub.email}</TableCell>
                    <TableCell>
                      {new Date(sub.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(sub.email)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Confirm Deletion
              </h3>
              <button onClick={() => setShowDeleteDialog(false)}>
                <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this subscriber? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
