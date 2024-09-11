import { useState, useEffect } from 'react';
import moment from 'moment';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://172.191.30.191:2125/ws';

// Define interfaces for metrics and processes
interface Metrics {
  CPU: number;
  RAM: number;
  Disk: number;
  NetworkSent: string;
  NetworkReceived: string;
}

interface Process {
  PID: string;
  NAME: string;
  consumption: number;
}

interface Processes {
  cpu: Process[];
  ram: Process[];
  gpu: Process[];
}

interface ChartData {
  timestamp: string;
  CPU: number;
  RAM: number;
  Disk: number;
  NetworkSent: number;
  NetworkReceived: number;
}

// Define the shape of the WebSocket data for correct typing
interface WebSocketData {
  cpu: number;
  ram: number;
  disk: number;
  net: number;
  processes: {
    cpu: [string, string, number][];
    ram: [string, string, number][];
    gpu?: [string, string, number][];
  };
  history?: {
    timestamp: string;
    cpu: number;
    ram: number;
    disk: number;
    network_sent: number;
    network_recv: number;
  }[];
}

function useResourceData() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState<Metrics | null>(null);
  const [timeRange, setTimeRange] = useState<string>('1H');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [processes, setProcesses] = useState<Processes>({ cpu: [], ram: [], gpu: [] });

  useEffect(() => {
    const socket = new WebSocket(`${WS_URL}/${timeRange}`);

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      setIsLoading(false);
    };
    
    socket.onmessage = (event) => {
      const data: WebSocketData = JSON.parse(event.data);

      if (data.history) {
        const formattedData: ChartData[] = data.history.map((item) => ({
          timestamp: moment(item.timestamp).format('HH:mm:ss'),
          CPU: item.cpu,
          RAM: item.ram,
          Disk: item.disk,
          NetworkSent: item.network_sent,
          NetworkReceived: item.network_recv,
        }));
        setChartData(formattedData);
      } else {
        const newDataPoint: ChartData = {
          timestamp: moment().format('HH:mm:ss'),
          CPU: data.cpu,
          RAM: data.ram,
          Disk: data.disk,
          NetworkSent: data.net,
          NetworkReceived: data.net,
        };
        setChartData((prevData) => [...prevData.slice(-59), newDataPoint]);
        setCurrentMetrics({
          CPU: data.cpu,
          RAM: data.ram,
          Disk: data.disk,
          NetworkSent: data.net.toFixed(3),
          NetworkReceived: data.net.toFixed(3),
        });
        setProcesses({
          cpu: data.processes.cpu.map(([PID, NAME, consumption]) => ({ PID, NAME, consumption })),
          ram: data.processes.ram.map(([PID, NAME, consumption]) => ({ PID, NAME, consumption })),
          gpu: data.processes.gpu
            ? data.processes.gpu.map(([PID, NAME, consumption]) => ({ PID, NAME, consumption }))
            : [],
        });
      }
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.error('Connection died');
        setError(new Error('WebSocket connection closed unexpectedly'));
      }
      setIsLoading(true);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket Error: ${error}`);
      // setError(error);
    };

    return () => {
      socket.close();
    };
  }, [timeRange]);

  return { chartData, currentMetrics, timeRange, setTimeRange, isLoading, error, processes };
}

export default useResourceData;
