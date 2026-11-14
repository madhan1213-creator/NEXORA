import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Clock, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { mockCourses } from '@/data/mockData';

export const LearningPage: React.FC = () => {
  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <Badge variant="brand" className="font-mono uppercase text-[10px] mb-2">
            Curriculum Engine
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-950 tracking-tight">
            Curriculum & Level-Based Learning
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Structured courses with strict prerequisite validation and hands-on modules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCourses.map((course) => (
          <Card key={course.id} className="flex flex-col justify-between hoverEffect">
            <CardHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="brand" className="font-mono text-[10px] uppercase">
                  {course.difficulty}
                </Badge>
                <span className="text-xs text-neutral-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {course.estimatedHours} Hours Total
                </span>
              </div>
              <CardTitle className="text-xl">{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 text-xs text-neutral-600">
                <span className="flex items-center gap-1 font-semibold text-neutral-900">
                  <Layers className="w-4 h-4 text-brand-600" />
                  {course.levelsCount} Structured Levels
                </span>
                <span className="text-neutral-300">|</span>
                <span>Prerequisites: {course.prerequisites.length > 0 ? 'Python Advanced' : 'None'}</span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1.5 font-semibold">
                  Topics Explored
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {course.topics.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-700 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="pt-4">
              <Link to={`/app/courses/${course.id}`} className="w-full">
                <Button
                  variant="primary"
                  className="w-full text-xs font-semibold shadow-sm"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View Course & Levels
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
