import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function ResourceChart({ title, dataKey, data, color }) {
  return (
    <div className="chart-container">
      <h2 className='font-mono font-bold mb-2'>{title}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          {Array.isArray(dataKey) ? (
            dataKey.map((key, index) => (
              <Area key={key} type="monotone" dataKey={key} stroke={color[index]} fill={color[index]} />
            ))
          ) : (
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default React.memo(ResourceChart);