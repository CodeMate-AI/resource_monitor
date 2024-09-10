import { useState, useEffect } from 'react';
import moment from 'moment';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://172.191.30.191:2125/ws';

function useResourceData() {
  const [chartData, setChartData] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [timeRange, setTimeRange] = useState('1H');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processes, setProcesses] = useState({ cpu: [], ram: [], gpu: [] });

  useEffect(() => {
    const socket = new WebSocket(`${WS_URL}/${timeRange}`);

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      setIsLoading(false);
    };
    
    socket.onmessage = (event) => {
      console.log(event.data)
      const data = JSON.parse(event.data);
      
      if (data.available_resource) {
        // Handle historic data
        const formattedData = data.history.map((item) => ({
          timestamp: moment(item.timestamp).format('HH:mm:ss'),
          CPU: item.cpu,
          RAM: item.ram,
          Disk: item.disk,
          NetworkSent: item.network_sent,
          NetworkReceived: item.network_recv,
        }));
        setChartData(formattedData);
      } else {
        // Handle real-time data
        const newDataPoint = {
          timestamp: moment().format('HH:mm:ss'),
          CPU: data.cpu,
          RAM: data.ram,
          Disk: data.disk,
          NetworkSent: data.net.sent,
          NetworkReceived: data.net.recv,
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
          gpu: data.processes.gpu ? data.processes.gpu.map(([PID, NAME, consumption]) => ({ PID, NAME, consumption })) : [],
        });
      }
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
      } else {
        console.error('Connection died');
        console.error(`Close code: ${event.code}`);
        console.error(`Close reason: ${event.reason}`);
        setError(new Error('WebSocket connection closed unexpectedly'));
      }
      setIsLoading(true);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket Error: ${error.message}`);
      setError(error);
    };

    return () => {
      socket.close();
    };
  }, [timeRange]);

  return { chartData, currentMetrics, timeRange, setTimeRange, isLoading, error, processes };
}

export default useResourceData;