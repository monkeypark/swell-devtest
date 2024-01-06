import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReviewsService {
	constructor(private prisma: DatabaseService) {}

	getReviewsCount() {
		return this.prisma.review.count();
	}

	findAll() {
		const reviews = this.prisma.review.findMany({
			include: { company: true, user: true },
			orderBy: {
				createdOn: 'desc',
			},
		});
		return reviews;
	}

	getPaginatedReviews(page, limit) {
		const reviews = this.prisma.review.findMany({
			include: { company: true, user: true },
			orderBy: {
				createdOn: 'desc',
			},
			skip: (page - 1) * limit,
			take: parseInt(limit),
		});
		return reviews;
	}
}
