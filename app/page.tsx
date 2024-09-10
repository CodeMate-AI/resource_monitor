"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableHeader, TableRow,TableHead, TableCell } from "@/components/ui/table";
import {
  CpuIcon,
  HardDriveIcon,
  NetworkIcon,
  MemoryStickIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import useResourceData from '../lib/useResourceDatahook';

export default function MonitoringDashboard() {
  const { chartData, currentMetrics, timeRange, setTimeRange, isLoading, error, processes } = useResourceData();
  const [showCPU, setShowCPU] = useState(true);
  const [showRAM, setShowRAM] = useState(true);
  const [showDisk, setShowDisk] = useState(true);
  const [showNetworkSent, setShowNetworkSent] = useState(true);
  const [showNetworkReceived, setShowNetworkReceived] = useState(true);
  console.log("respons",processes);
  const metricColors = {
    CPU: "#8884d8",
    RAM: "#82ca9d",
    Disk: "#ffc658",
    NetworkSent: "#ff8042",
    NetworkReceived: "#0088FE",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-4 rounded-md shadow-md border border-border">
          <p className="font-bold">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">System Monitoring Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <CpuIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics ? `${currentMetrics.CPU}%` : 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RAM Usage</CardTitle>
            <MemoryStickIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics ? `${currentMetrics.RAM}%` : 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDriveIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics ? `${currentMetrics.Disk}%` : 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Sent</CardTitle>
            <NetworkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics ? `${currentMetrics.NetworkSent} KB/s` : 'N/A'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Received</CardTitle>
            <NetworkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMetrics ? `${currentMetrics.NetworkReceived} KB/s` : 'N/A'}</div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>System Metrics Over Time</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="1H">Last 1 Hour</option>
              <option value="3H">Last 3 Hours</option>
              <option value="6H">Last 6 Hours</option>
              <option value="12H">Last 12 Hours</option>
              <option value="1D">Last 24 Hours</option>
            </select>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}

              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip  />
                <Legend />
                {showCPU && (
                  <Line
                  isAnimationActive={false} 
                    type="monotone"
                    dataKey="CPU"
                    stroke={metricColors.CPU}
                    name="CPU"
                  />
                )}
                {showRAM && (
                  <Line
                  isAnimationActive={false} 
                    type="monotone"
                    dataKey="RAM"
                    stroke={metricColors.RAM}
                    name="RAM"
                  />
                )}
                {showDisk && (
                  <Line
                  isAnimationActive={false} 
                    type="monotone"
                    dataKey="Disk"
                    stroke={metricColors.Disk}
                    name="Disk"
                  />
                )}
                {showNetworkSent && (
                  <Line
                  isAnimationActive={false} 
                    type="monotone"
                    dataKey="NetworkSent"
                    stroke={metricColors.NetworkSent}
                    name="Network Sent"
                  />
                )}
                {showNetworkReceived && (
                  <Line
                  isAnimationActive={false} 
                    type="monotone"
                    dataKey="NetworkReceived"
                    stroke={metricColors.NetworkReceived}
                    name="Network Received"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
            <Switch
  id="cpu-toggle"
  checked={showCPU}
  onChange={() => setShowCPU(prev => !prev)}
/>
              <label htmlFor="cpu-toggle" className="text-sm font-medium" style={{ color: metricColors.CPU }}>
                CPU
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="ram-toggle"
                checked={showRAM}
                onCheckedChange={setShowRAM}
              />
              <label htmlFor="ram-toggle" className="text-sm font-medium" style={{ color: metricColors.RAM }}>
                RAM
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="disk-toggle"
                checked={showDisk}
                onCheckedChange={setShowDisk}
              />
              <label htmlFor="disk-toggle" className="text-sm font-medium" style={{ color: metricColors.Disk }}>
                Disk
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="network-sent-toggle"
                checked={showNetworkSent}
                onCheckedChange={setShowNetworkSent}
              />
              <label htmlFor="network-sent-toggle" className="text-sm font-medium" style={{ color: metricColors.NetworkSent }}>
                Network Sent
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="network-received-toggle"
                checked={showNetworkReceived}
                onCheckedChange={setShowNetworkReceived}
              />
              <label htmlFor="network-received-toggle" className="text-sm font-medium" style={{ color: metricColors.NetworkReceived }}>
                Network Received
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
                <TableHead>RAM Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.ram.sort((a, b) => b.consumption - a.consumption).slice(0, 5).map((process, index) => (
                <TableRow key={index}>
                  <TableCell>{process.NAME}</TableCell>
                  <TableCell>{process.consumption}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Process Name</TableHead>
                <TableHead>CPU Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.cpu.sort((a, b) => b.consumption - a.consumption).slice(0, 5).map((process, index) => (
                <TableRow key={index}>
                  <TableCell>{process.NAME}</TableCell>
                  <TableCell>{process.consumption}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Process Name</TableHead>
                <TableHead>GPU Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.gpu.sort((a, b) => b.consumption - a.consumption).slice(0, 5).map((process, index) => (
                <TableRow key={index}>
                  <TableCell>{process.NAME}</TableCell>
                  <TableCell>{process.consumption}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
