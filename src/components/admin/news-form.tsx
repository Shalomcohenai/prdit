"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface News {
  id: number;
  headline: string;
  content: string;
  location: string;
}

export function NewsForm({
  news,
  onSubmit,
  onCancel,
}: {
  news: News | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  return (
    <form action={onSubmit} className="space-y-4">
      {news && <input type="hidden" name="id" value={news.id} />}
      <div className="space-y-2">
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" name="headline" defaultValue={news?.headline} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" rows={4} defaultValue={news?.content} required />
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Select name="location" defaultValue={news?.location || "Herzliya"}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Herzliya">Herzliya</SelectItem>
            <SelectItem value="San Francisco">San Francisco</SelectItem>
            <SelectItem value="Global">Global</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-3">
        <Button type="submit" variant="gradient">{news ? "Update" : "Create"} News</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
