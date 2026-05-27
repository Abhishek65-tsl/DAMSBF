import { useMemo } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactECharts from 'echarts-for-react';

export default function SensorGraphModal({
  open,
  onClose,
  title,
  sensorKey,
  sensorSeries,
  color = '#2563eb',
  isLight = false
}) {
  const option = useMemo(() => {
    const chartText = isLight ? '#26435f' : '#f8fafc';
    const chartMutedText = isLight ? '#516b84' : '#e2e8f0';
    const chartGrid = isLight ? 'rgba(148, 163, 184, 0.24)' : 'rgba(148, 163, 184, 0.46)';
    const chartAxisLine = isLight ? 'rgba(148, 163, 184, 0.55)' : 'rgba(148, 163, 184, 0.7)';
    const chartTooltipBg = isLight ? 'rgba(255,255,255,0.96)' : 'rgba(2, 6, 23, 0.98)';

    const xData = sensorSeries.map((point) =>
      new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );
    const yData = sensorSeries.map((point) => Number(point[sensorKey] ?? 0));

    return {
      backgroundColor: 'transparent',
      textStyle: { fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', color: chartText },
      tooltip: {
        trigger: 'axis',
        backgroundColor: chartTooltipBg,
        borderColor: isLight ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.24)',
        textStyle: { color: chartText }
      },
      toolbox: {
        right: 10,
        showTitle: true,
        tooltip: { show: true, position: 'right' },
        iconStyle: { borderColor: chartMutedText },
        emphasis: { iconStyle: { borderColor: chartText } },
        feature: {
          dataZoom: { title: { zoom: 'Zoom', back: 'Reset Zoom' } },
          restore: { title: 'Restore' },
          saveAsImage: { title: 'Save As Image' }
        }
      },
      grid: { left: 48, right: 24, top: 62, bottom: 84 },
      xAxis: {
        type: 'category',
        data: xData,
        axisLabel: { color: chartMutedText },
        axisLine: { lineStyle: { color: chartAxisLine } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: chartMutedText },
        splitLine: { lineStyle: { color: chartGrid } }
      },
      dataZoom: [{ type: 'inside' }, { type: 'slider', height: 18, bottom: 18 }],
      series: [
        {
          name: title,
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: yData,
          lineStyle: { width: 4, color },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: color + '66' },
                { offset: 1, color: color + '08' }
              ]
            }
          }
        }
      ]
    };
  }, [sensorSeries, sensorKey, title, color, isLight]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: isLight
          ? { borderRadius: 3, background: 'rgba(255,255,255,0.98)', color: '#10233c' }
          : {
            borderRadius: 3,
            background: 'linear-gradient(160deg, #020617 0%, #0f172a 100%)',
            color: '#f8fafc',
            border: '1px solid rgba(148, 163, 184, 0.28)'
          }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1.2 }}>
        <div>
          <Typography variant="overline" sx={{ letterSpacing: 1.2, color: isLight ? '#516b84' : '#cbd5e1' }}>Digital Asset Management System</Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: isLight ? '#10233c' : '#f8fafc' }}>{title} Graph</Typography>
        </div>
        <IconButton onClick={onClose} sx={{ color: isLight ? '#26435f' : '#f8fafc' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ReactECharts option={option} style={{ width: '100%', height: 460 }} notMerge lazyUpdate />
      </DialogContent>
    </Dialog>
  );
}
