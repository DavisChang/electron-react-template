import os from 'os';
import process from 'process';

function getSystemPerformance() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;

  // CPU Usage
  const cpus = os.cpus();
  const cpuUsage = cpus.map(cpu => {
    const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0);
    const idle = cpu.times.idle;
    return 1 - idle / total;
  });
  const avgCpuUsage =
    cpuUsage.reduce((acc, usage) => acc + usage, 0) / cpuUsage.length;

  // App Memory Usage
  const processMemoryUsage = process.memoryUsage();

  // App CPU Usage
  const processCpuUsage = process.cpuUsage();

  return {
    systemMemory: {
      total: `${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
      free: `${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
      used: `${(usedMemory / 1024 / 1024 / 1024).toFixed(2)} GB`,
    },
    systemCpu: {
      averageUsage: `${(avgCpuUsage * 100).toFixed(2)}%`,
    },
    appMemory: {
      rss: `${(processMemoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(processMemoryUsage.heapTotal / 1024 / 1024).toFixed(
        2
      )} MB`,
      heapUsed: `${(processMemoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      external: `${(processMemoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
    },
    appCpu: {
      user: `${(processCpuUsage.user / 1000).toFixed(2)} ms`,
      system: `${(processCpuUsage.system / 1000).toFixed(2)} ms`,
    },
  };
}

export default getSystemPerformance;
