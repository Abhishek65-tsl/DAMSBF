import { Typography, Box, Grid, Paper } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import AdvancedChart from '../Components/Advancedchart';
import { useState } from 'react';

function Home() {
  const [chartOption] = useState({
    title: {
      text: 'Bar Chart Example'
    },
    tooltip: {},
    xAxis: {
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: {},
    series: [{
      name: 'Sales',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome Home tsk
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Basic Chart
            </Typography>
            <Box sx={{ height: 400 }}>
              <ReactECharts
                option={chartOption}
                style={{ height: '100%', width: '100%' }}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <AdvancedChart />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
