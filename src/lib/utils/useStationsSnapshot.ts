import type { StationsGeoJSONType } from '$lib/stores/mapData';
import { useStations } from '$lib/stores/stationsStore';
import {
	datavisType,
	dayEndDate,
	hour,
	hourKey,
	rangeEndDate,
	scale,
	unitWithMinMaxAvg
} from '$lib/stores/uiStore';
import { endOfDay, format, setHours } from 'date-fns';
import { derived, type Readable } from 'svelte/store';
import { api } from './api';
import { limitDateBoundsToToday } from './dateUtil';
import type { WeatherMeasurementKey } from './schemas';

export type SnapshotDataType = {
	[key: string]: number | string | null | undefined;
	id: string;
};

const date = derived(
	[dayEndDate, rangeEndDate, hour, datavisType],
	([endDate, rangeEndD, h, type]) => (type === 'range' ? endOfDay(rangeEndD) : setHours(endDate, h))
);

const dateKey = derived(
	[date, scale, datavisType],
	([d, s, dvt]) =>
		date && (s === 'hourly' && dvt !== 'range' ? d.toISOString() : format(d, 'yyyy-MM-dd'))
);

let ids: undefined | ReturnType<typeof useStations>;
let config:
	| undefined
	| Readable<{
			queryKey: (string | number | undefined)[];
			queryFn: () => Promise<SnapshotDataType[]>;
			enabled: boolean;
	  }>;

export function useStationsSnapshotConfig({
	initialStationIds = [],
	stations
}: {
	initialStationIds?: string[];
	stations: StationsGeoJSONType;
}) {
	ids = typeof ids === 'undefined' ? useStations({ initialStationIds, stations }) : ids;
	if (config) return config;
	config = derived(
		[unitWithMinMaxAvg, scale, date, dateKey, hourKey, datavisType],
		([unitWithMinMaxAvgVal, scaleVal, dateVal, dateKeyVal, hourKeyVal, datavisTypeVal]) => {
			return {
				queryKey: ['stations-snapshot', dateKeyVal, unitWithMinMaxAvgVal, scaleVal],
				queryFn: async () => {
					if (!dateVal || !unitWithMinMaxAvgVal || !scaleVal || !datavisTypeVal) return [];
					const dateWithHour = limitDateBoundsToToday({
						date: dateVal,
						hour: datavisTypeVal !== 'range' ? hourKeyVal : 23
					});
					const itemResults = await api().getStationsSnapshot({
						date: dateWithHour,
						param: unitWithMinMaxAvgVal as unknown as WeatherMeasurementKey,
						scale: scaleVal
					});
					const items = (stations.features || []).map((s) => {
						const station = (itemResults || []).find((f) => f.id === s.properties.id) as
							| SnapshotDataType
							| undefined;
						return {
							id: s.properties.id || station?.id || '',
							measured_at: station?.measured_at || new Date().toISOString(),
							station_type: s.properties.stationType,
							[unitWithMinMaxAvgVal]: station?.[unitWithMinMaxAvgVal]
						} satisfies SnapshotDataType;
					});
					return items;
				},
				enabled: Boolean(dateVal && unitWithMinMaxAvgVal)
			};
		}
	);
	return config;
}
