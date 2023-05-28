import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { Subscription } from "rxjs";
import { StoreService } from "src/app/core/services/store.service";

@Component({
  selector: "app-filters",
  templateUrl: "filters.component.html",
})
export class FiltersComponent implements OnInit, OnDestroy {
  @Output() showCategory = new EventEmitter<string>();

  categories: Array<string> | undefined;
  categoriesSubsription: Subscription | undefined;

  constructor(private storeService: StoreService) {}
  ngOnInit(): void {
    this.storeService.getAllCategories().subscribe((_categories) => {
      this.categories = _categories;
    });
  }

  onShowCategory(category: string): void {
    this.showCategory.emit(category);
  }

  ngOnDestroy(): void {
    if (this.categoriesSubsription) this.categoriesSubsription.unsubscribe();
  }
}
