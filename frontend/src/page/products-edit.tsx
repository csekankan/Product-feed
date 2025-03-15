import React from 'react';
import { useProducts } from '../hooks/use-products';
import { ProductRow } from '../components/product-row-edit';
import '../css/edit.css'; 

export const ProductEdit: React.FC = () => {
  const { 
    handleSearch, 
    min, 
    max, 
    setMax, 
    setMin, 
    reset, 
    hasNext, 
    products, 
    loading, 
    handleProductChange, 
    loadMoreRows, 
    productName, 
    setProductName 
  } = useProducts();

  return (
    <div className="wrapper">
      <h2>Products</h2>

      {/* Search & Filter Section */}
      <div className="searchBox">
        <input
          type="text"
          className="input"
          placeholder="Product Name"
          value={productName ?? ''}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number"
          className="input"
          placeholder="Min Price"
          value={min ?? ''}
          onChange={(e) => setMin(e.target.value ? Number(e.target.value) : undefined)}
        />
        <input
          type="number"
          className="input"
          placeholder="Max Price"
          value={max ?? ''}
          onChange={(e) => setMax(e.target.value ? Number(e.target.value) : undefined)}
        />
        <button className="button" onClick={handleSearch}>Search</button>
        <button className="button" onClick={reset}>Reset</button>
      </div>

      {/* Product List */}
      <div className="container">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductRow key={product.id} product={product} onChange={handleProductChange} />
          ))
        ) : (
          <p className="no-products">No products found.</p>
        )}
      </div>

      {/* Load More Button */}
      {hasNext && (
        <div className="loadMoreContainer">
          <button className="loadMore" onClick={loadMoreRows} disabled={loading}>
            {loading ? 'Loading...' : 'View More'}
          </button>
        </div>
      )}
    </div>
  );
};
