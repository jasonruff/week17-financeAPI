import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { removeFavorite } from '../services/api';

const StockCard = ({ stock, isPortfolio, onRemove }) => {
  const handleRemove = async () => {
    try {
      await removeFavorite(stock.id);
      if (onRemove) {
        onRemove(stock.id);
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  // Calculate performance if in portfolio
  const calculatePerformance = () => {
    if (!isPortfolio || !stock.shares || !stock.purchasePrice || !stock.currentPrice) {
      return null;
    }

    const initialInvestment = stock.shares * stock.purchasePrice;
    const currentValue = stock.shares * stock.currentPrice;
    const gainLoss = currentValue - initialInvestment;
    const percentChange = (gainLoss / initialInvestment) * 100;

    return {
      initialInvestment: initialInvestment.toFixed(2),
      currentValue: currentValue.toFixed(2),
      gainLoss: gainLoss.toFixed(2),
      percentChange: percentChange.toFixed(2)
    };
  };

  const performance = calculatePerformance();

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">{stock.symbol}</h5>
          {isPortfolio && (
            <Badge 
              bg={parseFloat(performance?.percentChange) >= 0 ? "success" : "danger"}
            >
              {performance?.percentChange}%
            </Badge>
          )}
        </div>
        {!isPortfolio && (
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={handleRemove}
          >
            Remove
          </Button>
        )}
      </Card.Header>
      
      <Card.Body>
        <Card.Text>
          <p><strong>Price:</strong> ${isPortfolio ? stock.currentPrice : stock.price}</p>
          
          {isPortfolio && (
            <>
              <p><strong>Shares:</strong> {stock.shares}</p>
              <p><strong>Purchase Price:</strong> ${stock.purchasePrice}</p>
              <p>
                <strong>Total Value:</strong> ${performance?.currentValue}
                <br />
                <span className={parseFloat(performance?.gainLoss) >= 0 ? "text-success" : "text-danger"}>
                  {parseFloat(performance?.gainLoss) >= 0 ? "+" : ""}{performance?.gainLoss}
                </span>
              </p>
            </>
          )}
        </Card.Text>
        
        <Link to={`/stock/${stock.symbol}`}>
          <Button variant="primary" size="sm">View Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default StockCard;