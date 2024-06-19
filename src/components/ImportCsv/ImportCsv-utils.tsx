import Papa from 'papaparse'

import { ImportItem } from './ImportCsv-types'

interface CSVRow {
	Adresse: string | null
	Ville: string
	Latitude: string | null
	Longitude: string | null
	Email: string | null
	CodePostal: string
	NomEcole: string
	TypeEcole: string
	Telephone: string | null
}

const mapCSVToImportItem = (row: CSVRow, userId: string): ImportItem => {
	return {
		address: row.Adresse,
		city: row.Ville,
		created_at: new Date().toISOString(),
		latitude: row.Latitude,
		longitude: row.Longitude,
		mail: row.Email,
		postal_code: row.CodePostal,
		school_name: row.NomEcole,
		school_type: row.TypeEcole,
		telephone: row.Telephone,
		user_id: userId,
	}
}

export const parseCsv = (file: File, userId: string): Promise<ImportItem[]> => {
	return new Promise((resolve, reject) => {
		Papa.parse<CSVRow>(file, {
			header: true,
			transformHeader: (header) => header.trim(),
			complete: (results) => {
				if (results.errors.length) {
					reject(new Error(`Parsing errors: ${results.errors.map((e) => e.message).join(', ')}`))
				} else {
					try {
						const data = results.data.map((row) => mapCSVToImportItem(row, userId))
						resolve(data)
					} catch (error) {
						reject(new Error('Error mapping CSV data to ImportItem'))
					}
				}
			},
		})
	})
}
