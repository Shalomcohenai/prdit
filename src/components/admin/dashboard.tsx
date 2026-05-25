"use client";

import { useState } from "react";
import { LogOut, Plus, Pencil, Trash2, FileText, Newspaper, Briefcase, Inbox, Mail, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostForm } from "./post-form";
import { NewsForm } from "./news-form";
import { JobForm } from "./job-form";
import {
  createPost, updatePost, deletePost,
  createNews, updateNews, deleteNews,
  createJob, updateJob, deleteJob,
  markInquiryRead, deleteInquiry,
} from "@/app/admin/actions";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  targetProductCta: string;
  publishedAt: string;
}

interface News {
  id: number;
  headline: string;
  content: string;
  location: string;
  datePosted: string;
}

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string;
  active: boolean;
  createdAt: string;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  message: string;
  type: string;
  jobTitle: string | null;
  resume: string | null;
  read: boolean;
  createdAt: string;
}

interface Props {
  posts: Post[];
  news: News[];
  jobs: Job[];
  inquiries: Inquiry[];
  logoutAction: () => Promise<void>;
}

export function AdminDashboard({ posts, news, jobs, inquiries, logoutAction }: Props) {
  const unreadCount = inquiries.filter((i) => !i.read).length;
  const [expandedInquiry, setExpandedInquiry] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);

  return (
    <div className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
            <p className="mt-1 text-neutral-400">Manage blog posts, news, and job openings.</p>
          </div>
          <form action={logoutAction}>
            <Button variant="outline" size="sm" type="submit">
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </form>
        </div>

        <Tabs defaultValue="posts">
          <TabsList className="mb-8">
            <TabsTrigger value="posts" className="gap-2">
              <FileText className="h-4 w-4" /> Posts ({posts.length})
            </TabsTrigger>
            <TabsTrigger value="news" className="gap-2">
              <Newspaper className="h-4 w-4" /> News ({news.length})
            </TabsTrigger>
            <TabsTrigger value="jobs" className="gap-2">
              <Briefcase className="h-4 w-4" /> Jobs ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="gap-2">
              <Inbox className="h-4 w-4" /> Inquiries ({inquiries.length})
              {unreadCount > 0 && (
                <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts">
            <div className="mb-4 flex justify-end">
              <Button
                onClick={() => { setShowPostForm(true); setEditingPost(null); }}
                variant="gradient"
                size="sm"
              >
                <Plus className="h-4 w-4" /> New Post
              </Button>
            </div>

            {(showPostForm || editingPost) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    {editingPost ? "Edit Post" : "New Post"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PostForm
                    post={editingPost}
                    onSubmit={editingPost ? updatePost : createPost}
                    onCancel={() => { setShowPostForm(false); setEditingPost(null); }}
                  />
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {posts.map((post) => (
                <Card key={post.id} className="transition-all hover:border-white/20">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-white">{post.title}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                        <Badge variant="secondary" className="text-[10px]">{post.category}</Badge>
                        <span>/blog/{post.slug}</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditingPost(post); setShowPostForm(false); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <form action={deletePost}>
                        <input type="hidden" name="id" value={post.id} />
                        <Button variant="ghost" size="icon" type="submit" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news">
            <div className="mb-4 flex justify-end">
              <Button
                onClick={() => { setShowNewsForm(true); setEditingNews(null); }}
                variant="gradient"
                size="sm"
              >
                <Plus className="h-4 w-4" /> New Item
              </Button>
            </div>

            {(showNewsForm || editingNews) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    {editingNews ? "Edit News" : "New News Item"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NewsForm
                    news={editingNews}
                    onSubmit={editingNews ? updateNews : createNews}
                    onCancel={() => { setShowNewsForm(false); setEditingNews(null); }}
                  />
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {news.map((item) => (
                <Card key={item.id} className="transition-all hover:border-white/20">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-white">{item.headline}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                        <Badge variant="secondary" className="text-[10px]">{item.location}</Badge>
                        <span>{new Date(item.datePosted).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditingNews(item); setShowNewsForm(false); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <form action={deleteNews}>
                        <input type="hidden" name="id" value={item.id} />
                        <Button variant="ghost" size="icon" type="submit" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <div className="mb-4 flex justify-end">
              <Button
                onClick={() => { setShowJobForm(true); setEditingJob(null); }}
                variant="gradient"
                size="sm"
              >
                <Plus className="h-4 w-4" /> New Opening
              </Button>
            </div>

            {(showJobForm || editingJob) && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    {editingJob ? "Edit Job" : "New Job Opening"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <JobForm
                    job={editingJob}
                    onSubmit={editingJob ? updateJob : createJob}
                    onCancel={() => { setShowJobForm(false); setEditingJob(null); }}
                  />
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              {jobs.map((job) => (
                <Card key={job.id} className="transition-all hover:border-white/20">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-white">{job.title}</h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                        <Badge variant="secondary" className="text-[10px]">{job.department}</Badge>
                        <Badge variant="outline" className="text-[10px]">{job.location}</Badge>
                        {!job.active && <Badge variant="destructive" className="text-[10px]">Inactive</Badge>}
                      </div>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditingJob(job); setShowJobForm(false); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <form action={deleteJob}>
                        <input type="hidden" name="id" value={job.id} />
                        <Button variant="ghost" size="icon" type="submit" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <div className="space-y-3">
              {inquiries.length === 0 && (
                <div className="py-12 text-center text-neutral-500">
                  No inquiries yet.
                </div>
              )}
              {inquiries.map((inquiry) => (
                <Card
                  key={inquiry.id}
                  className={`transition-all hover:border-white/20 ${!inquiry.read ? "border-blue-500/20 bg-blue-500/5" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-white">{inquiry.name}</h3>
                          {!inquiry.read && (
                            <Badge className="bg-blue-500 text-[10px] text-white">New</Badge>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {inquiry.email}
                          </span>
                          <Badge variant="secondary" className="text-[10px]">
                            {inquiry.type === "application" ? "Job Application" : "General"}
                          </Badge>
                          {inquiry.jobTitle && (
                            <Badge variant="outline" className="text-[10px]">
                              {inquiry.jobTitle}
                            </Badge>
                          )}
                          <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                        </div>

                        {expandedInquiry === inquiry.id ? (
                          <div className="mt-4 space-y-3">
                            <div>
                              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">Message</h4>
                              <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                                {inquiry.message}
                              </p>
                            </div>
                            {inquiry.resume && (
                              <div>
                                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-neutral-500">Resume / CV</h4>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-400">
                                  {inquiry.resume}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="mt-2 truncate text-sm text-neutral-400">
                            {inquiry.message}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setExpandedInquiry(
                              expandedInquiry === inquiry.id ? null : inquiry.id
                            )
                          }
                          title="Expand"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {!inquiry.read && (
                          <form action={markInquiryRead}>
                            <input type="hidden" name="id" value={inquiry.id} />
                            <Button variant="ghost" size="icon" type="submit" title="Mark as read">
                              <User className="h-4 w-4 text-blue-400" />
                            </Button>
                          </form>
                        )}
                        <form action={deleteInquiry}>
                          <input type="hidden" name="id" value={inquiry.id} />
                          <Button variant="ghost" size="icon" type="submit" className="text-red-400 hover:text-red-300" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
