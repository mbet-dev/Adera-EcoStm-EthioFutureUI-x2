import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, Package, ShoppingBag, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@assets/generated_images/Addis_Ababa_skyline_hero_1f47c8c5.png";
import marketImage from "@assets/generated_images/Ethiopian_marketplace_with_baskets_fdcc0073.png";
import driverImage from "@assets/generated_images/Ethiopian_delivery_driver_portrait_58d546c1.png";

const onboardingSteps = [
  {
    icon: Package,
    image: driverImage,
    titleKey: "onboardingTitle1" as const,
    descKey: "onboardingDesc1" as const,
  },
  {
    icon: ShoppingBag,
    image: marketImage,
    titleKey: "onboardingTitle2" as const,
    descKey: "onboardingDesc2" as const,
  },
  {
    icon: Shield,
    image: heroImage,
    titleKey: "onboardingTitle3" as const,
    descKey: "onboardingDesc3" as const,
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setLocation("/role-selection");
    }
  };

  const handleSkip = () => {
    setLocation("/role-selection");
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Image */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={step.image}
          alt={t(step.titleKey)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 md:px-8 md:py-12 flex flex-col items-center">
        <div className="w-full max-w-md space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {t(step.titleKey)}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t(step.descKey)}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2">
            {onboardingSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-primary"
                    : "w-2 bg-muted"
                }`}
                data-testid={`dot-onboarding-${index}`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={handleNext}
              className="w-full h-12 text-lg"
              data-testid="button-next"
            >
              {currentStep < onboardingSteps.length - 1 ? t("next") : t("getStarted")}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            
            {currentStep < onboardingSteps.length - 1 && (
              <Button
                onClick={handleSkip}
                variant="ghost"
                className="w-full"
                data-testid="button-skip"
              >
                {t("skip")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
