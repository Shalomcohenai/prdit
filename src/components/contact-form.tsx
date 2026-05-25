"use client";

import { useActionState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { submitInquiry } from "@/app/admin/actions";

interface ContactFormProps {
  type?: "general" | "application";
  jobTitle?: string;
}

export function ContactForm({ type = "general", jobTitle }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { success: boolean } | null, formData: FormData) => {
      const result = await submitInquiry(formData);
      return result ?? null;
    },
    null
  );

  if (state?.success) {
    return (
      <Card className="border-green-500/20 bg-green-500/5">
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <CheckCircle className="h-10 w-10 text-green-500" />
          <h3 className="text-lg font-semibold text-white">
            {type === "application" ? "Application Sent" : "Message Sent"}
          </h3>
          <p className="text-sm text-neutral-400">
            {type === "application"
              ? "Thank you for your interest. We'll review your application and get back to you soon."
              : "Thank you for reaching out. We'll get back to you shortly."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-white">
          {type === "application" ? "Apply for This Position" : "Get in Touch"}
        </CardTitle>
        <CardDescription>
          {type === "application"
            ? "Send us your details and we'll be in touch."
            : "Have a question or want to collaborate? Drop us a message."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="type" value={type} />
          {jobTitle && <input type="hidden" name="jobTitle" value={jobTitle} />}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Your name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              {type === "application" ? "Cover Letter / Message" : "Message"}
            </Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              placeholder={
                type === "application"
                  ? "Tell us about yourself, your experience, and why you're interested..."
                  : "How can we help?"
              }
              required
            />
          </div>

          {type === "application" && (
            <div className="space-y-2">
              <Label htmlFor="resume">Resume / CV (paste text or LinkedIn URL)</Label>
              <Textarea
                id="resume"
                name="resume"
                rows={3}
                placeholder="Paste your resume text, LinkedIn profile URL, or relevant links..."
              />
            </div>
          )}

          <Button type="submit" variant="gradient" disabled={pending} className="w-full sm:w-auto">
            {pending ? "Sending..." : type === "application" ? "Submit Application" : "Send Message"}
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
