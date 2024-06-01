import { useQuery } from '@tanstack/react-query'

async function fetchGeoIP() {
	const response = await fetch('http://ip-api.com/json/?fields=lat,lon')
	const data = (await response.json()) as { lat: number; lon: number }

	return data
}

export function useGeoIP() {
	return useQuery({ queryKey: ['user-geoip'], queryFn: fetchGeoIP })
}
