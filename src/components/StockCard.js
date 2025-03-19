// src/components/StockCard.js
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { removeFavorite } from '../services/api';

const StockCard = ({ stock, onAddToFavorites, showAddButton, onRemove, onUpdate, showUpdateButton, showRemoveButton, isPortfolio }) => {
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

  // Find the appropriate price field to display
  const displayPrice = isPortfolio ? stock.currentPrice : 
                      (stock.close ? stock.close : 
                      (stock.lastPrice ? stock.lastPrice : 'N/A'));

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div>
          <h5 className="mb-0">{stock.symbol || stock.trading_symbol}</h5>
          {isPortfolio && performance && (
            <Badge 
              bg={parseFloat(performance.percentChange) >= 0 ? "success" : "danger"}
            >
              {performance.percentChange}%
            </Badge>
          )}
        </div>
        
        {showRemoveButton && (
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={handleRemove}
          >
            Remove
          </Button>
        )}
        
        {showUpdateButton && (
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={onUpdate}
          >
            Update
          </Button>
        )}
      </Card.Header>
      
      <Card.Body>
        <div className="card-text-content">
          <div><strong>Price:</strong> ${typeof displayPrice === 'number' ? displayPrice.toFixed(2) : displayPrice}</div>
          
          {stock.date && (
            <div><strong>Date:</strong> {stock.date}</div>
          )}
          
          {isPortfolio && performance && (
            <>
              <div><strong>Shares:</strong> {stock.shares}</div>
              <div><strong>Purchase Price:</strong> ${stock.purchasePrice}</div>
              <div>
                <strong>Total Value:</strong> ${performance.currentValue}
                <br />
                <span className={parseFloat(performance.gainLoss) >= 0 ? "text-success" : "text-danger"}>
                  {parseFloat(performance.gainLoss) >= 0 ? "+" : ""}{performance.gainLoss}
                </span>
              </div>
            </>
          )}
        </div>
        
        {showAddButton && onAddToFavorites && (
          <Button 
            variant="success" 
            size="sm" 
            onClick={onAddToFavorites}
            className="me-2 mt-2"
          >
            Add to Favorites
          </Button>
        )}
        
        <Link to={`/stock/${stock.symbol || stock.trading_symbol}`}>
          <Button variant="primary" size="sm" className="mt-2">View Details</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default StockCard;