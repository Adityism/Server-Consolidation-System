import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { ContainerCard } from './components/ContainerCard.jsx'
import { ResourceChart } from './components/ResourceChart.jsx'
import { OptimizationSuggestions } from './components/OptimizationSuggestions.jsx'
import { LoginPage } from './components/LoginPage.jsx'
import { RefreshCw, Server, Activity, LogOut } from 'lucide-react'
import './App.css'

const API_BASE_URL = 'http://localhost:3001/api'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [containers, setContainers] = useState([])
  const [suggestions, setSuggestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setContainers([])
    setSuggestions(null)
    setError(null)
  }

  const fetchContainers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/containers`)
      if (!response.ok) throw new Error('Failed to fetch containers')
      const data = await response.json()
      setContainers(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/optimization/suggestions`)
      if (!response.ok) throw new Error('Failed to fetch suggestions')
      const data = await response.json()
      setSuggestions(data)
    } catch (err) {
      console.error('Error fetching suggestions:', err)
    }
  }

  const handleStartContainer = async (containerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/containers/${containerId}/start`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to start container')
      await fetchContainers()
      await fetchSuggestions()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleStopContainer = async (containerId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/containers/${containerId}/stop`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Failed to stop container')
      await fetchContainers()
      await fetchSuggestions()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRefresh = () => {
    fetchContainers()
    fetchSuggestions()
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchContainers()
      fetchSuggestions()
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchContainers()
        fetchSuggestions()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [isAuthenticated])

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  const runningContainers = containers.filter(c => c.status === 'running')
  const idleContainers = runningContainers.filter(c => c.cpu < 10 && c.memory < 10)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Server className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Server Consolidation Dashboard</h1>
              <p className="text-muted-foreground">Monitor and optimize your virtualized infrastructure</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleRefresh} disabled={loading} className="flex items-center space-x-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-500 bg-red-50 dark:bg-red-950">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Server className="h-4 w-4" />
              <span>Container Dashboard</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{containers.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Running Containers</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{runningContainers.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Optimization Opportunities</CardTitle>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    Cost Savings
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{suggestions?.suggestions?.length || 0}</div>
                  {suggestions?.totalEstimatedSavings?.monthly && (
                    <p className="text-xs text-muted-foreground">
                      ₹{suggestions.totalEstimatedSavings.monthly}/month potential savings
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Resource Chart */}
            <ResourceChart containers={containers} />

            {/* Optimization Suggestions */}
            <OptimizationSuggestions 
              suggestions={suggestions} 
              onStopContainer={handleStopContainer}
            />

            {/* Container Grid */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Container Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {containers.map((container) => (
                  <ContainerCard
                    key={container.id}
                    container={container}
                    onStart={handleStartContainer}
                    onStop={handleStopContainer}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

