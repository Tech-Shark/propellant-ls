
import {
  Badge,
  Home,
  Users,
  Settings,
  BarChart3,
  Shield,
  Award,
  FileText,
  Building2,
  Activity,
  ArrowLeft
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
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Organizations",
    url: "/admin/organizations",
    icon: Building2,
  },
  {
    title: "Verifications",
    url: "/admin/verifications",
    icon: Award,
  },
  {
    title: "Content Moderation",
    url: "/admin/moderation",
    icon: FileText,
  },
  {
    title: "System Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Activity Logs",
    url: "/admin/logs",
    icon: Activity,
  },
];

const settingsItems = [
  {
    title: "Admin Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Security",
    url: "/admin/security",
    icon: Shield,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
            <Badge className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-white">Propellant</h2>
            <p className="text-xs text-blue-100">Admin Portal</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/" className="flex items-center gap-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Home</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-700 font-semibold">Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3 hover:bg-blue-50 rounded-lg transition-colors group">
                      <item.icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      <span className="group-hover:text-blue-700">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-semibold">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg transition-colors group">
                      <item.icon className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
                      <span className="group-hover:text-gray-800">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 bg-gray-50">
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <span>v1.0.0 - Admin Dashboard</span>
          <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
