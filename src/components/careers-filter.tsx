"use client";

import { useState } from "react";
import { MapPin, Briefcase, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ContactForm } from "@/components/contact-form";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  active: boolean;
}

const filters = ["All", "Herzliya, Israel", "San Francisco, USA"] as const;

export function CareersFilter({ jobs }: { jobs: Job[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [applyingTo, setApplyingTo] = useState<string | null>(null);

  const filtered =
    activeFilter === "All"
      ? jobs
      : jobs.filter((j) => j.location === activeFilter);

  return (
    <div className="mt-12">
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeFilter === f
                ? "bg-white text-black"
                : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((job) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="transition-all duration-300 hover:border-white/20">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl text-white">
                        {job.title}
                      </CardTitle>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          {job.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.location}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        job.location.startsWith("Herzliya")
                          ? "border-blue-500/30 text-blue-400"
                          : "border-purple-500/30 text-purple-400"
                      )}
                    >
                      {job.location.startsWith("Herzliya") ? "Israel" : "USA"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm leading-relaxed text-neutral-400">
                    {job.description}
                  </p>
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold text-neutral-300">
                      Requirements
                    </h4>
                    <p className="text-sm leading-relaxed text-neutral-500">
                      {job.requirements}
                    </p>
                  </div>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() =>
                      setApplyingTo(applyingTo === job.title ? null : job.title)
                    }
                  >
                    <Send className="h-3.5 w-3.5" />
                    {applyingTo === job.title ? "Close" : "Apply Now"}
                  </Button>

                  <AnimatePresence>
                    {applyingTo === job.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-6">
                          <ContactForm type="application" jobTitle={job.title} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
