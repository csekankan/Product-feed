export interface Product {
    id: number;
    store_id: number;
    sku: string;
    product_name: string;
    price: number;
    date: string;
    isUpdated?:boolean
  }
  