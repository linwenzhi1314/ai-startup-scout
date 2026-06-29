'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  HelpCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n/translations';
import { useManagedContent } from '@/hooks/useManagedContent';

interface FaqItem {
  question: string;
  answer: string;
}

interface HelpData {
  title: string;
  subtitle: string;
  faq: FaqItem[];
}

interface HelpPageContentProps {
  locale: string;
}

export function HelpPageContent({ locale }: HelpPageContentProps) {
  const loc = locale as Locale;
  const { data: helpData } = useManagedContent<HelpData>('help', loc, {
    title: loc === 'zh-Hans' ? '帮助中心' : 'Help Center',
    subtitle: loc === 'zh-Hans' ? '常见问题解答' : 'Frequently Asked Questions',
    faq: []
  });

  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  const basePath = loc === 'zh-Hans' ? '/zh-Hans' : '/en';

  return (
    <div className="min-h-screen bg-[#0F1117] py-12 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-8 h-8 text-[#6366F1]" />
            <h1 className="text-3xl font-bold text-[#F1F5F9]">{helpData.title}</h1>
          </div>
          <p className="text-[#94A3B8]">{helpData.subtitle}</p>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4 mb-12">
          {helpData.faq.map((item, index) => {
            const isExpanded = expandedQuestions.has(String(index));

            return (
              <Card key={index} className="bg-[#1A1D27] border-[#2D3348]">
                <div
                  className="p-4 cursor-pointer hover:bg-[#1A1D27]/80 transition-colors flex items-center justify-between"
                  onClick={() => toggleQuestion(String(index))}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-[#6366F1] flex-shrink-0" />
                    <p className="text-[#F1F5F9] font-medium">{item.question}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                  )}
                </div>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-[#94A3B8] pl-7 border-t border-[#2D3348] pt-3">
                      {item.answer}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Contact Section */}
        <Card className="bg-[#1A1D27] border-[#2D3348]">
          <CardHeader>
            <CardTitle className="text-[#F1F5F9]">
              {loc === 'zh-Hans' ? '联系我们' : 'Contact Us'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <p className="text-[#F1F5F9]">{loc === 'zh-Hans' ? '邮件支持' : 'Email Support'}</p>
                  <p className="text-[#94A3B8] text-sm">{loc === 'zh-Hans' ? '24小时内回复' : 'Reply within 24h'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <p className="text-[#F1F5F9]">{loc === 'zh-Hans' ? 'Discord 社区' : 'Discord Community'}</p>
                  <p className="text-[#94A3B8] text-sm">{loc === 'zh-Hans' ? '实时交流' : 'Real-time chat'}</p>
                </div>
              </div>
              <Link href={`${basePath}/dashboard/settings`}>
                <Button variant="outline" className="border-[#2D3348] text-[#94A3B8] hover:text-[#F1F5F9]">
                  {loc === 'zh-Hans' ? '提交反馈' : 'Submit Feedback'}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
