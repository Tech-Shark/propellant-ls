
import {
  Badge,
  Home,
  Users,
  FileText,
  Settings,
  BarChart3,
  Building2,
  MessageSquare,
  Plus
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
];

export function OrganizationSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Badge className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-bold text-sidebar-foreground">SkillVerse</h2>
            <p className="text-xs text-sidebar-foreground/70">Organization Portal</p>
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
          v1.0.0 - Organization Portal
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
