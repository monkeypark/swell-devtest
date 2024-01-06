import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
	List,
	ListItem,
	Typography,
	Rating,
	Box,
	Button,
	Pagination,
	Select,
	MenuItem,
	SelectChangeEvent,
	Grid,
	Divider,
} from '@mui/material';
import { ReviewExt } from '../../types/reviews.types';

const ReviewsList: React.FC = () => {
	const [reviews, setReviews] = useState<ReviewExt[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalReviews, setTotalReviews] = useState(0);
	const [selectedReviewLimit, setSelectedReviewLimit] = useState('10');

	const reviewLimitOptions = [
		{ value: 10, label: '10' },
		{ value: 25, label: '25' },
		{ value: 50, label: '50' },
		{ value: 100, label: '100' },
		{ value: 0, label: 'All' },
	];

	async function fetchReviews() {
		try {
			setIsLoading(true);
			const response = await axios.get(
				`/api/reviews?page=${currentPage}&limit=${selectedReviewLimit}`,
			);
			setReviews(response.data.reviews);
			setTotalReviews(response.data.reviewsCount);
		} catch (error) {
			setError(true);
		} finally {
			setIsLoading(false);
		}
	}

	const updateLimit = (event: SelectChangeEvent) => {
		if (event.target.value == '0') {
			setCurrentPage(1);
			setSelectedReviewLimit(totalReviews + '');
		} else {
			setSelectedReviewLimit(event.target.value);
		}
	};

	useEffect(() => {
		fetchReviews();
	}, [currentPage, selectedReviewLimit]);

	const totalPages = Math.ceil(totalReviews / parseInt(selectedReviewLimit));
	const hasNextPage = currentPage < totalPages;
	const hasPreviousPage = currentPage > 1;

	if (error) {
		return (
			<Box
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
			>
				Error fetching reviews
			</Box>
		);
	}

	if (isLoading) {
		return (
			<Box
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
			>
				Loading...
			</Box>
		);
	}

	if (reviews && reviews.length === 0) {
		return (
			<Box
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
			>
				No reviews found.
			</Box>
		);
	}

	return (
		<>
			<List>
				{reviews.map((review, index) => (
					<React.Fragment key={review.id}>
						<ListItem data-testid="review-data-testid">
							<Grid container>
								<Grid item xs={6}>
									<Typography variant="body1" noWrap>
										{`${review.user.firstName} at ${review.company.name}`}
									</Typography>
								</Grid>
								<Grid item xs={6} sx={{ textAlign: 'right' }}>
									<Typography variant="body1">
										{`${review.createdOn} `}
										{review.rating && <Rating value={review.rating} />}
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography variant="body2">{review.reviewText}</Typography>
								</Grid>
							</Grid>
						</ListItem>
						{index !== reviews.length - 1 && <Divider />}
					</React.Fragment>
				))}
			</List>

			<Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
				<Select
					value={selectedReviewLimit}
					onChange={(event) => updateLimit(event)}
					label="Reviews per Page"
				>
					{reviewLimitOptions.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</Select>
			</Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
				<Typography variant="body2">
					Page {currentPage} of {totalPages}
				</Typography>
				<Pagination
					count={totalPages}
					page={currentPage}
					onChange={(event, newPage) => setCurrentPage(newPage)}
				/>
			</Box>
			<Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
				<Button disabled={!hasPreviousPage} onClick={() => setCurrentPage(currentPage - 1)}>
					Previous
				</Button>
				<Button disabled={!hasNextPage} onClick={() => setCurrentPage(currentPage + 1)}>
					Next
				</Button>
			</Box>
		</>
	);
};

export default ReviewsList;
