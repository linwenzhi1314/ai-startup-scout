'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Calendar,
  User,
  ArrowRight,
  Tag
} from 'lucide-react';
import { Translation } from '@/lib/i18n/translations';

interface BlogPageContentProps {
  translation: Translation;
  locale: string;
}

export function BlogPageContent({ translation, locale }: BlogPageContentProps) {
  const t = translation.blog;
  const [activeCategory, setActiveCategory] = useState('全部');

  // Mock posts - will be replaced with real data from database/CMS
  const mockPosts = [
    {
      id: 1,
      title: '2024年AI创业趋势分析',
      excerpt: '深入分析当前AI创业市场的热点领域和投资趋势...',
      category: '行业分析',
      author: '张明',
      date: '2024-06-15',
      readTime: '8分钟'
    },
    {
      id: 2,
      title: '新功能发布：AI深度分析报告',
      excerpt: '我们推出了全新的AI深度分析功能，帮助用户获取更全面的项目洞察...',
      category: '产品更新',
      author: '产品团队',
      date: '2024-06-10',
      readTime: '5分钟'
    },
    {
      id: 3,
      title: '用户故事：如何用AI Startup Scout发现投资机会',
      excerpt: '投资人李先生分享他使用我们的产品发现AI创业项目的经验...',
      category: '用户故事',
      author: '李先生',
      date: '2024-06-05',
      readTime: '10分钟'
    },
  ];

  const filteredPosts = activeCategory === '全部' 
    ? mockPosts 
    : mockPosts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0F1117] py-12 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-8 h-8 text-[#6366F1]" />
            <h1 className="text-3xl font-bold text-[#F1F5F9]">{t.title}</h1>
          </div>
          <p className="text-[#94A3B8]">{t.subtitle}</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap justify-center">
          {t.categories.map((category) => (
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
              <p className="text-[#94A3B8]">{t.recentPosts.empty}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}