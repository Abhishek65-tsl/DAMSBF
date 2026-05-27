import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PsychologyAltRoundedIcon from '@mui/icons-material/PsychologyAltRounded';

const severityTone = {
  Critical: {
    border: '#ef4444',
    chipBg: '#ef4444',
    icon: ReportProblemRoundedIcon
  },
  High: {
    border: '#f97316',
    chipBg: '#f97316',
    icon: WarningAmberRoundedIcon
  },
  Medium: {
    border: '#eab308',
    chipBg: '#eab308',
    icon: WarningAmberRoundedIcon
  },
  Healthy: {
    border: '#22c55e',
    chipBg: '#22c55e',
    icon: CheckCircleRoundedIcon
  },
  Low: {
    border: '#22c55e',
    chipBg: '#22c55e',
    icon: CheckCircleRoundedIcon
  }
};

export default function AlertTable({ alerts = [] }) {
  const [expandedRecs, setExpandedRecs] = useState({});
  const [diagnostics, setDiagnostics] = useState({});

  const cards = useMemo(() => alerts.map((alert) => {
    const severity = severityTone[alert.severity] || severityTone.Medium;
    return {
      ...alert,
      tone: severity
    };
  }), [alerts]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1.5 }}>AI Alert Intelligence</Typography>
        <Box className="ai-alert-cards-grid">
          {cards.map((alert) => {
            const Icon = alert.tone.icon || PsychologyAltRoundedIcon;
            const showRec = Boolean(expandedRecs[alert.id]);
            const showDiag = Boolean(diagnostics[alert.id]);

            return (
              <Box
                key={alert.id}
                className="ai-alert-card"
                sx={{
                  borderLeft: `4px solid ${alert.tone.border}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon fontSize="small" sx={{ color: alert.tone.border }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{alert.component}</Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={alert.severity}
                    sx={{ background: alert.tone.chipBg, color: '#fff', fontWeight: 700 }}
                  />
                </Box>

                <Typography variant="body2" sx={{ mt: 0.8 }}>{alert.message}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.8 }}>
                  AI Confidence: {Math.round((alert.confidence || 0) * 100)}%
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mt: 1.2, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="contained"
                    className="ai-action-btn"
                    onClick={() => setDiagnostics((prev) => ({ ...prev, [alert.id]: !prev[alert.id] }))}
                  >
                    View Diagnostics
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    className="ai-action-btn"
                    onClick={() => setExpandedRecs((prev) => ({ ...prev, [alert.id]: !prev[alert.id] }))}
                  >
                    AI Recommendation
                  </Button>
                </Box>

                {showDiag ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Diagnostic: Check sensor calibration, inspect {alert.component.toLowerCase()} physically, and confirm anomaly trend for 3 consecutive cycles.
                  </Typography>
                ) : null}

                {showRec ? (
                  <Typography variant="body2" sx={{ mt: 0.8 }}>
                    Recommendation: {alert.recommendation}
                  </Typography>
                ) : null}
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
