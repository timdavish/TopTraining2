import { Component, Input } from '@angular/core';

@Component({
	selector: 'star-rating',
	templateUrl: './star-rating.component.html'
})
export class StarRatingComponent {
	private readonly star = {
		full: 'fa fa-star',
		half: 'fa fa-star-half-o',
		empty: 'fa fa-star-o'
	};

	private stars: Array<string> = [];

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
