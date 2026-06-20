'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  HelpCircle,
  BookOpen,
  User,
  CreditCard,
  Puzzle,
  Mail,
  MessageCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Link from 'next/link';
import { Translation } from '@/lib/i18n/translations';

interface HelpPageContentProps {
  translation: Translation;
  locale: string;
}

export function HelpPageContent({ translation, locale }: HelpPageContentProps) {
  const t = translation.help;
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const categoryIcons: Record<string, React.ReactNode> = {
    '入门指南': <BookOpen className="w-5 h-5" />,
    '账户问题': <User className="w-5 h-5" />,
    '订阅与支付': <CreditCard className="w-5 h-5" />,
    '扩展使用': <Puzzle className="w-5 h-5" />,
    'Getting Started': <BookOpen className="w-5 h-5" />,
    'Account': <User className="w-5 h-5" />,
    'Subscription & Payment': <CreditCard className="w-5 h-5" />,
    'Extension': <Puzzle className="w-5 h-5" />,
  };

  const toggleQuestion = (id: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedQuestions(newExpanded);
  };

  return (
    <div className="min-h-screen bg-[#0F1117] py-12 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <HelpCircle className="w-8 h-8 text-[#6366F1]" />
            <h1 className="text-3xl font-bold text-[#F1F5F9]">{t.title}</h1>
          </div>
          <p className="text-[#94A3B8]">{t.subtitle}</p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <Card className="bg-[#1A1D27] border-[#2D3348] hover:border-[#6366F1] transition-colors cursor-pointer">
            <CardContent className="pt-6 text-center">
              <BookOpen className="w-6 h-6 text-[#6366F1] mx-auto mb-2" />
              <p className="text-[#F1F5F9] font-medium">{t.categories.gettingStarted}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1D27] border-[#2D3348] hover:border-[#6366F1] transition-colors cursor-pointer">
            <CardContent className="pt-6 text-center">
              <User className="w-6 h-6 text-[#6366F1] mx-auto mb-2" />
              <p className="text-[#F1F5F9] font-medium">{t.categories.account}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1D27] border-[#2D3348] hover:border-[#6366F1] transition-colors cursor-pointer">
            <CardContent className="pt-6 text-center">
              <CreditCard className="w-6 h-6 text-[#6366F1] mx-auto mb-2" />
              <p className="text-[#F1F5F9] font-medium">{t.categories.subscription}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1A1D27] border-[#2D3348] hover:border-[#6366F1] transition-colors cursor-pointer">
            <CardContent className="pt-6 text-center">
              <Puzzle className="w-6 h-6 text-[#6366F1] mx-auto mb-2" />
              <p className="text-[#F1F5F9] font-medium">{t.categories.extension}</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6 mb-12">
          {t.faq.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="bg-[#1A1D27] border-[#2D3348]">
              <CardHeader>
                <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
                  {categoryIcons[category.category]}
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.items.map((item, itemIndex) => {
                  const questionId = `${categoryIndex}-${itemIndex}`;
                  const isExpanded = expandedQuestions.has(questionId);
                  
                  return (
                    <div
                      key={itemIndex}
                      className="bg-[#0F1117] rounded-lg p-4 cursor-pointer hover:bg-[#0F1117]/80 transition-colors"
                      onClick={() => toggleQuestion(questionId)}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[#F1F5F9] font-medium">{item.question}</p>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                        )}
                      </div>
                      {isExpanded && (
                        <p className="text-[#94A3B8] mt-3 pt-3 border-t border-[#2D3348]">
                          {item.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Section */}
        <Card className="bg-[#1A1D27] border-[#2D3348]">
          <CardHeader>
            <CardTitle className="text-[#F1F5F9]">{t.contact.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <p className="text-[#F1F5F9]">{t.contact.email}</p>
                  <p className="text-[#94A3B8] text-sm">{t.contact.responseTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <p className="text-[#F1F5F9]">{t.contact.discord}</p>
                  <p className="text-[#94A3B8] text-sm">实时交流</p>
                </div>
              </div>
              <Link href={`/${locale}/dashboard/settings`}>
                <Button variant="outline" className="border-[#2D3348] text-[#94A3B8] hover:text-[#F1F5F9]">
                  提交反馈
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}