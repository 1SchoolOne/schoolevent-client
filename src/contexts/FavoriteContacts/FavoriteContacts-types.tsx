export interface IFavorite {
	id: string
	name: string
	city: string
	postalCode: string
}

export interface IFavoriteContactsContext {
	favorites: IFavorite[]
	setFavorites: React.Dispatch<React.SetStateAction<IFavorite[]>>
	loading: boolean
	/** Deletes a favorite from the database. Refreshes the favorites list. */
	deleteFavorite: (id: string, userId: string) => Promise<void>
	/** Adds a favorite to the database. Refreshes the favorites list. */
	addFavorite: (userId: string, favorite: IFavorite) => Promise<void>
	/** Verifies if a favorite exists in the database. Returns true if it exists, false otherwise. */
	doesFavoriteExist: (id: string, userId: string) => Promise<boolean>
	refresh: () => void
}
