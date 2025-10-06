import { useState } from "react"
import { Dashboard } from "@/components/admin/dashboard"
import { NovelsManagement } from "@/components/admin/novels-management"
import { ChapterManager } from "@/components/admin/chapter-manager"
import { WritersManagement } from "@/components/admin/writers-management"
import { ReadersManagement } from "@/components/admin/readers-management"
import { AdsManagement } from "@/components/admin/ads-management"
import { ReportsModeration } from "@/components/admin/reports-moderation"
import { CommentsManagement } from "@/components/admin/comments-management"
import { CategoriesTags } from "@/components/admin/categories-tags"
import { Settings } from "@/components/admin/settings"
import { AdminConfig } from "@/components/admin/admin-config"
import { TestDataSetup } from "@/components/admin/test-data-setup"
import { UserManagement } from "@/components/admin/user-management"
import { AdminMobileNav } from "./admin-mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import { 
  Shield, 
  BarChart3, 
  BookOpen, 
  Users, 
  Play, 
  Flag, 
  MessageSquare,
  Tag,
  Settings as SettingsIcon,
  UserCheck,
  FileText,
  Database
} from "lucide-react"

export function AdminPanel() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [selectedData, setSelectedData] = useState(null)
  const isMobile = useIsMobile()

  const handleNavigate = (page: string, data?: any) => {
    if (data) {
      setSelectedData(data)
    }
    setCurrentPage(page)
  }

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "user-management", label: "User Management", icon: UserCheck },
    { id: "novels", label: "Novels", icon: BookOpen },
    { id: "chapters", label: "Chapters", icon: FileText },
    { id: "writers", label: "Writers", icon: Users },
    { id: "readers", label: "Readers", icon: Users },
    { id: "ads", label: "Ads", icon: Play },
    { id: "reports", label: "Reports", icon: Flag },
    { id: "comments", label: "Comments", icon: MessageSquare },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "settings", label: "Settings", icon: SettingsIcon },
    { id: "admin-config", label: "Admin Config", icon: Shield },
    { id: "test-data", label: "Test Data Setup", icon: Database }
  ]

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />
      case "user-management":
        return <UserManagement onNavigate={handleNavigate} />
      case "novels":
        return <NovelsManagement onNavigate={handleNavigate} />
      case "chapters":
        return <ChapterManager novel={selectedData} onNavigate={handleNavigate} />
      case "writers":
        return <WritersManagement onNavigate={handleNavigate} />
      case "readers":
        return <ReadersManagement onNavigate={handleNavigate} />
      case "ads":
        return <AdsManagement onNavigate={handleNavigate} />
      case "reports":
        return <ReportsModeration onNavigate={handleNavigate} />
      case "comments":
        return <CommentsManagement onNavigate={handleNavigate} />
      case "categories":
        return <CategoriesTags onNavigate={handleNavigate} />
      case "settings":
        return <Settings onNavigate={handleNavigate} />
      case "admin-config":
        return <AdminConfig onNavigate={handleNavigate} />
      case "test-data":
        return <TestDataSetup />
      default:
        return <Dashboard onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Desktop Sidebar Navigation */}
      {!isMobile && (
        <div className="w-64 bg-card border-r border-border p-6">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleNavigate(item.id)}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </div>
      )}

      {/* Mobile Navigation - Use sheet/drawer instead of fixed header */}
      {isMobile && (
        <div className="fixed top-16 left-4 z-40">
          <AdminMobileNav currentPage={currentPage} onNavigate={handleNavigate} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}