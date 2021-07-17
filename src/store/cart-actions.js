import { cartActions } from './cart-slice';
import { uiActions } from './ui-slice';

export const fetchCartData = () => {
	return async (dispatch) => {
		const fetchData = async () => {
			const response = await fetch(process.env.REACT_APP_FIREBASE_DB);
			if (!response.ok) {
				throw new Error('Could not fetch cart data');
			}
			const data = response.json();
			return data;
		};
		try {
			const cartData = await fetchData();
			console.log(cartData);
			dispatch(
				cartActions.replaceCart({
					items: cartData.items || [],
					totalQuantity: cartData.totalQuantity,
				})
			);
		} catch (err) {
			dispatch(
				uiActions.showNotification({
					status: 'error',
					title: 'Error!',
					message: 'Fetching cart data failed!',
				})
			);
		}
	};
};

export const sendCartData = (cart) => {
	return async (dispatch) => {
		dispatch(
			uiActions.showNotification({
				status: 'pending',
				title: 'Sending...',
				message: 'Sending cart data!',
			})
		);

		const sendRequest = async () => {
			const response = await fetch(process.env.REACT_APP_FIREBASE_DB, {
				method: 'PUT',
				body: JSON.stringify({
					items: cart.items,
					totalQuantity: cart.totalQuantity,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to send cart data!');
			}
		};

		try {
			await sendRequest();
			dispatch(
				uiActions.showNotification({
					status: 'success',
					title: 'Success!',
					message: 'Sent cart data successfully!',
				})
			);
		} catch (err) {
			dispatch(
				uiActions.showNotification({
					status: 'error',
					title: 'Error!',
					message: 'Sent cart data failed!',
				})
			);
		}
	};
};
