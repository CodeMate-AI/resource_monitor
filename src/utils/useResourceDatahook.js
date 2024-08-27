import { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';

const API_URL = process.env.REACT_APP_API_URL || 'http://172.191.30.191:2125';
const POLL_INTERVAL = 500000;

function useResourceData() {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('1Hours');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId;

    async function fetchStats() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/resource-usage/?time=${timeRange}`);
        const apiData = response.data;

        const formattedData = apiData.timestamps.map((timestamp, index) => ({
          timestamp: moment(timestamp).format('HH:mm:ss'),
          CPU: apiData.cpu[index],
          RAM: apiData.ram[index],
          Disk: apiData.disk[index],
          NetworkSent: apiData.network_sent[index],
          NetworkReceived: apiData.network_recv[index],
        }));

        setChartData(formattedData);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
    intervalId = setInterval(fetchStats, POLL_INTERVAL);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [timeRange]);

  return { chartData, timeRange, setTimeRange, isLoading, error };
}

export default useResourceData;