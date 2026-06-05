import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { getActiveJobs } from "@/utils/content";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { JsonLd, generateJobPostingSchema } from "@/utils/seo";
import { FadeInClient } from "@/components/home-animations";
import { CareersFilter } from "@/components/careers-filter";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join prd.it - we're hiring engineers in Herzliya, Israel and growth roles in San Francisco, USA. Build the future of AI-powered developer tools.",
  alternates: {
    canonical: "/careers",
  },
};

export default function CareersPage() {
  const jobs = getActiveJobs();

  const jobsForSchema = jobs.map((job) => ({
    title: job.title,
    description: job.description,
    location: job.location.split(",")[0],
    department: job.department,
    createdAt: new Date(),
  }));

  return (
    <>
      {jobsForSchema.map((job, i) => (
        <JsonLd key={i} data={generateJobPostingSchema(job)} />
      ))}

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <FadeInClient>
            <div className="text-center">
              <Badge variant="outline" className="mb-4">
                We&apos;re Hiring
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Build the Future With Us
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
                Join a team of engineers, researchers, and builders shaping the next
                generation of AI-powered developer tools.
              </p>
            </div>
          </FadeInClient>

          <FadeInClient delay={0.1}>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardHeader className="flex-row items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Building2 className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-white">Herzliya, Israel</CardTitle>
                    <p className="text-sm text-neutral-400">R&D Headquarters</p>
                  </div>
                </CardHeader>
              </Card>
              <Card className="border-purple-500/20 bg-purple-500/5">
                <CardHeader className="flex-row items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                    <Building2 className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-white">San Francisco, USA</CardTitle>
                    <p className="text-sm text-neutral-400">Growth & Marketing</p>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </FadeInClient>

          <CareersFilter jobs={jobs} />
        </div>
      </section>

      {/* General Contact Section */}
      <section className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-2xl px-6">
          <FadeInClient>
            <div className="mb-8 text-center">
              <Badge variant="outline" className="mb-4">Contact Us</Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Don&apos;t See the Right Role?
              </h2>
              <p className="mt-4 text-neutral-400">
                We&apos;re always looking for exceptional people. Send us a message
                and tell us how you&apos;d like to contribute.
              </p>
            </div>
            <ContactForm type="general" />
          </FadeInClient>
        </div>
      </section>
    </>
  );
}
