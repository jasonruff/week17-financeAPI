import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const PortfolioSummary = ({ summary }) => {
  return (
    <Card className="mb-4">
      <Card.Header>
        <h3>Portfolio Summary</h3>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={3} className="mb-3 mb-md-0">
            <h5>Total Value</h5>
            <p className="h4">${summary.totalValue}</p>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <h5>Total Investment</h5>
            <p className="h4">${summary.totalInvestment}</p>
          </Col>
          
          <Col md={3} className="mb-3 mb-md-0">
            <h5>Total Gain/Loss</h5>
            <p className={`h4 ${parseFloat(summary.totalGainLoss) >= 0 ? 'text-success' : 'text-danger'}`}>
              ${summary.totalGainLoss}
            </p>
          </Col>
          
          <Col md={3}>
            <h5>Performance</h5>
            <p className={`h4 ${parseFloat(summary.percentageChange) >= 0 ? 'text-success' : 'text-danger'}`}>
              {summary.percentageChange}%
            </p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PortfolioSummary;