import { Component, OnInit } from "@angular/core";
import { Cart } from "../../models/cart.model";
import { CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/core/services/cart.service";
import { HttpClient } from "@angular/common/http";
import { loadStripe } from "@stripe/stripe-js";

@Component({
  selector: "app-cart",
  templateUrl: "cart.component.html",
})
export class CartComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private httpClient: HttpClient
  ) {}

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

  onCheckOut(): void {
    this.httpClient
      .post("http://localhost:4242/checkout", {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(
          "pk_test_51Mj2kEJVDKDhIaww7dQYqVewh0EqCCg2JzLvGrmXPSEwnuoyG3pd3ApmNv76sV8OKTGoqVuzagUOC2pRgy64KKjn00QHAlsNs0"
        );
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }
}
