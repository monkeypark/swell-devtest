import { render, screen, waitFor } from '@testing-library/react';
import ReviewsList from './reviews-list';
import { jest } from '@jest/globals';
import axios from 'axios';

jest.mock('axios'); // Mock the entire axios module

const mockReviews = [
	{
		id: 'review_id_1',
		user: { firstName: 'John' },
		company: { name: 'Acme' },
		reviewText: 'Great product!',
	},
	{
		id: 'review_id_2',
		user: { firstName: 'Jane' },
		company: { name: 'XYZ' },
		reviewText: 'Excellent service!',
	},
];
describe('ReviewsList', () => {
	it('should render successfully', () => {
		const { baseElement } = render(<ReviewsList />);
		expect(baseElement).toBeTruthy();
	});

	it('should render list of reviews', async () => {
		axios.get.mockResolvedValueOnce({
			data: { reviews: mockReviews, reviewsCount: mockReviews.length },
		});
		render(<ReviewsList />);
		await waitFor(() => {
			expect(screen.getAllByTestId('review-data-testid').length).toBe(2);
			expect(screen.getByText(/John at Acme/i)).toBeInTheDocument();
			expect(screen.getByText(/Jane at XYZ/i)).toBeInTheDocument();
			expect(screen.getByText(/Great product!/i)).toBeInTheDocument();
			expect(screen.getByText(/Excellent service!/i)).toBeInTheDocument();
		});
	});

	it('should render No reviews found', async () => {
		axios.get.mockResolvedValueOnce({
			data: { reviews: [], reviewsCount: 0 },
		});
		render(<ReviewsList />);

		await waitFor(() => {
			expect(screen.getByText(/No reviews found./i)).toBeInTheDocument();
		});
	});

	it('should render error message', async () => {
		axios.get.mockResolvedValueOnce(new Error('Network error'));
		render(<ReviewsList />);
		await waitFor(() => {
			expect(screen.getByText(/Error fetching reviews/i)).toBeInTheDocument();
		});
	});
});
