'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Tag
} from 'lucide-react';
import { Locale } from '@/lib/i18n/translations';
import { useManagedContent } from '@/hooks/useManagedContent';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
}

interface BlogData {
  title: string;
  subtitle: string;
  posts: BlogPost[];
}

interface BlogPageContentProps {
  locale: string;
}

export function BlogPageContent({ locale }: BlogPageContentProps) {
  const loc = locale as Locale;
  const { data: blogData } = useManagedContent<BlogData>('blog', loc, {
    title: loc === 'zh-Hans' ? '博客' : 'Blog',
    subtitle: loc === 'zh-Hans' ? 'AI 创业洞察与行业分析' : 'AI Startup Insights & Industry Analysis',
    posts: []
  });

  const [activeCategory, setActiveCategory] = useState(loc === 'zh-Hans' ? '全部' : 'All');

  const posts = blogData.posts || [];
  const allLabel = loc === 'zh-Hans' ? '全部' : 'All';
  const categories = [allLabel, ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = activeCategory === allLabel
    ? posts
    : posts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0F1117] py-12 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-[#6366F1]" />
            <h1 className="text-3xl font-bold text-[#F1F5F9]">{blogData.title}</h1>
          </div>
          <p className="text-[#94A3B8]">{blogData.subtitle}</p>
        </div>

        {/* Category Filter */}
        {posts.length > 0 && (
          <div className="flex gap-2 mb-8 flex-wrap justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                className={activeCategory === category
                  ? 'bg-[#6366F1] hover:bg-[#6366F1]/80'
                  : 'border-[#2D3348] text-[#94A3B8] hover:text-[#F1F5F9]'
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Posts List */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="bg-[#1A1D27] border-[#2D3348] hover:border-[#6366F1] transition-colors cursor-pointer group">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-[#6366F1]/20 text-[#6366F1]">
                          <Tag className="w-3 h-3 mr-1" />
                          {post.category}
                        </Badge>
                      </div>
                      <h2 className="text-xl font-semibold text-[#F1F5F9] mb-2 group-hover:text-[#6366F1] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-[#94A3B8] mb-4">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-sm text-[#94A3B8]">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </div>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#6366F1] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-[#1A1D27] border-[#2D3348]">
            <CardContent className="pt-12 pb-12 text-center">
              <BookOpen className="w-12 h-12 text-[#94A3B8] mx-auto mb-4 opacity-50" />
              <p className="text-[#94A3B8]">{loc === 'zh-Hans' ? '暂无文章' : 'No posts yet'}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
