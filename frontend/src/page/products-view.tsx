import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/use-products';
import { InfiniteScroll } from '../components/infinite-scroll';
import '../css/view-product.css';  // Import the CSS file

export const Products: React.FC = () => {
  const { handleSearch, min, max, setMax, setMin, reset, hasNext, products, loading, loadProducts, handleProductChange, loadMoreRows, productName, setProductName } = useProducts();

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="products-wrapper">
      <h2>Products</h2>
      <div className="search-box">
        <input
          type="text"
          className="input"
          placeholder="Search by Product Name"
          value={productName ?? ''}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number"
          className="input"
          placeholder="Min Price"
          value={min ?? ''}
          onChange={(e) => setMin(e.target?.value ? Number(e.target.value) : null)}
        />
        <input
          type="number"
          className="input"
          placeholder="Max Price"
          value={max ?? ''}
          onChange={(e) => setMax(e.target.value ? Number(e.target.value) : null)}
        />
        <button className="button" onClick={handleSearch}>Search</button>
        <button className="button" onClick={reset}>Reset</button>
      </div>

      <div className="products-container">
        <InfiniteScroll
          products={products}
          loadMoreRows={loadMoreRows}
          hasNext={hasNext}
          handleProductChange={handleProductChange}
        />
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};
