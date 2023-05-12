import { Component, OnInit } from "@angular/core";
import { Cart } from "../../models/cart.model";
import { CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/core/services/cart.service";

@Component({
  selector: "app-cart",
  templateUrl: "cart.component.html",
})
export class CartComponent implements OnInit {
  constructor(private cartService: CartService) {}

  cart: Cart = { items: [] };

  dataSource: Array<CartItem> = [];

  displayedColumns: Array<string> = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveItem(item: CartItem): void {
    this.cartService.removeItem(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }
}
