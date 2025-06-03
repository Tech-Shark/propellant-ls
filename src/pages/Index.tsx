
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, Users, Building2, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Badge className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">SkillVerse</h1>
          </div>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Verify Skills, Build Trust, Connect Talent
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          The blockchain-powered platform for credential verification, NFT badges, 
          and connecting verified talent with organizations.
        </p>
        <Link to="/login">
          <Button size="lg" className="text-lg px-8 py-3">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Features for Different User Types */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Choose Your Journey</h3>
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>For Talent</CardTitle>
              <CardDescription>
                Build your verified professional profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left space-y-2 mb-6">
                <li>• Generate AI-optimized CVs</li>
                <li>• Upload and verify credentials</li>
                <li>• Earn NFT skill badges</li>
                <li>• Connect with employers</li>
              </ul>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Join as Talent
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Building2 className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>For Organizations</CardTitle>
              <CardDescription>
                Find and connect with verified talent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left space-y-2 mb-6">
                <li>• Post jobs with skill requirements</li>
                <li>• Get AI-matched talent suggestions</li>
                <li>• Message verified professionals</li>
                <li>• Track recruitment metrics</li>
              </ul>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Join as Organization
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
              <CardTitle>For Admins</CardTitle>
              <CardDescription>
                Manage platform and verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-left space-y-2 mb-6">
                <li>• Oversee credential verification</li>
                <li>• Manage platform users</li>
                <li>• Add additional admins</li>
                <li>• Monitor platform metrics</li>
              </ul>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Admin Access
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
