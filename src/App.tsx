import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Paper, 
  Tabs, 
  Tab,
  Box,
  TextField,
  Button,
  Typography as MuiTypography,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [packageId, setPackageId] = useState('');
  const [storingOrderId, setStoringOrderId] = useState('');
  const [airwayBillNumber, setAirwayBillNumber] = useState('');
  const [billOfEntryId, setBillOfEntryId] = useState('');
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const testApi = async (endpoint: string, method: string = 'GET', body?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://kmoj7dnkpg.execute-api.us-east-2.amazonaws.com/Prod/${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await response.json();
      setApiResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API 호출 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderApiTestForm = () => {
    switch (currentTab) {
      case 0: // 패키지 조회
        return (
          <Card>
            <CardContent>
              <TextField
                fullWidth
                label="Package ID"
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                margin="normal"
              />
            </CardContent>
            <CardActions>
              <Button 
                variant="contained" 
                onClick={() => testApi(`package?packageId=${packageId}`)}
                disabled={!packageId}
              >
                패키지 조회
              </Button>
            </CardActions>
          </Card>
        );
      case 1: // 입고 주문 검증
        return (
          <Card>
            <CardContent>
              <TextField
                fullWidth
                label="Storing Order ID"
                value={storingOrderId}
                onChange={(e) => setStoringOrderId(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Airway Bill Number"
                value={airwayBillNumber}
                onChange={(e) => setAirwayBillNumber(e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Bill of Entry ID"
                value={billOfEntryId}
                onChange={(e) => setBillOfEntryId(e.target.value)}
                margin="normal"
              />
            </CardContent>
            <CardActions>
              <Button 
                variant="contained" 
                onClick={() => testApi('storing-order/check', 'POST', {
                  storingOrderId,
                  airwayBillNumber,
                  billOfEntryId
                })}
                disabled={!storingOrderId || !airwayBillNumber || !billOfEntryId}
              >
                입고 주문 검증
              </Button>
            </CardActions>
          </Card>
        );
      case 2: // 스캔 API들
        return (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Card sx={{ flex: '1 1 300px' }}>
              <CardContent>
                <MuiTypography variant="h6">패키지 스캔</MuiTypography>
              </CardContent>
              <CardActions>
                <Button 
                  variant="contained" 
                  onClick={() => testApi('packages')}
                >
                  패키지 목록 조회
                </Button>
              </CardActions>
            </Card>
            <Card sx={{ flex: '1 1 300px' }}>
              <CardContent>
                <MuiTypography variant="h6">픽슬립 스캔</MuiTypography>
              </CardContent>
              <CardActions>
                <Button 
                  variant="contained" 
                  onClick={() => testApi('pickslips')}
                >
                  픽슬립 목록 조회
                </Button>
              </CardActions>
            </Card>
            <Card sx={{ flex: '1 1 300px' }}>
              <CardContent>
                <MuiTypography variant="h6">입고 주문 스캔</MuiTypography>
              </CardContent>
              <CardActions>
                <Button 
                  variant="contained" 
                  onClick={() => testApi('storing-orders')}
                >
                  입고 주문 목록 조회
                </Button>
              </CardActions>
            </Card>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            WMS API 테스트
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" className="App-main">
        <Paper elevation={3}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="패키지 조회" />
            <Tab label="입고 주문 검증" />
            <Tab label="스캔 API" />
          </Tabs>
          
          <Box p={3}>
            {renderApiTestForm()}
            
            {loading && (
              <Box mt={3}>
                <MuiTypography>로딩 중...</MuiTypography>
              </Box>
            )}
            
            {error && (
              <Box mt={3}>
                <MuiTypography color="error">{error}</MuiTypography>
              </Box>
            )}
            
            {apiResponse && (
              <Box mt={3}>
                <MuiTypography variant="h6">API 응답:</MuiTypography>
                <pre style={{ 
                  backgroundColor: '#f5f5f5', 
                  padding: '1rem', 
                  borderRadius: '4px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default App;
