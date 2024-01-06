import { Controller, Get, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsCountResponse, ReviewsResponse } from './reviews.types';

@Controller('reviews')
export class ReviewsController {
	constructor(private reviewsService: ReviewsService) {}

	@Get()
	async getReviews(
		@Query('page') page: number,
		@Query('limit') limit: number,
	): Promise<ReviewsResponse> {
		try {
			let reviews = null;
			const reviewsCount = await this.reviewsService.getReviewsCount();
			if (page == null || limit == null) {
				reviews = await this.reviewsService.findAll();
				return { reviews, reviewsCount };
			}
			reviews = await this.reviewsService.getPaginatedReviews(page, limit);
			return { reviews, reviewsCount };
		} catch (error) {
			console.error('Error fetching reviews:', error);
		}
	}

	@Get('/count')
	async getReviewsCount(): Promise<ReviewsCountResponse> {
		const reviewsCount = await this.reviewsService.getReviewsCount();
		return { reviewsCount };
	}
}
