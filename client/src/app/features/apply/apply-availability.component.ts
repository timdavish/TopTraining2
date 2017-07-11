// this.userService.update(this.user)
// 	.takeUntil(this.ngUnsubscribe)
// 	.subscribe(
// 		updatedUser => {
// 			localStorage.setItem(this.profileItemName, JSON.stringify(this.profile));
// 			this.router.navigateByUrl('/trainer_app/apply/' + this.next);
// 		},
// 		err => {
// 			// Remove the profile from the user's profiles but keep the profile data
// 			// this.user.profiles.filter((p) => { return p.sport === this.profile.sport; });
// 			this.errors = err;
// 			this.isSubmitting = false;
// 		}
// 	);

// class Marker {
// 	constructor (public lat: number,
// 				public lng: number,
// 				public label?: string,
// 				public draggable: boolean = false) {
//
// 	}
// }
