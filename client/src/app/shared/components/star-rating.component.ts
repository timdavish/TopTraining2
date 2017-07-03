import { Component, Input } from '@angular/core';

@Component({
	selector: 'star-rating',
	templateUrl: './star-rating.component.html'
})
export class StarRatingComponent {
	private stars: Array<string> = [];
	private readonly star = {
		full: 'fa-star',
		half: 'fa-star-half-o',
		empty: 'fa-star-o'
	};

	@Input() rating: number;

	ngOnInit(): void {
		this.createStars();
	}

	onClick(rating: number): void {
		this.rating = rating;
		this.createStars();
	}

	private createStars(): void {
		for (let i = 1; i <= 5; i++) {
			const diff = this.rating - i;

			if (diff >= 0) {
				this.stars.push(this.star.full);
			} else if (diff >= -0.67) {
				this.stars.push(this.star.half);
			} else {
				this.stars.push(this.star.empty);
			}
		}
	}
}
