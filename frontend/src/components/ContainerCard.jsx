import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Play, Square, Activity, HardDrive, AlertTriangle } from 'lucide-react'

export function ContainerCard({ container, onStart, onStop }) {
  const isRunning = container.status === 'running'
  const isVeryIdle = container.cpu < 5 && container.memory < 5 && isRunning
  const isIdle = container.cpu < 10 && container.memory < 15 && isRunning
  const isLowUsage = container.cpu < 15 && container.memory < 15 && isRunning

  const getCardStyle = () => {
    if (isVeryIdle) return 'border-red-500 bg-red-50 dark:bg-red-950'
    if (isIdle) return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
    if (isLowUsage) return 'border-blue-500 bg-blue-50 dark:bg-blue-950'
    return ''
  }

  const getOptimizationBadge = () => {
    if (isVeryIdle) {
      return (
        <Badge variant="outline" className="text-red-600 border-red-600">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Critical - Stop Now
        </Badge>
      )
    }
    if (isIdle) {
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Minimal Activity - Optimization Suggested
        </Badge>
      )
    }
    if (isLowUsage) {
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          Low Utilization
        </Badge>
      )
    }
    return null
  }

  return (
    <Card className={`w-full ${getCardStyle()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{container.name}</CardTitle>
          <Badge variant={isRunning ? 'default' : 'secondary'}>
            {container.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{container.image}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <span className="text-sm">CPU: {container.cpu}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <HardDrive className="h-4 w-4 text-green-500" />
              <span className="text-sm">Memory: {container.memory}%</span>
            </div>
          </div>
          
          {getOptimizationBadge()}
          
          <div className="flex space-x-2 pt-2">
            {isRunning ? (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onStop(container.id)}
                className="flex items-center space-x-1"
              >
                <Square className="h-3 w-3" />
                <span>Stop</span>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => onStart(container.id)}
                className="flex items-center space-x-1"
              >
                <Play className="h-3 w-3" />
                <span>Start</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

