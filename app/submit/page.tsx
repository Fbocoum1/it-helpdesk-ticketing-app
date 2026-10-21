"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SubmitTicketPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    requesterEmail: "",
    description: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit ticket");
      }

      // Success: redirect back to home or queue
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Submit IT Ticket</h1>
            <p className="text-sm text-slate-600">Please provide details about your issue.</p>
          </div>
          <Link
            href="/"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Your Email Address
            </label>
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={formData.requesterEmail}
              onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Issue Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cannot connect to office VPN"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              required
              rows={4}
              placeholder="Explain the problem and any error codes you see..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </main>
  );
}