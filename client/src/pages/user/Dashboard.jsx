import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, ShoppingCart, LogOut, Menu, Bell } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from '@/context/AuthContext'
import { motion } from "framer-motion"
import { courseService } from '@/services/api'

const menuItems = [
  { icon: User, label: 'Profile', key: 'profile' },
  { icon: ShoppingCart, label: 'Purchases', key: 'purchases' },
]

const Sidebar = React.memo(({ activeSection, onSectionChange, onLogout, user }) => (
  <aside className="w-72 bg-white border-r shadow-lg h-full flex flex-col max-h-screen overflow-y-auto hidden lg:flex">
    <div className="p-6 border-b">
      <div className="flex items-center space-x-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user?.avatar || "/placeholder-avatar.png"} alt={`${user?.name}'s avatar`} />
          <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user?.name}</h2>
        </div>
      </div>
    </div>
    <nav className="flex-grow p-4 space-y-2">
      {menuItems.map((item) => (
        <Button
          key={item.key}
          variant={activeSection === item.key ? 'secondary' : 'ghost'}
          className="w-full justify-start"
          onClick={() => onSectionChange(item.key)}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </nav>
    <div className="p-4 border-t">
      <Button variant="destructive" className="w-full" onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  </aside>
))

Sidebar.displayName = 'Sidebar'

const MobileSidebar = React.memo(({ activeSection, onSectionChange, onLogout, user }) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="lg:hidden">
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-72">
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.avatar || "/placeholder-avatar.png"} alt={`${user?.name}'s avatar`} />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.key}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              onSectionChange(item.key)
              document.querySelector('[data-testid="sheet-close"]')?.click()
            }}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
        <Button variant="destructive" className="w-full" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </SheetContent>
  </Sheet>
))

MobileSidebar.displayName = 'MobileSidebar'

const ProfileContent = React.memo(({ user }) => (
  <Card>
    <CardHeader>
      <CardTitle>User Profile</CardTitle>
      <CardDescription>Your personal information</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Name</p>
          <p className="text-lg font-semibold">{user?.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p className="text-lg font-semibold">{user?.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Phone</p>
          <p className="text-lg font-semibold">{user?.phone || 'Not provided'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Role</p>
          <p className="text-lg font-semibold">{user?.role === 1 ? 'Admin' : 'Student'}</p>
        </div>
      </div>
    </CardContent>
  </Card>
))

ProfileContent.displayName = 'ProfileContent'

const PurchasesContent = React.memo(({ purchases, loading, navigate }) => (
  <Card>
    <CardHeader>
      <CardTitle>Your Purchases</CardTitle>
      <CardDescription>A history of your course purchases and enrollments</CardDescription>
    </CardHeader>
    <CardContent>
      {loading ? (
        <p className="text-center">Loading your purchases...</p>
      ) : purchases.length > 0 ? (
        <ul className="space-y-4">
          {purchases.map((purchase) => (
            <li key={purchase._id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{purchase.course.title}</h3>
                  <p className="text-sm text-muted-foreground">Purchased on: {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                </div>
                <Badge variant="secondary">₹{purchase.amount}</Badge>
              </div>
              <p className="mt-2 text-sm">{purchase.course.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted-foreground">No purchases made yet. Start your learning journey today!</p>
      )}
      {purchases.length === 0 && (
        <div className="text-center mt-4">
          <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
        </div>
      )}
    </CardContent>
  </Card>
))

PurchasesContent.displayName = 'PurchasesContent'

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('purchases')
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true)
      const response = await courseService.getUserPurchases()
      setPurchases(response.purchases)
    } catch (error) {
      console.error('Error fetching purchases:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPurchases()
  }, [fetchPurchases])

  const handleLogout = useCallback(() => {
    logout()
    navigate('/sign-in')
  }, [logout, navigate])

  const renderContent = useCallback(() => {
    switch (activeSection) {
      case 'profile':
        return <ProfileContent user={user} />
      case 'purchases':
        return <PurchasesContent purchases={purchases} loading={loading} navigate={navigate} />
      default:
        return <PurchasesContent purchases={purchases} loading={loading} navigate={navigate} />
    }
  }, [activeSection, user, purchases, loading, navigate])

  return (
    <div className="flex flex-col lg:flex-row bg-gray-50 min-h-screen">
      <header className="lg:hidden flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <MobileSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onLogout={handleLogout}
            user={user}
          />
        </div>
      </header>
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        user={user}
      />
      <main className="flex-grow p-4 lg:p-8 overflow-y-auto">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  )
}

export default Dashboard