import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="border-b pb-4">
          <h1 className="text-3xl font-bold text-slate-900">IT Help Desk Portal</h1>
          <p className="text-slate-600">Submit requests or manage the queue</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 bg-white rounded-lg border shadow-sm space-y-3">
            <h2 className="text-xl font-semibold text-slate-800">Submit a Ticket</h2>
            <p className="text-sm text-slate-600">
              Need technical assistance? Submit a ticket for automatic triage and support.
            </p>
            <Link
              href="/submit"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              New Request
            </Link>
          </div>

          <div className="p-6 bg-white rounded-lg border shadow-sm space-y-3">
            <h2 className="text-xl font-semibold text-slate-800">Agent Queue</h2>
            <p className="text-sm text-slate-600">
              Review incoming issues, inspect AI triage notes, and respond to users.
            </p>
            <Link
              href="/queue"
              className="inline-block px-4 py-2 bg-slate-800 text-white rounded-md font-medium hover:bg-slate-900"
            >
              View Queue
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}