// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getPortfolio } from '../services/api';

const HomePage = () => {
  const [portfolioSummary, setPortfolioSummary] = useState({
    totalValue: 0,
    totalInvestment: 0,
    percentageChange: 0
  });
  
  useEffect(() => {
    // Load portfolio summary when component mounts
    const fetchPortfolioSummary = async () => {
      try {
        const portfolio = await getPortfolio();
        
        if (portfolio.length > 0) {
          const totalValue = portfolio.reduce((sum, item) => 
            sum + (item.currentPrice * item.shares), 0);
          
          const totalInvestment = portfolio.reduce((sum, item) => 
            sum + (item.purchasePrice * item.shares), 0);
          
          const percentageChange = totalInvestment > 0 
            ? ((totalValue - totalInvestment) / totalInvestment) * 100 
            : 0;
          
          setPortfolioSummary({
            totalValue: totalValue.toFixed(2),
            totalInvestment: totalInvestment.toFixed(2),
            percentageChange: percentageChange.toFixed(2)
          });
        }
      } catch (error) {
        console.error('Error fetching portfolio summary:', error);
      }
    };
    
    fetchPortfolioSummary();
  }, []);

  return (
    <div>
      <h1 className="mb-4">Stock Portfolio Tracker</h1>
      
      <Row className="mb-4">
        <Col>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Portfolio Summary</Card.Title>
              <div className="card-text-content">
                <div className="d-flex justify-content-around">
                  <div>
                    <h5>Total Value</h5>
                    <div>${portfolioSummary.totalValue}</div>
                  </div>
                  <div>
                    <h5>Total Investment</h5>
                    <div>${portfolioSummary.totalInvestment}</div>
                  </div>
                  <div>
                    <h5>Performance</h5>
                    <div className={portfolioSummary.percentageChange >= 0 ? "text-success" : "text-danger"}>
                      {portfolioSummary.percentageChange}%
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Search Stocks</Card.Title>
              <div className="card-text-content">
                Search for stocks by symbol and add them to your portfolio.
              </div>
              <Button as={Link} to="/search" variant="primary">Search</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>My Stocks</Card.Title>
              <div className="card-text-content">
                View and manage your stock portfolio.
              </div>
              <Button as={Link} to="/portfolio" variant="primary">View Portfolio</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;