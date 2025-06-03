
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, ArrowRight, CheckCircle, Star, Zap, Shield, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Propellant</h1>
          </div>
          <Link to="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent" />
        <div className="container mx-auto px-4 py-24 text-center relative">
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30 mb-6">
              🚀 Blockchain-Powered Career Platform
            </Badge>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Propel Your Career with
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                {" "}Verified Skills
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The revolutionary platform where talent meets opportunity through blockchain-verified credentials, 
              AI-powered CV generation, and NFT skill badges. Build trust, showcase expertise, connect with purpose.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Blockchain Verified</h3>
              <p className="text-slate-400">Immutable credential verification on Lisk blockchain</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">NFT Skill Badges</h3>
              <p className="text-slate-400">Collect and showcase verified skill badges as NFTs</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered CVs</h3>
              <p className="text-slate-400">Generate optimized CVs with advanced AI technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-4">Choose Your Path to Success</h3>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Whether you're showcasing talent or seeking it, Propellant provides the tools you need
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
          {/* Talent Card */}
          <Card className="bg-slate-900 border-slate-700 hover:border-blue-600 transition-all duration-300 group">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">For Talent</CardTitle>
              <CardDescription className="text-slate-400 text-lg">
                Build your verified professional identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  "Generate AI-optimized CVs instantly",
                  "Upload and verify your credentials",
                  "Earn collectible NFT skill badges",
                  "Get discovered by top employers",
                  "Showcase verified work experience"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/login" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                  Join as Talent
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Organization Card */}
          <Card className="bg-slate-900 border-slate-700 hover:border-emerald-600 transition-all duration-300 group">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">For Organizations</CardTitle>
              <CardDescription className="text-slate-400 text-lg">
                Discover and connect with verified talent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  "Post jobs with AI-powered matching",
                  "Get verified talent suggestions",
                  "Message qualified professionals",
                  "Track recruitment analytics",
                  "Access premium talent features"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
              <Link to="/login" className="block">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3">
                  Join as Organization
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">10,000+</div>
              <div className="text-slate-400">Verified Professionals</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-400 mb-2">5,000+</div>
              <div className="text-slate-400">NFT Badges Issued</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">2,500+</div>
              <div className="text-slate-400">Organizations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">95%</div>
              <div className="text-slate-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-4">Ready to Propel Your Career?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust Propellant for their career growth
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 px-8 py-4 text-lg">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Propellant</span>
            </div>
            <p className="text-slate-400">© 2024 Propellant. Propelling careers forward.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
