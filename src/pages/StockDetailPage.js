// src/pages/StockDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Table } from 'react-bootstrap';
import { getStockDetail, addToFavorites, getFavoriteBySymbol, updateFavorite } from '../services/api';

const StockDetailPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  
  const [stockData, setStockData] = useState(null);
  const [portfolioData, setPortfolioData] = useState({
    inPortfolio: false,
    id: null,
    shares: '',
    purchasePrice: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load stock details
        const data = await getStockDetail(symbol);
        setStockData(data);
        
        // Check if already in portfolio
        const favorite = await getFavoriteBySymbol(symbol);
        if (favorite) {
          setPortfolioData({
            inPortfolio: true,
            id: favorite.id,
            shares: favorite.shares || '',
            purchasePrice: favorite.purchasePrice || ''
          });
        }
      } catch (err) {
        setError('Failed to load stock details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [symbol]);

  const handleAddToPortfolio = async () => {
    try {
      if (!stockData || stockData.length === 0) return;
      
      await addToFavorites({
        symbol: stockData[0].trading_symbol,
        lastPrice: stockData[0].close,
        date: stockData[0].date
      });
      
      // Reload the page to update the UI
      window.location.reload();
    } catch (err) {
      setError('Failed to add stock to portfolio. Please try again.');
      console.error(err);
    }
  };

  const handleUpdatePortfolio = async () => {
    try {
      if (!portfolioData.inPortfolio || !stockData) return;
      
      const updatedStock = {
        id: portfolioData.id,
        symbol: symbol,
        lastPrice: stockData[0].close,
        date: stockData[0].date,
        shares: portfolioData.shares ? Number(portfolioData.shares) : null,
        purchasePrice: portfolioData.purchasePrice ? Number(portfolioData.purchasePrice) : null
      };
      
      await updateFavorite(updatedStock);
      setSuccess('Portfolio updated successfully!');
    } catch (err) {
      setError('Failed to update portfolio. Please try again.');
      console.error(err);
    }
  };

  const calculatePerformance = () => {
    if (!stockData || !portfolioData.shares || !portfolioData.purchasePrice) {
      return { value: 0, cost: 0, profit: 0, percentChange: 0 };
    }
    
    const currentPrice = stockData[0].close;
    const shares = Number(portfolioData.shares);
    const purchasePrice = Number(portfolioData.purchasePrice);
    
    const currentValue = shares * currentPrice;
    const cost = shares * purchasePrice;
    const profit = currentValue - cost;
    const percentChange = ((currentPrice - purchasePrice) / purchasePrice) * 100;
    
    return { currentValue, cost, profit, percentChange };
  };

  const performance = calculatePerformance();

  return (
    <Container className="py-4">
      {loading ? (
        <Alert variant="info">Loading stock details...</Alert>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : !stockData || stockData.length === 0 ? (
        <Alert variant="warning">No data found for {symbol}</Alert>
      ) : (
        <>
          <Row className="mb-4">
            <Col>
              <h2>{symbol} - Stock Details</h2>
              <Button 
                variant="secondary" 
                onClick={() => navigate(-1)} 
                className="mt-2"
              >
                Back
              </Button>
            </Col>
          </Row>

          {success && <Alert variant="success">{success}</Alert>}

          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h3>{symbol} Overview</h3>
                </Card.Header>
                <Card.Body>
                  <p><strong>Latest Price:</strong> ${stockData[0].close.toFixed(2)}</p>
                  <p><strong>Date:</strong> {stockData[0].date}</p>
                  <p>
                    <strong>Day Range:</strong> ${stockData[0].low.toFixed(2)} - ${stockData[0].high.toFixed(2)}
                  </p>
                  <p><strong>Open:</strong> ${stockData[0].open.toFixed(2)}</p>
                  <p><strong>Volume:</strong> {stockData[0].volume.toLocaleString()}</p>
                  
                  {!portfolioData.inPortfolio && (
                    <Button 
                      variant="primary" 
                      onClick={handleAddToPortfolio}
                    >
                      Add to Portfolio
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h3>Portfolio Management</h3>
                </Card.Header>
                <Card.Body>
                  {!portfolioData.inPortfolio ? (
                    <Alert variant="info">
                      Add this stock to your portfolio first to track your investment.
                    </Alert>
                  ) : (
                    <Form>
                      <Form.Group className="mb-3">
                        <Form.Label>Shares Owned</Form.Label>
                        <Form.Control 
                          type="number" 
                          min="0"
                          step="0.01"
                          value={portfolioData.shares} 
                          onChange={(e) => setPortfolioData(prev => ({
                            ...prev, 
                            shares: e.target.value
                          }))}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Purchase Price (per share)</Form.Label>
                        <Form.Control 
                          type="number"
                          min="0"
                          step="0.01" 
                          value={portfolioData.purchasePrice} 
                          onChange={(e) => setPortfolioData(prev => ({
                            ...prev, 
                            purchasePrice: e.target.value
                          }))}
                        />
                      </Form.Group>
                      <Button 
                        variant="primary" 
                        onClick={handleUpdatePortfolio}
                      >
                        Update Portfolio
                      </Button>
                    </Form>
                  )}
                </Card.Body>
              </Card>

              {portfolioData.inPortfolio && 
               portfolioData.shares && 
               portfolioData.purchasePrice && (
                <Card>
                  <Card.Header>
                    <h3>Performance</h3>
                  </Card.Header>
                  <Card.Body>
                    <p>
                      <strong>Current Value:</strong> ${performance.currentValue.toFixed(2)}
                    </p>
                    <p>
                      <strong>Cost Basis:</strong> ${performance.cost.toFixed(2)}
                    </p>
                    <p>
                      <strong>Profit/Loss:</strong>{' '}
                      <span className={performance.profit >= 0 ? 'text-success' : 'text-danger'}>
                        ${performance.profit.toFixed(2)} ({performance.percentChange.toFixed(2)}%)
                      </span>
                    </p>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Header>
                  <h3>Recent Price History</h3>
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Open</th>
                        <th>High</th>
                        <th>Low</th>
                        <th>Close</th>
                        <th>Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.slice(0, 10).map((day, index) => (
                        <tr key={index}>
                          <td>{day.date}</td>
                          <td>${day.open.toFixed(2)}</td>
                          <td>${day.high.toFixed(2)}</td>
                          <td>${day.low.toFixed(2)}</td>
                          <td>${day.close.toFixed(2)}</td>
                          <td>{day.volume.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default StockDetailPage;