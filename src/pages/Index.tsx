import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Users,
  Building2,
  Award,
  Shield,
  Globe,
  ChevronDown,
  Star,
  CheckCircle,
  Play,
  Mail,
  X,
  RotateCw,
  Maximize,
} from "lucide-react";
import Logo from "@/components/Logo.tsx";
import { Link } from "react-router-dom";
import { PartnersSection } from "@/components/PartnersSection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const Index = () => {
  const [activeTab, setActiveTab] = useState<"talent" | "organization">(
    "talent"
  );
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const supportEmail = "support@Propellanthr.com";

  const talentFeatures = [
    {
      icon: Award,
      title: "Verified Credentials",
      description:
        "Upload and verify your professional credentials with blockchain-powered NFT badges",
    },
    {
      icon: Award,
      title: "AI-Powered CV",
      description:
        "Generate optimized CVs using advanced AI that understands your industry",
    },
    {
      icon: Shield,
      title: "Secure Profile",
      description:
        "Your data is protected with enterprise-grade security and blockchain verification",
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description:
        "Connect with organizations worldwide and showcase your verified skills",
    },
  ];

  const organizationFeatures = [
    {
      icon: Users,
      title: "Verified Talent Pool",
      description:
        "Access a curated pool of professionals with blockchain-verified credentials",
    },
    {
      icon: Star,
      title: "Smart Matching",
      description:
        "AI-powered matching based on verified skills and experience",
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description:
        "Hire with confidence knowing all credentials are verified on the blockchain",
    },
    {
      icon: Building2,
      title: "Streamlined Hiring",
      description:
        "Reduce hiring time and costs with our efficient talent discovery platform",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "TechCorp",
      image: "/placeholder.svg",
      content:
        "Propellant helped me showcase my verified skills with NFT badges. I got 3x more interview requests!",
    },
    {
      name: "Michael Rodriguez",
      role: "HR Director",
      company: "InnovateX",
      image: "/placeholder.svg",
      content:
        "The verification system saved us weeks in the hiring process. We know candidates' credentials are authentic.",
    },
    {
      name: "Emily Johnson",
      role: "Data Scientist",
      company: "DataFlow",
      image: "/placeholder.svg",
      content:
        "The AI-generated CV was incredible. It highlighted skills I didn't even know were valuable.",
    },
  ];

  const stats = [
    { value: "1K+", label: "Verified Professionals" },
    { value: "50+", label: "Partner Organizations" },
    { value: "1K+", label: "Credentials Verified" },
    { value: "98%", label: "Success Rate" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo size="sm" />
            <span className="text-xl font-bold text-white">Propellant</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-slate-300 hover:text-white transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden md:block">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm mb-6">
            <Award className="w-4 h-4" />
            Blockchain-Verified Professional Network
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Propel Your Career with
            <span className="text-gradient"> Verified Credentials</span>
          </h1>

          <p className="text-xl text-slate-400 mb-8 max-w-3xl mx-auto">
            Join the first blockchain-powered professional platform where your
            skills are verified, your achievements are rewarded with NFT badges,
            and your career takes flight.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                <Users className="w-5 h-5 mr-2" />
                For Talent
              </Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8"
                >
                  <Logo size="sm" className="mr-2" />
                  For Organizations
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-white">
                    Organization Registration
                  </DialogTitle>
                  <DialogDescription className="text-slate-300 mt-2">
                    Thank you for your interest in Propellant. Organization
                    accounts are managed through our support team to ensure
                    proper verification and setup.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-slate-300 mb-4">
                    Please contact our support team at the email address below
                    to set up your organization account. We will guide you
                    through the process and help configure your account with the
                    appropriate features for your needs.
                  </p>
                  <div className="flex items-center justify-center bg-slate-800 p-3 rounded-md">
                    <Mail className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-blue-400 font-medium">
                      {supportEmail}
                    </span>
                  </div>
                </div>
                <DialogFooter>
                  <a
                    href={`mailto:${supportEmail}?subject=Organization%20Account%20Setup%20Request`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </a>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* YouTube Video Section */}
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <div
                className="aspect-video rounded-lg overflow-hidden relative cursor-pointer group"
                onClick={() => setVideoModalOpen(true)}
                role="button"
                aria-label="Play video"
              >
                {/* Video Thumbnail with Play Button Overlay */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600/90 flex items-center justify-center group-hover:bg-blue-600 transition-all shadow-lg shadow-blue-600/30 group-hover:scale-105">
                    <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Watch Propellant platform overview
                    </p>
                  </div>
                </div>
                {/* Thumbnail Image - Using a placeholder, replace with actual video thumbnail if available */}
                <div className="w-full h-full bg-gradient-to-r from-slate-700 to-slate-900">
                  <img
                    src="/Propellant-file.png"
                    alt="Video thumbnail"
                    className="w-full h-full object-cover opacity-90"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      // Show a fallback background instead
                      if (target.parentElement) {
                        target.parentElement.style.background = 'linear-gradient(135deg, rgb(51 65 85) 0%, rgb(15 23 42) 100%)';
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
                <p className="text-slate-400 flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Watch how Propellant revolutionizes professional verification
                </p>
                <span className="text-xs text-blue-400 md:hidden">
                  Tap to watch in fullscreen
                </span>
              </div>
            </div>
          </div>

          {/* Video Modal */}
          <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
            <DialogContent className="bg-black border-slate-700 p-0 max-w-[95vw] w-full sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] h-auto">
              <DialogHeader className="pt-4 px-4 flex items-center justify-between">
                <DialogTitle className="text-white flex items-center gap-2">
                  <Logo size="sm" />
                  <span className="hidden sm:inline">
                    Propellant Platform Overview
                  </span>
                </DialogTitle>
                <DialogClose className="rounded-full h-8 w-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
              </DialogHeader>
              <div className="aspect-video w-full mt-2">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube-nocookie.com/embed/t4rAksIwaWI?si=nAvHLtqeXwgdt3o-&amp;autoplay=1"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="rotate-0"
                ></iframe>
              </div>
              <div className="p-4 flex justify-center items-center gap-2 text-slate-300 text-sm md:hidden">
                <RotateCw className="w-4 h-4" />
                <p>Rotate your device for fullscreen view</p>
                <Maximize className="w-4 h-4" />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* Features Toggle */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for Both Sides of the Market
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Whether you're showcasing your skills or discovering talent, we've
              got you covered.
            </p>

            <div className="inline-flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("talent")}
                className={`px-6 py-3 rounded-md transition-all ${
                  activeTab === "talent"
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4 mr-2 inline" />
                For Talent
              </button>
              <button
                onClick={() => setActiveTab("organization")}
                className={`px-6 py-3 rounded-md transition-all ${
                  activeTab === "organization"
                    ? "bg-orange-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Logo size="xs" className="mr-2 inline" />
                For Organizations
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeTab === "talent"
              ? talentFeatures
              : organizationFeatures
            ).map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-all duration-300 interactive-card"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg ${
                      activeTab === "talent"
                        ? "bg-blue-600/20"
                        : "bg-orange-600/20"
                    } flex items-center justify-center mb-4`}
                  >
                    <feature.icon
                      className={`w-6 h-6 ${
                        activeTab === "talent"
                          ? "text-blue-400"
                          : "text-orange-400"
                      }`}
                    />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-slate-900/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How Propellant Works
            </h2>
            <p className="text-xl text-slate-400">
              Simple steps to verify your professional journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Upload & Verify
              </h3>
              <p className="text-slate-400">
                Upload your credentials, certificates, and work experience for
                blockchain verification
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Earn NFT Badges
              </h3>
              <p className="text-slate-400">
                Receive unique NFT badges for verified skills and achievements
                on the blockchain
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Get Discovered
              </h3>
              <p className="text-slate-400">
                Organizations find you based on your verified credentials and
                AI-matched skills
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-xl text-slate-400">
              See how Propellant is transforming careers and hiring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-slate-900 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-white">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-400">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600/20 to-emerald-600/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Propel Your Career?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of verified professionals and forward-thinking
            organizations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                Start as Talent
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8"
                >
                  <Logo size="xs" className="mr-2 inline" />
                  Start as Organization
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-white">
                    Organization Registration
                  </DialogTitle>
                  <DialogDescription className="text-slate-300 mt-2">
                    Thank you for your interest in Propellant. Organization
                    accounts are managed through our support team to ensure
                    proper verification and setup.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-slate-300 mb-4">
                    Please contact our support team at the email address below
                    to set up your organization account. We will guide you
                    through the process and help configure your account with the
                    appropriate features for your needs.
                  </p>
                  <div className="flex items-center justify-center bg-slate-800 p-3 rounded-md">
                    <Mail className="h-5 w-5 text-blue-400 mr-2" />
                    <span className="text-blue-400 font-medium">
                      {supportEmail}
                    </span>
                  </div>
                </div>
                <DialogFooter>
                  <a
                    href={`mailto:${supportEmail}?subject=Organization%20Account%20Setup%20Request`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </a>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Logo size="sm" />
                <span className="text-xl font-bold text-white">Propellant</span>
              </div>
              <p className="text-slate-400 mb-4">
                The future of professional verification and career development.
              </p>

              {/* Social Media Links */}
              <div className="flex items-center gap-4 mt-4">
                <a
                  href="https://www.linkedin.com/showcase/propellanthr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-blue-700 p-2 rounded-full transition-all"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/PropellantHR/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-black p-2 rounded-full transition-all"
                  aria-label="X (Twitter)"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/hrpropellant/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-gradient-to-r from-pink-500 to-yellow-500 p-2 rounded-full transition-all"
                  aria-label="Instagram"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/share/15fNzAxsxx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-blue-600 p-2 rounded-full transition-all"
                  aria-label="Facebook"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                  </svg>
                </a>
                <a
                  href="mailto:info@propellanthr.com"
                  className="bg-slate-800 hover:bg-orange-600 p-2 rounded-full transition-all"
                  aria-label="Email"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">For Talent</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Create Profile
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Verify Credentials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    AI CV Builder
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    NFT Badges
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">
                For Organizations
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Find Talent
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Post Jobs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Verify Skills
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <Link
                    to="/privacypolicy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Propellant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
