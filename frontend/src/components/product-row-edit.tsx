import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Product } from "../types/product";
import { updateProduct } from "../services/api-service";
import "../css/product-edit-row.css";

export const ProductRow: React.FC<{
  product: Product;
  onChange: (id: number, Product:Product) => void;
}> = React.memo(({ product, onChange }) => {
  const [price, setPrice] = useState(product.price);
  const [productName, setProductName] = useState(product.product_name);
  const [isRowUpdated,setIsRowUpdated]=useState(false)
  const saveDetails = () => {
    setIsRowUpdated(true)
    updateProduct(product.id, productName, price)
      .then((res) => {
        if (res.message === "Product updated") { 
          // onChange(product.id,product)
          console.log("updated")
          // toast.success("Product updated successfully!", {
          //   position: "top-center",
          //   autoClose: 2000,
          // });
        }
      })
      .catch((error) => {
        toast.error("Failed to update product!", {
          position: "top-center",
          autoClose: 3000,
        });
        console.error("Failed to update product:", error);
      });
  };

  return (
    <div className={["product-wrapper",isRowUpdated?"green-row":null].filter(Boolean).join(" ")}>
      <input
        className="row-input"
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input type="text" className="row-input" value={product.sku} readOnly />
      <input
        className="row-input"
        type="number"
        value={price}
        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
      />
      <input type="text" className="row-input" value={product.store_id} readOnly />
      <input type="text" className="row-input" value={new Date(product.date).toLocaleDateString()} readOnly />

      <button onClick={saveDetails} className="row-button">
        Update
      </button>
    </div>
  );
});
