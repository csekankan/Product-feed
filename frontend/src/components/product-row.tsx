import { useState } from "react";
import { Product } from "../types/product";
import { updateProduct } from "../services/api-service";

export const ProductRow: React.FC<{
  product: Product;
  style: React.CSSProperties;
  onChange: (id: number, field: string, value: string | number) => void;
}> = ({ product, style, onChange }) => {
  const [price, setPrice] = useState(product.price);
  const [productName, setProductName] = useState(product.product_name);
  const saveDetails = async () => {
   
    try {
      const res = await updateProduct(product.id, productName, price);
      if (res.status === 200) {
        //Avoid unnecessary updates to parent (onChange) on every keystroke
        // when saving, it updates the parent state after a successful API response.
        onChange(product.id, "product_name", productName);
        onChange(product.id, "price", price);

      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  return (
    <div
      key={product.id}
      style={{
        ...style,
        width: "95%",
        display: "flex",
        padding: "10px",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Product Name (Editable) */}
      <div style={{ flex: 1 }}>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={styles.input}
        />
      </div>

      {/* SKU (Read-Only) */}
      <div style={{ flex: 1 }}>
        <input type="text" value={product.sku} style={styles.input} readOnly />
      </div>

      {/* Price (Editable) */}
      <div style={{ flex: 1 }}>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
          style={styles.input}
        />
      </div>

      {/* Store ID (Read-Only) */}
      <div style={{ flex: 1 }}>
        <input
          type="text"
          value={product.store_id}
          style={styles.input}
          readOnly
        />
      </div>

      {/* Date (Read-Only) */}
      <div style={{ flex: 1 }}>
        <input
          type="text"
          value={new Date(product.date).toLocaleDateString()}
          style={styles.input}
          readOnly
        />
      </div>

      {/* Save Button */}
      {/* <div style={{ flex: 0.4 }}>
        <button onClick={saveDetails} style={styles.button}>
          Update
        </button>
        {product?.isUpdated && <span style={{ color: "green", marginLeft: "10px" }}>Saved</span>}
      </div> */}
    </div>
  );
};

// Styles
const styles = {
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};
