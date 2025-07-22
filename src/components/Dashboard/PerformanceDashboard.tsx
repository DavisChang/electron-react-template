import { PerformanceData } from '@/shared/types';
import React, { useEffect, useState } from 'react';

const PerformanceDashboard: React.FC = () => {
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    // Listen for performance data
    window.context.onPerformanceData(data => {
      setPerformanceData(data);
    });

    // Listen for performance alerts
    window.context.onPerformanceAlert(alert => {
      setAlerts(prevAlerts => [...prevAlerts, alert.message]);
    });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Performance Dashboard</h1>

      {performanceData && (
        <div>
          <h2>System Performance</h2>
          <p>Total Memory: {performanceData.systemMemory.total}</p>
          <p>Free Memory: {performanceData.systemMemory.free}</p>
          <p>Used Memory: {performanceData.systemMemory.used}</p>
          <p>Average CPU Usage: {performanceData.systemCpu.averageUsage}</p>

          <h2>App Performance</h2>
          <p>App Memory (RSS): {performanceData.appMemory.rss}</p>
          <p>Heap Total: {performanceData.appMemory.heapTotal}</p>
          <p>Heap Used: {performanceData.appMemory.heapUsed}</p>
          <p>External: {performanceData.appMemory.external}</p>
          <p>App CPU (User): {performanceData.appCpu.user}</p>
          <p>App CPU (System): {performanceData.appCpu.system}</p>
        </div>
      )}

      {alerts.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Alerts</h2>
          <ul>
            {alerts.map((alert, index) => (
              <li key={index} style={{ color: 'red' }}>
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PerformanceDashboard;
