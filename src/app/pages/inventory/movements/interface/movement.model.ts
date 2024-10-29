export interface Movement {
  movementId: number;
  productId: number;
  nameProduct: string;
  wineryId: number;
  nameWinery: string;
  userId: number;
  nameUser: string;
  quantity: number;
  totalPrice: number;
  operationType: string;
  dateMovement: string;
  status: boolean;
}

export interface MovementData {
  message: string;
  code: number;
  path: string;
  data: {
    content: Movement[];
    totalElements: number;
    totalPages: number; 
    size: number;
  }
}