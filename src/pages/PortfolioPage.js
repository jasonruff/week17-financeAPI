// src/pages/PortfolioPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button, Modal, Form } from 'react-bootstrap';
import { getFavorites, updateFavorite, removeFavorite } from '../services/api';
import StockCard from '../components/StockCard';
import PortfolioSummary from '../components/PortfolioSummary';

const PortfolioPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [shares, setShares] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  // Load favorites when component mounts
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      setError('Failed to load portfolio. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFavorite(id);
      setFavorites(favorites.filter(stock => stock.id !== id));
    } catch (err) {
      setError('Failed to remove stock. Please try again.');
      console.error(err);
    }
  };

  const openUpdateModal = (stock) => {
    setCurrentStock(stock);
    setShares(stock.shares || '');
    setPurchasePrice(stock.purchasePrice || '');
    setShowModal(true);
  };

  const handleUpdatePortfolio = async () => {
    if (!currentStock) return;

    try {
      const updatedStock = {
        ...currentStock,
        shares: shares ? Number(shares) : null,
        purchasePrice: purchasePrice ? Number(purchasePrice) : null
      };
      
      await updateFavorite(updatedStock);
      
      // Update local state
      setFavorites(favorites.map(stock => 
        stock.id === currentStock.id ? updatedStock : stock
      ));
      
      setShowModal(false);
    } catch (err) {
      setError('Failed to update stock. Please try again.');
      console.error(err);
    }
  };

  // Calculate total portfolio value and performance
  const portfolioStats = {
    totalValue: favorites.reduce((sum, stock) => {
      return sum + (stock.shares ? stock.shares * stock.lastPrice : 0);
    }, 0),
    totalInvestment: favorites.reduce((sum, stock) => {
      return sum + (stock.shares && stock.purchasePrice ? stock.shares * stock.purchasePrice : 0);
    }, 0),
    stocksWithData: favorites.filter(stock => stock.shares && stock.purchasePrice).length,
    totalStocks: favorites.length
  };

  return (
    <Container className="py-4">
      <h2>My Portfolio</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <Alert variant="info">Loading portfolio...</Alert>
      ) : favorites.length === 0 ? (
        <Alert variant="info">
          Your portfolio is empty. Add stocks from the search page.
        </Alert>
      ) : (
        <>
          <PortfolioSummary stats={portfolioStats} />
          
          <h3 className="mt-4">My Stocks</h3>
          <Row>
            {favorites.map(stock => (
              <Col key={stock.id} xs={12} md={6} lg={4} className="mb-3">
                <StockCard 
                  stock={stock}
                  onRemove={() => handleRemove(stock.id)}
                  onUpdate={() => openUpdateModal(stock)}
                  showUpdateButton={true}
                  showRemoveButton={true}
                />
              </Col>
            ))}
          </Row>
        </>
      )}

      {/* Update Portfolio Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Update {currentStock?.symbol} in Portfolio
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Shares Owned</Form.Label>
              <Form.Control 
                type="number" 
                min="0"
                step="0.01"
                value={shares} 
                onChange={(e) => setShares(e.target.value)}
                placeholder="Enter number of shares"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Purchase Price (per share)</Form.Label>
              <Form.Control 
                type="number"
                min="0"
                step="0.01" 
                value={purchasePrice} 
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="Enter purchase price"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdatePortfolio}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PortfolioPage;