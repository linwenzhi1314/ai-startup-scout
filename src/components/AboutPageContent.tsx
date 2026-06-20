'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Users,
  BookOpen,
  Heart,
  Mail,
  MapPin,
  Globe
} from 'lucide-react';
import { Translation } from '@/lib/i18n/translations';

interface AboutPageContentProps {
  translation: Translation;
  locale: string;
}

export function AboutPageContent({ translation, locale }: AboutPageContentProps) {
  const t = translation.about;

  const valueIcons: Record<string, React.ReactNode> = {
    '用户至上': <Heart className="w-5 h-5" />,
    '持续创新': <Globe className="w-5 h-5" />,
    '开放透明': <BookOpen className="w-5 h-5" />,
    'User First': <Heart className="w-5 h-5" />,
    'Continuous Innovation': <Globe className="w-5 h-5" />,
    'Open & Transparent': <BookOpen className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-[#0F1117] py-12 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#F1F5F9] mb-4">{t.title}</h1>
          <p className="text-xl text-[#94A3B8]">{t.subtitle}</p>
        </div>

        {/* Mission */}
        <Card className="bg-[#1A1D27] border-[#2D3348] mb-12">
          <CardHeader>
            <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#6366F1]" />
              {t.mission.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#94A3B8] text-lg leading-relaxed">{t.mission.content}</p>
          </CardContent>
        </Card>

        {/* Team */}
        <Card className="bg-[#1A1D27] border-[#2D3348] mb-12">
          <CardHeader>
            <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#6366F1]" />
              {t.team.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {t.team.members.map((member, index) => (
                <div key={index} className="text-center p-6 bg-[#0F1117] rounded-lg">
                  <div className="w-16 h-16 bg-[#6366F1]/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#6366F1]">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-[#F1F5F9] font-semibold mb-1">{member.name}</p>
                  <Badge className="bg-[#6366F1]/20 text-[#6366F1] mb-2">{member.role}</Badge>
                  <p className="text-[#94A3B8] text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Story */}
        <Card className="bg-[#1A1D27] border-[#2D3348] mb-12">
          <CardHeader>
            <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#6366F1]" />
              {t.story.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {t.story.content.map((paragraph, index) => (
              <p key={index} className="text-[#94A3B8] leading-relaxed">{paragraph}</p>
            ))}
          </CardContent>
        </Card>

        {/* Values */}
        <Card className="bg-[#1A1D27] border-[#2D3348] mb-12">
          <CardHeader>
            <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#F59E0B]" />
              {t.values.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {t.values.items.map((value, index) => (
                <div key={index} className="p-6 bg-[#0F1117] rounded-lg text-center">
                  <div className="w-10 h-10 bg-[#F59E0B]/20 rounded-lg mx-auto mb-4 flex items-center justify-center text-[#F59E0B]">
                    {valueIcons[value.title]}
                  </div>
                  <p className="text-[#F1F5F9] font-semibold mb-2">{value.title}</p>
                  <p className="text-[#94A3B8] text-sm">{value.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-[#1A1D27] border-[#2D3348]">
          <CardHeader>
            <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#6366F1]" />
              {t.contact.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-[#0F1117] rounded-lg">
                <Mail className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <p className="text-[#94A3B8] text-sm">邮箱</p>
                  <p className="text-[#F1F5F9]">{t.contact.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#0F1117] rounded-lg">
                <MapPin className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <p className="text-[#94A3B8] text-sm">地址</p>
                  <p className="text-[#F1F5F9]">{t.contact.location}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}