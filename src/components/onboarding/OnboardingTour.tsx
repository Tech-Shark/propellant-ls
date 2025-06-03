
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const talentTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Propellant! 🚀',
    description: 'Let\'s take a quick tour to help you get started with building your verified professional profile.',
    target: 'dashboard',
    position: 'bottom'
  },
  {
    id: 'metrics',
    title: 'Your Career Metrics',
    description: 'Track your profile completeness, job applications, and verification progress here.',
    target: 'metrics',
    position: 'bottom'
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions Hub',
    description: 'Generate CVs, upload credentials, and manage your professional documents from here.',
    target: 'quick-actions',
    position: 'top'
  },
  {
    id: 'sidebar',
    title: 'Navigation Menu',
    description: 'Access all features including credentials, NFT badges, and profile settings.',
    target: 'sidebar',
    position: 'right'
  }
];

const organizationTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Propellant! 🏢',
    description: 'Let\'s explore how to find and connect with verified talent on our platform.',
    target: 'dashboard',
    position: 'bottom'
  },
  {
    id: 'metrics',
    title: 'Recruitment Analytics',
    description: 'Monitor your job posts, talent interactions, and hiring success rates.',
    target: 'metrics',
    position: 'bottom'
  },
  {
    id: 'create-job',
    title: 'Create Job Posts',
    description: 'Post jobs and let our AI match you with verified talent based on skills.',
    target: 'quick-actions',
    position: 'top'
  },
  {
    id: 'messaging',
    title: 'Connect with Talent',
    description: 'Message qualified professionals and track your conversations.',
    target: 'sidebar',
    position: 'right'
  }
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const tourSteps = user?.role === 'talent' ? talentTourSteps : organizationTourSteps;

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      setCurrentStep(0);
    }, 300);
  };

  const handleSkip = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      {/* Overlay */}
      <div className="absolute inset-0" onClick={handleClose} />
      
      {/* Tour Modal */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}>
        <Card className="w-[400px] bg-slate-900 border-slate-700 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-white">{currentTourStep.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Step {currentStep + 1} of {tourSteps.length}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-slate-300 leading-relaxed">
              {currentTourStep.description}
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>
            
            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-slate-400 hover:text-white"
                >
                  Skip Tour
                </Button>
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="border-slate-600 text-slate-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>
              
              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
