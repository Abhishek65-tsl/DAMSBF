import { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import GraphicEqRoundedIcon from '@mui/icons-material/GraphicEqRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';

const PANEL_HEIGHT = 420;

function buildInsight(predictedFailures = [], anomalies = []) {
  const top = [...predictedFailures].sort((a, b) => (b.risk || 0) - (a.risk || 0))[0];
  const anomaly = anomalies[0];

  const anomalyText = anomaly
    ? `${anomaly.component} ${anomaly.type.toLowerCase()} pattern rising above baseline.`
    : 'No major anomaly spikes detected in latest cycle.';

  const failText = top
    ? `Predicted ${top.component.toLowerCase()} anomaly within ${top.eta} at ${Math.round(top.risk)}% risk.`
    : 'No immediate high-risk component predicted.';

  return `${anomalyText} ${failText}`;
}

export default function AIAssistantPanel({ predictedFailures = [], anomalies = [] }) {
  const insight = useMemo(() => buildInsight(predictedFailures, anomalies), [predictedFailures, anomalies]);
  const [typed, setTyped] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceTick, setVoiceTick] = useState(0);

  useEffect(() => {
    setTyped('');
    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setTyped(insight.slice(0, index));
      if (index >= insight.length) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [insight]);

  const handleAskAI = () => {
    const top = [...predictedFailures].sort((a, b) => (b.risk || 0) - (a.risk || 0))[0];
    if (!top) {
      setAiReply('AI: System is stable. Continue normal monitoring cadence.');
      return;
    }

    setAiReply(
      `AI: Prioritize ${top.component} in next maintenance window. Estimated failure horizon ${top.eta}, confidence ${Math.round((top.confidence || 0) * 100)}%.`
    );
  };

  useEffect(() => {
    if (!listening) return undefined;
    const t = setInterval(() => {
      setVoiceTick((v) => (v + 1) % 4);
    }, 450);
    return () => clearInterval(t);
  }, [listening]);

  return (
    <Card sx={{ height: '100%', minHeight: PANEL_HEIGHT, maxHeight: PANEL_HEIGHT }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToyRoundedIcon fontSize="small" />
          AI Insight Engine
        </Typography>

        <div className="ai-assistant-typing" style={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary">{typed}</Typography>
          {aiReply ? <Typography variant="body2" sx={{ mt: 1 }}>{aiReply}</Typography> : null}
          {listening ? <Typography variant="caption" color="text.secondary">{`Listening${'.'.repeat(voiceTick + 1)}`}</Typography> : null}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="contained"
            className="ai-action-btn"
            startIcon={<GraphicEqRoundedIcon />}
            onClick={() => setListening((v) => !v)}
          >
            {listening ? 'Stop Voice' : 'Voice'}
          </Button>
          <Button size="small" variant="contained" className="ai-action-btn" onClick={handleAskAI}>Ask AI</Button>
        </div>
      </CardContent>
    </Card>
  );
}
