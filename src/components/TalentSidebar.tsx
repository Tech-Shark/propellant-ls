
import {
  Badge,
  Home,
  Users,
  FileText,
  Award,
  Settings,
  BarChart3,
  Upload,
  Download,
  User,
  MessageSquare,
  CreditCard
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

const navigationItems = [
  {
    title: "Dashboard",
    url: "/talent",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/talent/profile",
    icon: User,
  },
  {
    title: "CV Builder",
    url: "/talent/cv-builder",
    icon: FileText,
  },
  {
    title: "Credentials",
    url: "/talent/credentials",
    icon: Upload,
  },
  {
    title: "Verification",
    url: "/talent/verification",
    icon: Award,
  },
  {
    title: "Messages",
    url: "/talent/messages",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    url: "/talent/analytics",
    icon: BarChart3,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/talent/settings",
    icon: Settings,
  },
  {
    title: "Payment",
    url: "/talent/payment",
    icon: CreditCard,
  },
];

export function TalentSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-slate-800 rounded-lg flex items-center justify-center">
            <Badge className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">Propellant</h2>
            <p className="text-xs text-sidebar-foreground/70">Talent Portal</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
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
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-sidebar-foreground/50">
          v1.0.0 - Talent Dashboard
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
