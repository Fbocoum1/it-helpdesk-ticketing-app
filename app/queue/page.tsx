"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Ticket {
  id: number;
  title: string;
  description: string;
  requesterEmail: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

export default function QueuePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      if (Array.isArray(data)) setTickets(data);
    } catch (err) {
      console.error("Failed to load tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdate = async (id: number, updates: { status?: string; priority?: string }) => {
    try {
      const res = await fetch("/api/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        setTickets((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
        );
        if (selectedTicket && selectedTicket.id === id) {
          setSelectedTicket((prev) => (prev ? { ...prev, ...updates } : null));
        }
      }
    } catch (err) {
      console.error("Failed to update ticket:", err);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to permanently delete this ticket?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/tickets?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTickets((prev) => prev.filter((t) => t.id !== id));
        if (selectedTicket && selectedTicket.id === id) {
          setSelectedTicket(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete ticket:", err);
    }
  };

  // Helper function to format ID as #TCK-001
  const formatTicketNumber = (id: number) => {
    return `#TCK-${String(id).padStart(3, "0")}`;
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    const searchLower = searchTerm.toLowerCase();
    const formattedId = formatTicketNumber(t.id).toLowerCase();
    const matchesSearch =
      t.title.toLowerCase().includes(searchLower) ||
      t.requesterEmail.toLowerCase().includes(searchLower) ||
      formattedId.includes(searchLower) ||
      String(t.id).includes(searchLower);
    return matchesStatus && matchesPriority && matchesSearch;
  });

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "32px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>
              IT Support Queue
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", margin: "4px 0 0 0" }}>
              Filter, search, inspect, and manage incoming tickets
            </p>
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link
              href="/submit"
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              + New Ticket
            </Link>
            <Link href="/" style={{ color: "#475569", textDecoration: "none", fontSize: "14px" }}>
              ← Home
            </Link>
          </div>
        </div>

        {/* Toolbar: Search & Filter Options */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px",
            alignItems: "center",
            backgroundColor: "#ffffff",
            padding: "14px 18px",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          {/* Live Search Input */}
          <div style={{ flex: "1 1 260px", display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="🔍 Search by ticket #, issue title, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#475569", marginRight: "8px" }}>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", backgroundColor: "#fff", cursor: "pointer" }}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#475569", marginRight: "8px" }}>Priority:</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ padding: "7px 12px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "14px", backgroundColor: "#fff", cursor: "pointer" }}
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        {/* Tickets Table */}
        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#64748b" }}>Loading queue...</div>
        ) : filteredTickets.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", color: "#64748b" }}>
            No tickets match your query.
          </div>
        ) : (
          <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9", borderBottom: "2px solid #e2e8f0", color: "#475569", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.05em" }}>
                  <th style={{ padding: "16px 20px" }}>Ticket #</th>
                  <th style={{ padding: "16px 20px" }}>Requester</th>
                  <th style={{ padding: "16px 20px" }}>Priority</th>
                  <th style={{ padding: "16px 20px" }}>Status</th>
                  <th style={{ padding: "16px 20px" }}>Created</th>
                  <th style={{ padding: "16px 20px", textAlign: "right" }}>Title</th>
                  <th style={{ padding: "16px 20px", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {/* Ticket Number */}
                    <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          fontFamily: "monospace",
                          fontWeight: 700,
                          color: "#2563eb",
                          backgroundColor: "#eff6ff",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "1px solid #dbeafe",
                          fontSize: "12px",
                        }}
                      >
                        {formatTicketNumber(ticket.id)}
                      </span>
                    </td>

                    {/* Requester */}
                    <td style={{ padding: "16px 20px", color: "#334155", fontWeight: 500, whiteSpace: "nowrap" }}>
                      {ticket.requesterEmail}
                    </td>

                    {/* Priority Selector */}
                    <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                      <select
                        value={ticket.priority}
                        onChange={(e) => handleUpdate(ticket.id, { priority: e.target.value })}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: 600,
                          border: "1px solid rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          backgroundColor:
                            ticket.priority === "High" || ticket.priority === "Urgent"
                              ? "#ffe4e6"
                              : ticket.priority === "Medium"
                              ? "#fef3c7"
                              : "#d1fae5",
                          color:
                            ticket.priority === "High" || ticket.priority === "Urgent"
                              ? "#9f1239"
                              : ticket.priority === "Medium"
                              ? "#92400e"
                              : "#065f46",
                        }}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </td>

                    {/* Status Selector */}
                    <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                      <select
                        value={ticket.status}
                        onChange={(e) => handleUpdate(ticket.id, { status: e.target.value })}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: 600,
                          border: "1px solid rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          backgroundColor: ticket.status === "Resolved" ? "#dcfce7" : "#e0f2fe",
                          color: ticket.status === "Resolved" ? "#166534" : "#0369a1",
                        }}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>

                    <td style={{ padding: "16px 20px", color: "#64748b", whiteSpace: "nowrap" }}>
                      {new Date(ticket.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Title */}
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        title="Click to view full ticket details"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#1e293b",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "underline",
                          textDecorationColor: "#cbd5e1",
                          fontSize: "14px",
                          padding: 0,
                        }}
                      >
                        {ticket.title}
                      </button>
                    </td>

                    {/* Action */}
                    <td style={{ padding: "16px 20px", textAlign: "center", whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => handleDelete(ticket.id)}
                        title="Delete ticket"
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #fca5a5",
                          color: "#ef4444",
                          borderRadius: "6px",
                          padding: "5px 10px",
                          fontSize: "12px",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Ticket Details Pop-up */}
        {selectedTicket && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(15, 23, 42, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 50,
              padding: "20px",
            }}
            onClick={() => setSelectedTicket(null)}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                maxWidth: "600px",
                width: "100%",
                padding: "28px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
                <div>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>
                    {formatTicketNumber(selectedTicket.id)} • {selectedTicket.category}
                  </span>
                  <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#0f172a", margin: "4px 0 0 0" }}>
                    {selectedTicket.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  style={{
                    border: "none",
                    background: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                    color: "#94a3b8",
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "4px" }}>
                  REQUESTER
                </div>
                <div style={{ fontSize: "14px", color: "#334155" }}>
                  {selectedTicket.requesterEmail}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", marginBottom: "4px" }}>
                  DESCRIPTION
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#1e293b",
                    backgroundColor: "#f8fafc",
                    padding: "14px",
                    borderRadius: "6px",
                    border: "1px solid #e2e8f0",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedTicket.description}
                </div>
              </div>

              <div style={{ display: "flex", gap: "24px", marginBottom: "24px", fontSize: "13px", color: "#475569" }}>
                <div><strong>Priority:</strong> {selectedTicket.priority}</div>
                <div><strong>Status:</strong> {selectedTicket.status}</div>
                <div><strong>Created:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setSelectedTicket(null)}
                  style={{
                    backgroundColor: "#0f172a",
                    color: "#ffffff",
                    border: "none",
                    padding: "8px 18px",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}