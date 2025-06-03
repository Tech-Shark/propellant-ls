
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Building2, Award, Zap, Shield, Globe, ChevronDown, Star, CheckCircle, Play } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState<'talent' | 'organization'>('talent');

  const talentFeatures = [
    {
      icon: Award,
      title: "Verified Credentials",
      description: "Upload and verify your professional credentials with blockchain-powered NFT badges"
    },
    {
      icon: Zap,
      title: "AI-Powered CV",
      description: "Generate optimized CVs using advanced AI that understands your industry"
    },
    {
      icon: Shield,
      title: "Secure Profile",
      description: "Your data is protected with enterprise-grade security and blockchain verification"
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Connect with organizations worldwide and showcase your verified skills"
    }
  ];

  const organizationFeatures = [
    {
      icon: Users,
      title: "Verified Talent Pool",
      description: "Access a curated pool of professionals with blockchain-verified credentials"
    },
    {
      icon: Zap,
      title: "Smart Matching",
      description: "AI-powered matching based on verified skills and experience"
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "Hire with confidence knowing all credentials are verified on the blockchain"
    },
    {
      icon: Building2,
      title: "Streamlined Hiring",
      description: "Reduce hiring time and costs with our efficient talent discovery platform"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "TechCorp",
      image: "/placeholder.svg",
      content: "Propellant helped me showcase my verified skills with NFT badges. I got 3x more interview requests!"
    },
    {
      name: "Michael Rodriguez",
      role: "HR Director",
      company: "InnovateX",
      image: "/placeholder.svg",
      content: "The verification system saved us weeks in the hiring process. We know candidates' credentials are authentic."
    },
    {
      name: "Emily Johnson",
      role: "Data Scientist",
      company: "DataFlow",
      image: "/placeholder.svg",
      content: "The AI-generated CV was incredible. It highlighted skills I didn't even know were valuable."
    }
  ];

  const stats = [
    { value: "10K+", label: "Verified Professionals" },
    { value: "500+", label: "Partner Organizations" },
    { value: "50K+", label: "Credentials Verified" },
    { value: "98%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Propellant</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors">Testimonials</a>
            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
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
            Join the first blockchain-powered professional platform where your skills are verified, 
            your achievements are rewarded with NFT badges, and your career takes flight.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                <Users className="w-5 h-5 mr-2" />
                For Talent
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8">
                <Building2 className="w-5 h-5 mr-2" />
                For Organizations
              </Button>
            </Link>
          </div>

          {/* Hero Image/Video Placeholder */}
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
              <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center">
                <Button variant="ghost" className="text-slate-400 hover:text-white">
                  <Play className="w-12 h-12" />
                </Button>
              </div>
              <p className="text-slate-400 mt-4">Watch how Propellant revolutionizes professional verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Toggle */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for Both Sides of the Market
            </h2>
            <p className="text-xl text-slate-400 mb-8">
              Whether you're showcasing your skills or discovering talent, we've got you covered.
            </p>
            
            <div className="inline-flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('talent')}
                className={`px-6 py-3 rounded-md transition-all ${
                  activeTab === 'talent' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 mr-2 inline" />
                For Talent
              </button>
              <button
                onClick={() => setActiveTab('organization')}
                className={`px-6 py-3 rounded-md transition-all ${
                  activeTab === 'organization' 
                    ? 'bg-orange-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4 mr-2 inline" />
                For Organizations
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeTab === 'talent' ? talentFeatures : organizationFeatures).map((feature, index) => (
              <Card key={index} className="bg-slate-900 border-slate-700 hover:border-slate-600 transition-all duration-300 interactive-card">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${activeTab === 'talent' ? 'bg-blue-600/20' : 'bg-orange-600/20'} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${activeTab === 'talent' ? 'text-blue-400' : 'text-orange-400'}`} />
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
              <h3 className="text-xl font-semibold text-white mb-4">Upload & Verify</h3>
              <p className="text-slate-400">
                Upload your credentials, certificates, and work experience for blockchain verification
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Earn NFT Badges</h3>
              <p className="text-slate-400">
                Receive unique NFT badges for verified skills and achievements on the blockchain
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Get Discovered</h3>
              <p className="text-slate-400">
                Organizations find you based on your verified credentials and AI-matched skills
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
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role} at {testimonial.company}</div>
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
            Join thousands of verified professionals and forward-thinking organizations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Start as Talent
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8">
                Start as Organization
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Propellant</span>
              </div>
              <p className="text-slate-400">
                The future of professional verification and career development.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">For Talent</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Create Profile</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Verify Credentials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI CV Builder</a></li>
                <li><a href="#" className="hover:text-white transition-colors">NFT Badges</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">For Organizations</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Find Talent</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Post Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Verify Skills</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
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
