import { Company, Review, User } from '@prisma/client';

export interface ReviewsCountResponse {
	reviewsCount: number;
}

export interface ReviewExt extends Review {
	company: Company;
	user: User;
}

export interface ReviewsResponse {
	reviews: ReviewExt[];
	reviewsCount?: number;
}
