import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { IndianRupee, TrendingDown, AlertTriangle, Clock, Calendar } from 'lucide-react'

export function OptimizationSuggestions({ suggestions, onStopContainer }) {
  if (!suggestions || suggestions.suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5" />
            <span>Optimization Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No optimization suggestions available. All containers are running efficiently!</p>
        </CardContent>
      </Card>
    )
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingDown className="h-5 w-5" />
          <span>Optimization Suggestions</span>
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-green-600" />
            <span>Hourly Savings: ₹{suggestions.totalEstimatedSavings.hourly}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>Daily Savings: ₹{suggestions.totalEstimatedSavings.daily}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-medium">
            <IndianRupee className="h-4 w-4 text-green-600" />
            <span>Monthly Savings: ₹{suggestions.totalEstimatedSavings.monthly}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.suggestions.map((suggestion, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{suggestion.containerName}</span>
                  <Badge 
                    variant="outline" 
                    className={getPriorityColor(suggestion.priority)}
                  >
                    {suggestion.priority} priority
                  </Badge>
                  <Badge variant="secondary">{suggestion.action}</Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStopContainer(suggestion.containerId)}
                  className="ml-4"
                >
                  Stop Container
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-muted-foreground">CPU Usage:</span>
                  <div className="font-medium">{suggestion.currentUsage.cpu}%</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-muted-foreground">Memory Usage:</span>
                  <div className="font-medium">{suggestion.currentUsage.memory}%</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <span className="text-muted-foreground">Daily Savings:</span>
                  <div className="font-medium text-green-600">₹{suggestion.estimatedSavings.daily}</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <span className="text-muted-foreground">Monthly Savings:</span>
                  <div className="font-medium text-green-600">₹{suggestion.estimatedSavings.monthly}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {suggestions.lastUpdated && (
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Last updated: {new Date(suggestions.lastUpdated).toLocaleString()}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

