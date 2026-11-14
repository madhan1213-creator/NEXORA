import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, TrendingUp, DollarSign, Sparkles } from 'lucide-react';
import { mockCareers } from '@/data/mockData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const CareersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'AI & Data', 'Software Engineering', 'Cloud & Systems'];

  const filteredCareers = mockCareers.filter((career) => {
    const matchesSearch =
      career.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      career.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || career.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 font-sans">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="brand" className="font-mono uppercase">
          Curated Career Pathways
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-neutral-950 tracking-tight">
          Explore Technical Engineering Pathways
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
          Each pathway is calibrated against real-world enterprise engineering specs, offering verified skill benchmarks and automated progression milestones.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-neutral-950 text-white shadow-sm'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCareers.map((career) => (
          <Card key={career.id} className="flex flex-col justify-between hoverEffect">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="brand" className="font-mono text-[10px]">
                  {career.category}
                </Badge>
                <span className="flex items-center text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  {career.growthRate}
                </span>
              </div>
              <CardTitle className="text-xl">{career.title}</CardTitle>
              <CardDescription>{career.shortDescription}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Compensation and Demand */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-mono">Avg Salary</span>
                  <span className="font-bold text-neutral-900 flex items-center gap-0.5 mt-0.5">
                    <DollarSign className="w-3.5 h-3.5 text-brand-600" />
                    {career.averageSalary}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px] uppercase font-mono">Market Demand</span>
                  <span className="font-bold text-neutral-900 mt-0.5 block">{career.marketDemand}</span>
                </div>
              </div>

              {/* Skills Tags */}
              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-2 font-semibold">
                  Key Evaluated Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {career.requiredSkills.map((sk) => (
                    <span
                      key={sk.skillId}
                      className="text-xs px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 font-medium"
                    >
                      {sk.name}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-4">
              <Link to="/app/onboarding" className="w-full">
                <Button
                  variant="primary"
                  className="w-full text-xs font-semibold shadow-sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Start This Path
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
