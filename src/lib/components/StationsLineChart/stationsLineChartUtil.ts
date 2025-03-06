import type { StationsGeoJSONType } from "$lib/stores/mapData";
import { api } from "$lib/utils/api";
import type { WeatherMeasurementKeyNoMinMax } from "$lib/utils/schemas";
import { compareAsc, format, isValid, parseISO } from "date-fns";

type ParsedValueType = {
	id: string;
	measured_at?: string;
	value: string;
};

export const getStationDataFetcher =
	({
		ids,
		start_date,
		end_date,
		unit,
		stations,
	}: {
		ids: string[];
		start_date?: Date;
		end_date?: Date;
		unit: string | null;
		stations: StationsGeoJSONType["features"];
	}) =>
		async () => {
			const idsInStations = ids.filter((id) => stations.find((f) => f.properties.id === id))
			if (idsInStations.length === 0 || !start_date || !end_date || !unit) return;
			const promises = idsInStations.map(async (id) => {
				const itemResults = await api().getStationData({
					id,
					start_date,
					end_date,
					param: unit as unknown as WeatherMeasurementKeyNoMinMax,
					scale: "hourly",
				});

				if (itemResults === null) return { id, supported: false };
				return {
					supported: true,
					data: mapStationDataResults({ id, unit, results: itemResults }),
				};
			});

			const results = (await Promise.all(
				promises,
			)) as PromiseResult<ParsedValueType>[];
			const onlyWithSupported = results
				.filter(notEmptyAndNotUnsupported)
				.map(({ data }) => data)
				.flat();
			const onlyUnsupported = results
				.filter((item) => !notEmptyAndNotUnsupported(item))
				.flat()
				.map(({ id }) => id)
				.filter(notEmpty);
			return {
				lineChartData: mapDataToLayerChartData({
					data: onlyWithSupported,
					stations,
				}),
				unsupportedIds: onlyUnsupported,
			};
		};

type PromiseResult<T> =
	| { id: string; supported: false }
	| { supported: true; data: T; id: undefined };
function notEmptyAndNotUnsupported<T>(
	item: PromiseResult<T>,
): item is { supported: true; data: T; id: undefined } {
	if ("supported" in item && item.supported) return notEmpty(item.data);
	return false;
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined;
}

function mapStationDataResults<
	T extends (Record<string, unknown> & {
		measured_at?: string;
	})[],
>({
	id,
	unit,
	results = [] as unknown as T,
}: { id: string; unit: string; results?: T }) {
	return results.map((i) => {
		const value = i[unit as keyof typeof i] as string;
		return {
			id,
			measured_at: i.measured_at,
			value,
		} satisfies ParsedValueType;
	});
}

type CombinedLayerChartDataItem = {
	date: Date
} & {
	[K in string]: K extends 'date' ? Date : string | null;
}

function mapDataToLayerChartData({ data, stations }: {
	data: ParsedValueType[];
	stations: StationsGeoJSONType["features"];
}) {
	if (!data) return []
	const dateToObjects = data.reduce((acc, item) => {
		const date = parseISO(item?.measured_at || "");
		if (!item?.measured_at || !isValid(date)) return acc;

		const key = format(date, 'yyyy-MM-dd-HH')
		const existingItem = acc.get(key) || { date } as CombinedLayerChartDataItem;
		const parsedVal = !item.value ? null : item.value;
		const stationName = stations.find((f) => f.properties.id === item.id)?.properties.longName.trim() || item.id;
		acc.set(key, { ...existingItem, [stationName]: parsedVal } as CombinedLayerChartDataItem)
		return acc;
	}, new Map<string, CombinedLayerChartDataItem>());

	return [...dateToObjects.values()].sort((a, b) => compareAsc(a.date, b.date));
}
