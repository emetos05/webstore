import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BehaviorSubject } from "rxjs";

import { Cart, CartItem } from "../../models/cart.model";

@Injectable({
  providedIn: "root",
})
export class CartService {
  constructor(private _snackBar: MatSnackBar) {}

  cart = new BehaviorSubject<Cart>({
    items: JSON.parse(localStorage.getItem("data") || "[]"),
  });

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);

    if (itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items });
    localStorage.setItem("data", JSON.stringify(items));
    this._snackBar.open("1 item added to cart.", "Ok", { duration: 3000 });
  }

  removeQuantity(item: CartItem): void {
    let itemToRemove: CartItem | undefined;

    let filtered = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity--;

        if (_item.quantity === 0) itemToRemove = _item;
      }

      return _item;
    });

    if (itemToRemove) filtered = this.removeItem(itemToRemove, false);

    this.cart.next({ items: filtered });
    localStorage.setItem("data", JSON.stringify(filtered));
    this._snackBar.open("1 item removed from cart.", "Ok", {
      duration: 3000,
    });
  }

  getTotal(items: Array<CartItem>): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    localStorage.setItem("data", JSON.stringify([]));
    this._snackBar.open("Cart is cleared.", "Ok", { duration: 3000 });
  }

  removeItem(item: CartItem, notify = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    if (notify) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open("1 item removed from cart.", "Ok", {
        duration: 3000,
      });
    }

    localStorage.setItem("data", JSON.stringify(filteredItems));

    return filteredItems;
  }
}
