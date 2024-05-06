export interface IQueryParams {
	limit: number
	offset: number
	select?: string
	where?: string
	orderBy?: string
}

export interface ISchool {
	identifiant_de_l_etablissement: string | null
	nom_etablissement: string
	type_etablissement: string
	adresse_1: string
	code_postal: string
	nom_commune: string
	latitude: number | null
	longitude: number | null
	mail: string | null
	telephone: string | null
	favoris: boolean
}

export interface IAPIResponse {
	total_count: number
	results: Omit<ISchool, 'favoris'>[]
}
