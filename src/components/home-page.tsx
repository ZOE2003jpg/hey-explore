import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoginModal } from "@/components/login-modal"
import { useUser } from "@/components/user-context"
import { useStories } from "@/hooks/useStories"
import { useToast } from "@/hooks/use-toast"
import { StoryCard } from "@/components/ui/story-card"
import { 
  BookOpen, 
  Play
} from "lucide-react"
import heroImage from "@/assets/hero-books.jpg"

interface HomePageProps {
  onPanelChange: (panel: "home" | "reader" | "writer" | "admin") => void
}

export function HomePage({ onPanelChange }: HomePageProps) {
  const { user } = useUser()
  const { stories } = useStories()
  const [showLogin, setShowLogin] = useState(false)

  const handleGetStarted = () => {
    // Always allow access to reader panel for browsing
    onPanelChange('reader')
  }

  const handleStartWriting = () => {
    if (user) {
      const userRoles = user.roles || []
      if (userRoles.includes("writer") || userRoles.includes("admin")) {
        onPanelChange('writer')
      } else {
        onPanelChange('reader')
      }
    } else {
      setShowLogin(true)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container-system">
          <div className="content-container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="typography-display">
                    Stories That Come
                    <span className="text-primary block"> Alive</span>
                  </h1>
                  <p className="typography-body-lg text-muted-foreground max-w-xl">
                    Experience reading like never before with VineNovel's immersive slide-based storytelling platform. Where every story comes to life.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="btn-primary" onClick={handleGetStarted}>
                    <Play className="h-5 w-5 mr-2" />
                    Start Reading
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onClick={() => onPanelChange("reader")} 
                    className="btn-secondary"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Start Reading
                  </Button>
                </div>

              </div>

              <div className="relative">
                <div className="relative">
                  <img 
                    src={heroImage} 
                    alt="VineNovel Platform" 
                    className="w-full rounded-2xl shadow-2xl border border-border/20" 
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      {stories.length > 0 && (
        <section className="bg-muted/30">
          <div className="container-system">
            <div className="content-container">
              <div className="text-center mb-12">
                <h2 className="typography-h2 mb-4">Trending Stories</h2>
                <p className="typography-body text-muted-foreground max-w-2xl mx-auto">
                  Discover the most popular stories on VineNovel, loved by readers worldwide
                </p>
              </div>
              
              {/* Story Grid */}
              <div className="story-grid">
                {stories.slice(0, 8).map((story) => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    onRead={() => onPanelChange('reader')}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <LoginModal open={showLogin} onOpenChange={setShowLogin} />
    </div>
  )
}