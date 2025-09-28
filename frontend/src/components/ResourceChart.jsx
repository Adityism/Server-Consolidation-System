import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function ResourceChart({ containers }) {
  const data = containers
    .filter(container => container.status === 'running')
    .map(container => ({
      name: container.name,
      cpu: container.cpu,
      memory: container.memory
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cpu" fill="#3b82f6" name="CPU %" />
            <Bar dataKey="memory" fill="#10b981" name="Memory %" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

