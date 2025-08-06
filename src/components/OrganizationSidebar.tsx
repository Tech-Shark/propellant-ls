import {
  Badge,
  Home,
  Users,
  FileText,
  Settings,
  BarChart3,
  Building2,
  MessageSquare,
  Plus,
  CreditCard,
  ArrowLeft,
  LogOut,
  Award,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.tsx";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/organization",
    icon: Home,
  },
  {
    title: "Job Posts",
    url: "/organization/jobs",
    icon: FileText,
  },
  {
    title: "Talent Pool",
    url: "/organization/talent",
    icon: Users,
  },
  {
    title: "Credential Verification",
    url: "/organization/credentials",
    icon: Award,
  },
  {
    title: "Messages",
    url: "/organization/messages",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    url: "/organization/analytics",
    icon: BarChart3,
  },
  {
    title: "Company Profile",
    url: "/organization/profile",
    icon: Building2,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/organization/settings",
    icon: Settings,
  },
  // {
  //   title: "Payment",
  //   url: "/organization/payment",
  //   icon: CreditCard,
  // },
];

export function OrganizationSidebar() {
  const { logout } = useAuth();

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-emerald-600 rounded-lg flex items-center justify-center">
            <Badge className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">Propellant</h2>
            <p className="text-xs text-sidebar-foreground/70">
              Organization Portal
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/"
                    className="flex items-center gap-3 text-emerald-400 hover:text-emerald-300"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 text-red-400 hover:bg-red-500/20 hover:border-red-500/30"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-sidebar-foreground/50">
          v1.0.0 - Organization Portal
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
