export interface Purchase {
    purchaseId: number; 
    wineryId: number;  
    totalPurchase: number; 
    purchaseDetails: PurchaseDetail[]; 
}
  
export interface PurchaseDetail {
    productId: number;  
    quantity: number;   
    unitPrice: number;   
    totalPrice: number; 
    operationType: string;  
}

export interface PurchaseData {
    message: string;
    data: {
      content: Purchase[];
      totalElements: number;
        totalPages: number; 
        size: number;
    };
}