import { Component } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Winery, WineryData } from '../winery/interface/winery.module';
import { Product, ProductData } from '../product/interface/product.module';
import { Purchase, PurchaseData, PurchaseDetail } from './interface/purchase.module';
import { ListReusable } from 'src/app/shared/interfaces/table-column';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WineryService } from '../winery/service/winery.service';
import { ProductService } from '../product/service/product.service';
import { PurchaseService } from './service/purchase.service';
import { PageEvent } from '@angular/material/paginator';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent {
  @BlockUI() blockUI!: NgBlockUI;
  quantity: number | null = null;
  wineryId: number | null = null;
  productId: number | null = null;
  searchForm: FormGroup;
  isEditing: boolean = false;
  selectedPurchaseId: string | null = null;

  startDate: Date | undefined; 
  endDate: Date | undefined;
  totalElements = 0;
  dataSource = new MatTableDataSource<Purchase>();


  productList: Product[] = []; 
  wineryData: Winery[] = [];
  productData: Product[] = [];  
  paginatedProducts: Product[] = [];  
  selectedProducts: Product[] = [];
  selectedProduct: { productId: number; quantity: number }[] = [];
  selectedWineryId: number | null = null;
  selectedProductId: number | null = null;

  purchaseData: Purchase[] = [];
  purchaseColumns: ListReusable[] = [
    { def: 'name', header: 'Nombre de winery' },
    { def: 'datePurchase', header: 'Fecha de compra'}
  ];
  currentPage = 0;
  pageSize = 8;
  totalProducts = 0;
  inputSearch: string = '';

  constructor(
    public purchaseService: PurchaseService,
    public wineryService: WineryService,
    public productService: ProductService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { 
    this.searchForm = this.fb.group({
      date: [null], // Campo para la fecha
    });
  }

  ngOnInit(): void {
    this.loadProduct();
    this.loadWinery();
    this.loadPurchase();
  }

  loadProduct(): void {
    this.productService.getData().subscribe((response: ProductData) => {
      this.productData = response.data.content;  
      this.totalProducts = response.data.totalElements; 
      this.paginateProducts();  
      console.log(response);
    });
  }

  loadWinery(): void {
    this.wineryService.getData().subscribe((response: WineryData) => {
      this.wineryData = response.data.content;
      console.log(response);
    });
  }

  loadPurchase(page: number = this.currentPage, size: number = this.pageSize): void {
    this.purchaseService.getData(page, size).subscribe((response: PurchaseData) => {
      this.purchaseData = response.data.content;
      this.totalProducts = response.data.totalElements;
      console.log(response);
    });
  }

  handlePageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPurchase();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPurchase(this.currentPage, this.pageSize);
  }

  paginateProducts(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedProducts = this.productData.slice(startIndex, endIndex);  
  }

  onPageChangeProduct(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;

    this.paginatedProducts = this.productData.slice(startIndex, endIndex);             
  }

  createOrUpdatePurchase(): void {
    this.isEditing && this.selectedPurchaseId ? this.updatePurchase() : this.createPurchase();
  }

  createPurchase(): void {
    const purchaseDetails: PurchaseDetail[] = this.selectedProducts.map(product => ({
      productId: product.id, 
      quantity: this.quantity ?? 1, 
      unitPrice: 0, 
      totalPrice: 0, 
      operationType: "ENTRADA" 
    }));
  
    const purchaseData: Purchase = {
      purchaseId: 0, 
      wineryId: this.selectedWineryId ?? 0,
      totalPurchase: 0, 
      purchaseDetails: purchaseDetails 
    };
  
    this.blockUI.start(this.translate.instant('LOADING'));
  
    this.purchaseService.createPurchase(purchaseData).subscribe({
      next: () => {
        this.resetForm(); 
        this.loadPurchase(); 
        this.snackBar.open(
          this.translate.instant('PURCHASE.CREATE_SUCCESS'),
          this.translate.instant('PURCHASE.CLOSE'),
          { duration: 5000 }
        );
        this.blockUI.stop();
      },
      error: () => {
        this.snackBar.open(
          this.translate.instant('PURCHASE.CREATE_ERROR'),
          this.translate.instant('PURCHASE.CLOSE'),
          { duration: 5000 }
        );
        this.blockUI.stop();
      }
    });
  }
  
  updatePurchase(): void {
    const purchaseDetails: PurchaseDetail[] = this.selectedProducts.map(product => ({
      productId: product.id, 
      quantity: this.quantity ?? 1, 
      unitPrice: 0, 
      totalPrice: 0, 
      operationType: "ENTRADA" 
    }));
  
    const purchaseData: Purchase = {
      purchaseId: Number(this.selectedPurchaseId), 
      wineryId: this.selectedWineryId ?? 0, 
      totalPurchase: 0,  
      purchaseDetails: purchaseDetails 
    };
  
    this.blockUI.start(this.translate.instant('LOADING'));
  
    this.purchaseService.updatePurchase(Number(this.selectedPurchaseId), purchaseData).subscribe({
      next: () => {
        this.resetForm(); 
        this.loadPurchase(); 
        this.snackBar.open(
          this.translate.instant('PURCHASE.UPDATE_SUCCESS'),
          this.translate.instant('PURCHASE.CLOSE'),
          { duration: 5000 }
        );
        this.blockUI.stop();
      },
      error: () => {
        this.snackBar.open(
          this.translate.instant('PURCHASE.UPDATE_ERROR'),
          this.translate.instant('PURCHASE.CLOSE'),
          { duration: 5000 }
        );
        this.blockUI.stop();
      }
    });
  }

  onItemSelected(item: any): void {
    if (item) {
      this.selectedPurchaseId = item.id;
      this.selectedWineryId = item.wineryId; 
  
      const purchaseDetail = item.purchaseDetails[0]; 
      const selectedProduct = this.productList.find(product => product.id === purchaseDetail.productId);
  
      if (selectedProduct) {
        this.quantity = purchaseDetail.quantity; 
        this.selectedProductId = selectedProduct.id;
        this.selectedProducts = [selectedProduct]; 
      }
  
      this.isEditing = true; 
    } else {
      this.resetForm(); 
      this.isEditing = false; 
    }
  }

  searchPurchases(): void {
    this.purchaseService.search(
      this.currentPage,
      this.pageSize,
      this.startDate,
      this.endDate
    ).subscribe({
      next: (response: PurchaseData) => {
        if (response && response.data) {
          this.totalElements = response.data.totalElements; 
          this.purchaseData = response.data.content; 
          console.log('Data encontrada en la búsqueda:', this.purchaseData); 
        } else {
          console.warn('La respuesta no tiene la estructura esperada:', response);
          this.snackBar.open('No se encontraron compras', 'Cerrar', { duration: 3000 });
        }
      },
      error: (error) => {
        this.snackBar.open('Error al buscar compras', 'Cerrar', { duration: 3000 });
        console.error('Error fetching purchases:', error);
      }
    });
  }

  

  clearSearch(): void {
    this.inputSearch = '';
    this.loadProduct();
  }

  clearSearchPurchase(): void {
    this.startDate = undefined;
    this.endDate = undefined;
    this.inputSearch = '';
    this.loadPurchase();
  }

  searchProducts(): void {
    this.productService.search(this.inputSearch).subscribe({
      next: (response) => {
        this.productData = response.data as unknown as Product[];
        this.paginatedProducts = this.productData.slice(0, this.pageSize);
        console.log(response);
      },
      error: (err) => {
        console.error('Error:', err);
        this.snackBar.open(
          this.translate.instant('PRODUCT.SEARCH_ERROR'),
          this.translate.instant('PRODUCT.CLOSE'),
          { duration: 5000 }
        );
      }
    });
  }

  getProductDescription(product: Product): string {
    return `${product.name} - ${product.price} Q`; 
  }

  resetForm(): void {
    this.selectedPurchaseId = null;
    this.quantity = null;
    this.selectedWineryId = null;
    this.selectedProductId = null;
    this.selectedProducts = [];
    this.isEditing = false;
  }

}