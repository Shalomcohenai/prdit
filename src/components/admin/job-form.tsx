"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  active: boolean;
}

export function JobForm({
  job,
  onSubmit,
  onCancel,
}: {
  job: Job | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  return (
    <form action={onSubmit} className="space-y-4">
      {job && <input type="hidden" name="id" value={job.id} />}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input id="title" name="title" defaultValue={job?.title} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input id="department" name="department" defaultValue={job?.department} required />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Location</Label>
          <Select name="location" defaultValue={job?.location || "Herzliya"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Herzliya">Herzliya, Israel</SelectItem>
              <SelectItem value="San Francisco">San Francisco, USA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {job && (
          <div className="space-y-2">
            <Label>Status</Label>
            <Select name="active" defaultValue={job.active ? "true" : "false"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={job?.description} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea id="requirements" name="requirements" rows={4} defaultValue={job?.requirements} required />
      </div>
      <div className="flex gap-3">
        <Button type="submit" variant="gradient">{job ? "Update" : "Create"} Job</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
