"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart3, TrendingUp, Eye, Globe, FileText, Briefcase, Home, GitCompare, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAnalytics, type AnalyticsData, type AnalyticsPeriod } from "@/app/admin/actions";

const SECTION_LABELS: Record<string, { label: string; icon: typeof Home; color: string }> = {
  home: { label: "Home", icon: Home, color: "bg-blue-500" },
  products: { label: "Products", icon: Layers, color: "bg-purple-500" },
  "blog-index": { label: "Blog (Index)", icon: FileText, color: "bg-emerald-500" },
  blog: { label: "Blog Articles", icon: FileText, color: "bg-green-500" },
  careers: { label: "Careers", icon: Briefcase, color: "bg-amber-500" },
  compare: { label: "Comparisons", icon: GitCompare, color: "bg-cyan-500" },
  other: { label: "Other", icon: Globe, color: "bg-neutral-500" },
};

const PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
  day: "Today",
  week: "This Week",
  month: "This Month",
};

function MiniBar({ points, maxVal }: { points: { label: string; count: number }[]; maxVal: number }) {
  const barMax = maxVal || 1;
  return (
    <div className="flex items-end gap-px" style={{ height: 120 }}>
      {points.map((p, i) => (
        <div key={i} className="group relative flex flex-1 flex-col items-center justify-end" style={{ height: "100%" }}>
          <div
            className="w-full rounded-t bg-gradient-to-t from-blue-600 to-blue-400 transition-all group-hover:from-blue-500 group-hover:to-blue-300"
            style={{
              height: `${Math.max((p.count / barMax) * 100, p.count > 0 ? 4 : 0)}%`,
              minHeight: p.count > 0 ? 2 : 0,
            }}
          />
          <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded bg-neutral-800 px-2 py-1 text-[10px] text-white shadow-lg group-hover:block">
            {p.label}: {p.count}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartLabels({ points, period }: { points: { label: string }[]; period: AnalyticsPeriod }) {
  if (period === "day") {
    const show = [0, 6, 12, 18, 23];
    return (
      <div className="mt-1 flex justify-between text-[10px] text-neutral-500">
        {show.map((i) => (
          <span key={i}>{points[i]?.label}</span>
        ))}
      </div>
    );
  }

  if (period === "week") {
    return (
      <div className="mt-1 flex justify-between text-[10px] text-neutral-500">
        {points.map((p, i) => (
          <span key={i}>{p.label}</span>
        ))}
      </div>
    );
  }

  const step = Math.max(1, Math.floor(points.length / 6));
  return (
    <div className="mt-1 flex justify-between text-[10px] text-neutral-500">
      {points.filter((_, i) => i % step === 0 || i === points.length - 1).map((p, i) => (
        <span key={i}>{p.label}</span>
      ))}
    </div>
  );
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState<AnalyticsPeriod>("day");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p: AnalyticsPeriod) => {
    setLoading(true);
    try {
      const result = await getAnalytics(p);
      setData(result);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(period);
  }, [period, load]);

  const maxTimeSeries = data ? Math.max(...data.timeSeries.map((p) => p.count), 1) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Site Analytics</h2>
        </div>
        <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          {(["day", "week", "month"] as AnalyticsPeriod[]).map((p) => (
            <Button
              key={p}
              variant="ghost"
              size="sm"
              onClick={() => setPeriod(p)}
              className={`h-7 px-3 text-xs ${
                period === p
                  ? "bg-white/10 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {PERIOD_LABELS[p]}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
        </div>
      ) : !data ? (
        <div className="py-12 text-center text-neutral-500">Failed to load analytics.</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Eye className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{data.totalViews.toLocaleString()}</p>
                  <p className="text-xs text-neutral-500">Total Views</p>
                </div>
              </CardContent>
            </Card>

            {["blog", "careers", "products"].map((sec) => {
              const stat = data.sectionBreakdown.find((s) => s.section === sec);
              const meta = SECTION_LABELS[sec];
              const Icon = meta?.icon || Globe;
              return (
                <Card key={sec}>
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta?.color || "bg-neutral-500"}/10`}>
                      <Icon className={`h-5 w-5 ${meta?.color?.replace("bg-", "text-") || "text-neutral-400"}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{(stat?.count || 0).toLocaleString()}</p>
                      <p className="text-xs text-neutral-500">{meta?.label || sec}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Time Series Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm text-neutral-400">
                <TrendingUp className="h-4 w-4" />
                Traffic Over Time — {PERIOD_LABELS[period]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.totalViews === 0 ? (
                <div className="flex items-center justify-center py-12 text-sm text-neutral-500">
                  No views recorded yet for this period.
                </div>
              ) : (
                <div>
                  <MiniBar points={data.timeSeries} maxVal={maxTimeSeries} />
                  <ChartLabels points={data.timeSeries} period={period} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section Breakdown + Top Pages */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* By Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-neutral-400">Views by Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {data.sectionBreakdown.length === 0 ? (
                  <p className="text-sm text-neutral-500">No data yet.</p>
                ) : (
                  data.sectionBreakdown.map((s) => {
                    const meta = SECTION_LABELS[s.section];
                    const pct = data.totalViews > 0 ? Math.round((s.count / data.totalViews) * 100) : 0;
                    return (
                      <div key={s.section} className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${meta?.color || "bg-neutral-500"}`} />
                        <span className="min-w-[100px] text-sm text-neutral-300">{meta?.label || s.section}</span>
                        <div className="flex-1">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                            <div
                              className={`h-full rounded-full ${meta?.color || "bg-neutral-500"} transition-all`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                        <span className="min-w-[50px] text-right text-sm font-medium text-white">{s.count}</span>
                        <span className="min-w-[35px] text-right text-xs text-neutral-500">{pct}%</span>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-neutral-400">Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                {data.topPages.length === 0 ? (
                  <p className="text-sm text-neutral-500">No data yet.</p>
                ) : (
                  <div className="space-y-2">
                    {data.topPages.slice(0, 10).map((page, i) => {
                      const meta = SECTION_LABELS[page.section];
                      return (
                        <div key={page.path} className="flex items-center gap-2">
                          <span className="w-5 text-right text-xs text-neutral-600">{i + 1}</span>
                          <Badge variant="secondary" className="shrink-0 text-[9px]">
                            {meta?.label || page.section}
                          </Badge>
                          <span className="min-w-0 flex-1 truncate text-sm text-neutral-300">{page.path}</span>
                          <span className="shrink-0 text-sm font-medium text-white">{page.count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
