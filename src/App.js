import React from 'react';
import './App.css';
import ResourceChart from './components/resourceChart';
import useResourceData from './utils/useResourceDatahook';
import ThemeToggle from './components/themeToggle';
import ErrorBoundary from './components/errorBoundary';

function App() {
  const [theme, setTheme] = React.useState('dark');
  const { chartData, timeRange, setTimeRange, isLoading, error } = useResourceData();
  React.useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  return (
    <ErrorBoundary>
      <div className={`App ${theme} bg-black`}>
        <header className="p-5">
          <h1 className="text-4xl font-bold mb-4">Resource Monitor</h1>
          <div className="flex justify-between items-center mb-4">
            <select
              className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
              onChange={(e) => setTimeRange(e.target.value)}
              value={timeRange}
              aria-label="Select time range"
            >
              <option value="1Hours">Last Hour</option>
              <option value="24Hours">Last 24 Hours</option>
              <option value="7Days">Last 7 Days</option>
              <option value="30Days">Last 30 Days</option>
            </select>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </header>
        
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        
        <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResourceChart title="CPU Usage" dataKey="CPU" data={chartData} color="#8884d8" />
          <ResourceChart title="RAM Usage" dataKey="RAM" data={chartData} color="#82ca9d" />
          <ResourceChart title="Disk Usage" dataKey="Disk" data={chartData} color="#ffc658" />
          <ResourceChart 
            title="Network Traffic" 
            dataKey={["NetworkSent", "NetworkReceived"]} 
            data={chartData} 
            color={["#ff7300", "#387908"]} 
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;