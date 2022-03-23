import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import { styles } from './styles';
import { Product, ProductProps } from '../Product';

export function ShoppingList() {
	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState<ProductProps[]>([]);

	useEffect(() => {
		const subscribe = firestore()
			.collection('products')
			.onSnapshot(querySnapshot => {
				const data = querySnapshot.docs.map(doc => {
					return {
						id: doc.id,
						...doc.data(),
					};
				}) as ProductProps[];

				setProducts(data);

				setLoading(false);
			});

		return () => subscribe();
	}, []);

	return (
		<>
			{loading ? (
				<ActivityIndicator size={32} color='#7273E9' />
			) : (
				<FlatList
					data={products}
					keyExtractor={item => item.id}
					renderItem={({ item }) => <Product data={item} />}
					showsVerticalScrollIndicator={false}
					style={styles.list}
					contentContainerStyle={styles.content}
				/>
			)}
		</>
	);
}
