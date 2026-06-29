'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Users,
  Heart,
  Mail,
  MapPin,
  Globe,
  BookOpen
} from 'lucide-react';
import { Locale } from '@/lib/i18n/translations';
import { useManagedContent } from '@/hooks/useManagedContent';

interface AboutData {
  title: string;
  subtitle: string;
  description: string;
  mission: { title: string; description: string };
  values: Array<{ title: string; description: string }>;
  team: Array<{ name: string; role: string; bio: string }>;
}

interface AboutPageContentProps {
  locale: string;
}

export function AboutPageContent({ locale }: AboutPageContentProps) {
  const loc = locale as Locale;
  const { data: aboutData } = useManagedContent<AboutData>('about', loc, {
    title: loc === 'zh-Hans' ? '关于 AI Startup Scout' : 'About AI Startup Scout',
    subtitle: loc === 'zh-Hans' ? '你的 AI 创业雷达' : 'Your AI Startup Radar',
    description: loc === 'zh-Hans'
      ? 'AI Startup Scout 诞生于一个简单的想法：让每个人都能轻松发现和追踪全球 AI 创业项目。'
      : 'AI Startup Scout was born from a simple idea: make it easy for everyone to discover and track global AI startup projects.',
    mission: {
      title: loc === 'zh-Hans' ? '我们的使命' : 'Our Mission',
      description: loc === 'zh-Hans'
        ? 'Democratize AI startup intelligence — 让每个人都拥有发现下一个 AI 独角兽的能力。'
        : 'Democratize AI startup intelligence — give everyone the power to discover the next AI unicorn.'
    },
    values: [],
    team: []
  });

  const valueIcons: Record<string, React.ReactNode> = {
    '开放透明': <BookOpen className="w-5 h-5" />,
    '用户至上': <Heart className="w-5 h-5" />,
    '数据驱动': <Globe className="w-5 h-5" />,
    'Open & Transparent': <BookOpen className="w-5 h-5" />,
    'User First': <Heart className="w-5 h-5" />,
    'Data Driven': <Globe className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-[#0F1117] py-12 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#F1F5F9] mb-4">{aboutData.title}</h1>
          <p className="text-xl text-[#94A3B8]">{aboutData.subtitle}</p>
        </div>

        {/* Description */}
        <Card className="bg-[#1A1D27] border-[#2D3348] mb-12">
          <CardContent className="pt-6">
            <p className="text-[#94A3B8] text-lg leading-relaxed">{aboutData.description}</p>
          </CardContent>
        </Card>

        {/* Mission */}
        <Card className="bg-[#1A1D27] border-[#2D3348] mb-12">
          <CardHeader>
            <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#6366F1]" />
              {aboutData.mission.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#94A3B8] text-lg leading-relaxed">{aboutData.mission.description}</p>
          </CardContent>
        </Card>

        {/* Values */}
        {aboutData.values.length > 0 && (
          <Card className="bg-[#1A1D27] border-[#2D3348] mb-12">
            <CardHeader>
              <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#F59E0B]" />
                {loc === 'zh-Hans' ? '核心价值观' : 'Core Values'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aboutData.values.map((value, index) => (
                  <div key={index} className="p-6 bg-[#0F1117] rounded-lg text-center">
                    <div className="w-10 h-10 bg-[#F59E0B]/20 rounded-lg mx-auto mb-4 flex items-center justify-center text-[#F59E0B]">
                      {valueIcons[value.title] || <Heart className="w-5 h-5" />}
                    </div>
                    <p className="text-[#F1F5F9] font-semibold mb-2">{value.title}</p>
                    <p className="text-[#94A3B8] text-sm">{value.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team */}
        {aboutData.team.length > 0 && (
          <Card className="bg-[#1A1D27] border-[#2D3348] mb-12">
            <CardHeader>
              <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#6366F1]" />
                {loc === 'zh-Hans' ? '团队成员' : 'Our Team'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aboutData.team.map((member, index) => (
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
        )}

        {/* Contact */}
        <Card className="bg-[#1A1D27] border-[#2D3348]">
          <CardHeader>
            <CardTitle className="text-[#F1F5F9] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#6366F1]" />
              {loc === 'zh-Hans' ? '联系我们' : 'Contact Us'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-[#0F1117] rounded-lg">
                <Mail className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <p className="text-[#94A3B8] text-sm">{loc === 'zh-Hans' ? '邮箱' : 'Email'}</p>
                  <p className="text-[#F1F5F9]">hello@aistartupscout.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#0F1117] rounded-lg">
                <MapPin className="w-5 h-5 text-[#6366F1]" />
                <div>
                  <p className="text-[#94A3B8] text-sm">{loc === 'zh-Hans' ? '地址' : 'Location'}</p>
                  <p className="text-[#F1F5F9]">{loc === 'zh-Hans' ? '全球远程团队' : 'Global Remote Team'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
