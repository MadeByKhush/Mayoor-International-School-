"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Loader from "../ui/Loader";
import { showToast } from "../ui/Toast";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    queriesToday: 0,
    banners: 0,
    events: 0,
    totalQueries: 0, // Added total
  });

  const loadStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Execute all queries in parallel for performance
      const [queriesTodayResult, bannersResult, eventsResult, totalQueriesResult] = await Promise.all([
        supabase
          .from("admission_enquiries")
          .select("*", { count: "exact", head: true }) // Use head:true for counts
          .gte("created_at", today.toISOString()),

        supabase
          .from("banners")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("recent_events")
          .select("*", { count: "exact", head: true }),

        supabase
          .from("admission_enquiries")
          .select("*", { count: "exact", head: true })
      ]);

      // Log errors but do not crash the dashboard
      if (queriesTodayResult.error) console.error("Error fetching today's queries:", queriesTodayResult.error);
      if (bannersResult.error) console.error("Error fetching banners count:", bannersResult.error);
      if (eventsResult.error) console.error("Error fetching events count:", eventsResult.error);
      if (totalQueriesResult.error) console.error("Error fetching total queries:", totalQueriesResult.error);

      setStats({
        queriesToday: queriesTodayResult.count || 0,
        banners: bannersResult.count || 0,
        events: eventsResult.count || 0,
        totalQueries: totalQueriesResult.count || 0,
      });

    } catch (error) {
      console.error("Error loading dashboard stats:", error);
      showToast.error("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader size="lg" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="bg-green-50 border border-green-200 p-6 rounded-xl mb-8">
        <h1 className="text-2xl font-semibold text-green-700">
          Welcome, Admin!
        </h1>
        <p className="text-gray-600 mt-1">
          Here is an overview of the Mayoor International School portal.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"> {/* Changed to 4 cols */}

        <div className="bg-white shadow-md p-6 rounded-xl border">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Enquiries</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {stats.totalQueries}
          </h2>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl border">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">New Today</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {stats.queriesToday}
          </h2>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl border">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Active Banners</p>
          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {stats.banners}
          </h2>
        </div>

        <div className="bg-white shadow-md p-6 rounded-xl border">
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Events</p>
          <h2 className="text-3xl font-bold text-purple-600 mt-2">
            {stats.events}
          </h2>
        </div>

      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div
          onClick={() => router.push("/admin/banners")}
          className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 group-hover:text-primary transition-colors">Manage Banners</h3>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-full">📷</span>
          </div>
          <p className="text-gray-500 text-sm">Add or edit homepage hero banners</p>
        </div>

        <div
          onClick={() => router.push("/admin/events")}
          className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 group-hover:text-primary transition-colors">Manage Events</h3>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-full">📅</span>
          </div>
          <p className="text-gray-500 text-sm">Update recent events and news</p>
        </div>

        <div
          onClick={() => router.push("/admin/queries")}
          className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 group-hover:text-primary transition-colors">Admission Queries</h3>
            <span className="p-2 bg-green-50 text-green-600 rounded-full">📝</span>
          </div>
          <p className="text-gray-500 text-sm">View and manage admission requests</p>
        </div>

      </div>
    </AdminLayout>
  );
}
