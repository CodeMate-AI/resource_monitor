'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { CpuIcon, HardDriveIcon, NetworkIcon, MemoryStickIcon } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Generate mock time-series data for the chart
const generateChartData = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date()
    date.setMinutes(date.getMinutes() - (count - 1 - i))
    return {
      time: date.toLocaleTimeString(),
      cpu: Math.floor(Math.random() * 100),
      gpu: Math.floor(Math.random() * 100),
      ram: Math.floor(Math.random() * 100),
      disk: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 100),
    }
  })
}

const chartData = generateChartData(10)

// Generate mock process data
const generateProcessData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Process ${i + 1}`,
    cpu: `${Math.floor(Math.random() * 100)}%`,
    ram: `${Math.floor(Math.random() * 1000)} MB`,
    gpu: `${Math.floor(Math.random() * 100)}%`,
    disk: `${Math.floor(Math.random() * 100)} MB/s`,
  }))
}

const processes = generateProcessData(5)

export default function MonitoringDashboard() {
  const [showCPU, setShowCPU] = useState(true)
  const [showGPU, setShowGPU] = useState(true)
  const [showRAM, setShowRAM] = useState(true)
  const [showDisk, setShowDisk] = useState(true)
  const [showNetwork, setShowNetwork] = useState(true)

  // Mock data for current metrics
  const metrics = {
    cpu: '45%',
    gpu: '30%',
    ram: '60%',
    disk: '70%',
    network: '20 Mbps'
  }

  const metricColors = {
    cpu: "#8884d8",
    gpu: "#82ca9d",
    ram: "#ffc658",
    disk: "#ff8042",
    network: "#0088FE"
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 rounded-md shadow-md border border-border">
          <p className="font-bold">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}%`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">System Monitoring Dashboard</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>System Metrics Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {showCPU && <Line type="monotone" dataKey="cpu" stroke={metricColors.cpu} name="CPU" />}
                {showGPU && <Line type="monotone" dataKey="gpu" stroke={metricColors.gpu} name="GPU" />}
                {showRAM && <Line type="monotone" dataKey="ram" stroke={metricColors.ram} name="RAM" />}
                {showDisk && <Line type="monotone" dataKey="disk" stroke={metricColors.disk} name="Disk" />}
                {showNetwork && <Line type="monotone" dataKey="network" stroke={metricColors.network} name="Network" />}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <CpuIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpu}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">GPU Usage</CardTitle>
            <CpuIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.gpu}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RAM Usage</CardTitle>
            <MemoryStickIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.ram}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDriveIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.disk}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Usage</CardTitle>
            <NetworkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.network}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metric Toggles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="cpu-toggle" checked={showCPU} onCheckedChange={setShowCPU} />
              <label htmlFor="cpu-toggle" className="text-sm font-medium">
                CPU
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="gpu-toggle" checked={showGPU} onCheckedChange={setShowGPU} />
              <label htmlFor="gpu-toggle" className="text-sm font-medium">
                GPU
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="ram-toggle" checked={showRAM} onCheckedChange={setShowRAM} />
              <label htmlFor="ram-toggle" className="text-sm font-medium">
                RAM
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="disk-toggle" checked={showDisk} onCheckedChange={setShowDisk} />
              <label htmlFor="disk-toggle" className="text-sm font-medium">
                Disk
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="network-toggle" checked={showNetwork} onCheckedChange={setShowNetwork} />
              <label htmlFor="network-toggle" className="text-sm font-medium">
                Network
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Running Processes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Process Name</TableHead>
                <TableHead>CPU Usage</TableHead>
                <TableHead>RAM Usage</TableHead>
                <TableHead>GPU Usage</TableHead>
                <TableHead>Disk Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>{process.name}</TableCell>
                  <TableCell>{process.cpu}</TableCell>
                  <TableCell>{process.ram}</TableCell>
                  <TableCell>{process.gpu}</TableCell>
                  <TableCell>{process.disk}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}