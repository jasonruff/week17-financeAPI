// src/pages/SearchPage.js
import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { searchStock, addToFavorites } from '../services/api';
import StockCard from '../components/StockCard';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setError('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const data = await searchStock(searchTerm.toUpperCase());
      setSearchResults(data);
    } catch (err) {
      setError('Error finding stock. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!searchResults) return;
    
    try {
      await addToFavorites({
        symbol: searchResults[0].trading_symbol,
        lastPrice: searchResults[0].close,
        date: searchResults[0].date
      });
      
      setSuccess(`${searchResults[0].trading_symbol} added to favorites!`);
    } catch (err) {
      setError('Error adding to favorites. Please try again.');
      console.error(err);
    }
  };

  return (
    <Container className="py-4">
      <h2>Search Stocks</h2>
      <p>Enter a stock symbol to search (e.g., AAPL, MSFT, GOOGL)</p>

      <Form onSubmit={handleSearch} className="mb-4">
        <Row>
          <Col xs={12} md={8} lg={6}>
            <Form.Group className="mb-3" controlId="stockSymbol">
              <Form.Control
                type="text"
                placeholder="Enter stock symbol"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4} lg={2}>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
              className="w-100"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Col>
        </Row>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      {searchResults && searchResults.length > 0 && (
        <div className="mt-4">
          <h3>Search Results</h3>
          <StockCard 
            stock={searchResults[0]}
            onAddToFavorites={handleAddToFavorites}
            showAddButton={true}
          />
        </div>
      )}

      {searchResults && searchResults.length === 0 && (
        <Alert variant="info">No results found for "{searchTerm}"</Alert>
      )}
    </Container>
  );
};

export default SearchPage;