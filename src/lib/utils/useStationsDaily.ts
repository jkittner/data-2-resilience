import { locale } from '$i18n/i18n-svelte';
import { stations } from '$lib/stores/mapData';
import { useStations } from '$lib/stores/stationsStore';
import {
	dayEndDate,
	dayKey,
	dayStartDate,
	hourKey,
	scale,
	unitWithMinMaxAvg
} from '$lib/stores/uiStore';
import { derived, type Readable } from 'svelte/store';
import { api } from './api';
import type { WeatherMeasurementKey } from './schemas';

export type DailyStationRecord = {
	id: string;
	label: string;
	value: number | undefined;
	supported: boolean;
};

let ids: undefined | ReturnType<typeof useStations>;
let config:
	| undefined
	| Readable<{
			queryKey: (string | number | undefined)[];
			queryFn: () => Promise<DailyStationRecord[]>;
			enabled: boolean;
	  }>;

export function useStationsDailyConfig(initialStationIds: string[] = []) {
	ids = typeof ids === 'undefined' ? useStations(initialStationIds) : ids;
	if (config) return config;
	config = derived(
		[ids, dayKey, unitWithMinMaxAvg, scale, hourKey, stations, dayStartDate, dayEndDate, locale],
		([
			idsVal,
			dayKeyVal,
			unitWithMinMaxAvgVal,
			scaleVal,
			hourKeyVal,
			stationsVal,
			dayStartDateVal,
			dayEndDateVal,
			localeVal
		]) => {
			return {
				queryKey: [
					'stationsData-daily',
					idsVal.join('-'),
					dayKeyVal,
					unitWithMinMaxAvgVal,
					scaleVal,
					hourKeyVal
				],
				queryFn: async () => {
					if (idsVal.length === 0 || !dayStartDateVal || !dayEndDateVal || !unitWithMinMaxAvgVal)
						return [];
					const promises = idsVal.map(async (id) => {
						if (idsVal.length === 0 || !dayStartDateVal || !dayEndDateVal || !unitWithMinMaxAvgVal)
							return;
						const itemResults = await api().getStationData({
							id,
							start_date: dayStartDateVal,
							end_date: dayEndDateVal,
							param: unitWithMinMaxAvgVal as unknown as WeatherMeasurementKey,
							scale: scaleVal
						});
						const label =
							stationsVal.features.find((f) => f.properties.id === id)?.properties.longName || id;
						if (itemResults === null) {
							return {
								id,
								label,
								value: undefined,
								supported: false
							};
						}
						const i = itemResults[0];
						return {
							id,
							label,
							value: i
								? (i[unitWithMinMaxAvgVal as keyof typeof i] as unknown as number)
								: undefined,
							supported: true
						};
					});

					const results = await Promise.all(promises);
					return (results as DailyStationRecord[]).sort((a, b) => {
						const aValue = a.value;
						const bValue = b.value;
						if (aValue === undefined && bValue === undefined)
							return b.label.localeCompare(a.label, localeVal);
						if (aValue === undefined) return -1;
						if (bValue === undefined) return 1;
						return b.label.localeCompare(a.label, localeVal);
					});
				},
				enabled: Boolean(
					idsVal.length > 0 && dayStartDateVal && dayEndDateVal && unitWithMinMaxAvgVal
				)
			};
		}
	);
	return config;
}
