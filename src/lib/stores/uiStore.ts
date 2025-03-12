import LL, { locale } from '$i18n/i18n-svelte';
import { today } from '$lib/utils/dateUtil';
import { addDays, format, isSameDay, isToday, setHours, setMinutes } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { debounce } from 'es-toolkit';
import { derived } from 'svelte/store';
import { queryParam, ssp } from 'sveltekit-search-params';
import { z } from 'zod';

const options = { debounceHistory: 500 };

// RANGE START
const rangeStartDefault = -10;
const rangeStartQueryParam = queryParam('range_start', ssp.number(rangeStartDefault), options);
export const rangeStart = derived(rangeStartQueryParam, (value: number) =>
	validateQueryParam(value, z.coerce.number(), rangeStartDefault)
);
export const rangeStartDate = derived(rangeStart, (d) => addDays(today(), d));
export const rangeStartKey = derived(rangeStartDate, (d) => d && format(d, 'yyyy-MM-dd'));

export const udpateRangeStart = debounce((d: number) => {
	rangeStartQueryParam.set(d);
}, 500);

// RANGE END
const rangeEndDefault = 0;
const rangeEndQueryParam = queryParam('range_end', ssp.number(rangeEndDefault), options);
export const rangeEnd = derived(rangeEndQueryParam, (value: number) =>
	validateQueryParam(value, z.coerce.number(), rangeEndDefault)
);
export const rangeEndDate = derived(rangeEnd, (d) => addDays(today(), d));
export const rangeEndKey = derived(rangeEndDate, (d) => d && format(d, 'yyyy-MM-dd'));

export const updateRangeEnd = debounce((d: number) => {
	rangeEndQueryParam.set(d);
}, 500);

// SIDEBAR
const isLeftSidebarOpenedDefault = true;
const isLeftSidebarOpenedQueryParam = queryParam(
	'sidebar_open',
	ssp.boolean(isLeftSidebarOpenedDefault)
);
export const isLeftSidebarOpened = derived(isLeftSidebarOpenedQueryParam, (value: boolean) => Boolean(value));
export const toggleLeftSidebar = () =>
	isLeftSidebarOpenedQueryParam.update((value: boolean) => !value);
export const closeLeftSidebar = () =>
	isLeftSidebarOpenedQueryParam.set(false);
export const openLeftSidebar = () =>
	isLeftSidebarOpenedQueryParam.set(true);

// DAY VALUE
const dayValueDefault = 0;
const dayValueQueryParam = queryParam('day_value', ssp.number(dayValueDefault), options);
export const dayValue = derived(dayValueQueryParam, (value: number) => {
	return validateQueryParam(value, z.coerce.number(), dayValueDefault);
});
export const dayStartDate = derived(dayValue, (d) => addDays(today(), d - 1));
export const dayEndDate = derived(dayValue, (d) => addDays(today(), d));
export const dayKey = derived(dayEndDate, (d) => d && format(d, 'yyyy-MM-dd'));

export const udpateDay = debounce((d: number) => {
	dayValueQueryParam.set(d);
}, 500);

// DATAVIS TYPE
const datavisTypeDefault = 'day' as const;
const datavisTypeQueryParam = queryParam('datavisType', ssp.string(datavisTypeDefault));
export const datavisType = derived(datavisTypeQueryParam, (value: string) =>
	validateQueryParam(value, z.enum(['day', 'hour', 'range']), datavisTypeDefault)
);
export const udpateDatavisType = debounce((value: 'day' | 'hour' | 'range') => {
	datavisTypeQueryParam.set(value);
}, 500);

// UNIT
const unitDefault = 'utci' as const;
const unitQueryParam = queryParam('unit', ssp.string(unitDefault));
export const unit = derived(unitQueryParam, (value: string) =>
	validateQueryParam(value, z.string(), unitDefault)
);
export const updateUnit = (value: string) => {
	unitQueryParam.set(value);
};

export const isCategoryUnit = derived(unit, (u) => u.endsWith('_category'));
const minMaxAvgDefault = 'avg' as const;
const minMaxAvgQueryParam = queryParam('minMaxAvg', ssp.string(minMaxAvgDefault));
export const minMaxAvg = derived(minMaxAvgQueryParam, (value: string) =>
	validateQueryParam(value, z.enum(['min', 'max', 'avg']), minMaxAvgDefault)
);
export const updateMinMaxAvg = (value: 'min' | 'max' | 'avg') => {
	minMaxAvgQueryParam.set(value);
};
export const unitWithMinMaxAvg = derived(
	[unit, datavisType, minMaxAvg, isCategoryUnit],
	([u, dT, mMA, iCU]) => {
		if (dT !== 'day') return u;
		return mMA === 'avg' || iCU ? u : `${u}_${mMA}`;
	}
);
export const unitWithoutCategory = derived(unit, (u) =>
	u.replace(/_category$/, '') === 'pet' ? ('pet' as const) : ('utci' as const)
);
export const unitLabel = derived([unit, LL], ([u, ll]) => {
	return ll.pages.measurements.unitSelect.units[
		u as keyof typeof ll.pages.measurements.unitSelect.units
	].label();
});
export const unitOnly = derived([unit, LL], ([u, ll]) => {
	return ll.pages.measurements.unitSelect.units[
		u as keyof typeof ll.pages.measurements.unitSelect.units
	].unitOnly();
});

// SCALE
export const scale = derived(datavisType, (val) =>
	val === 'day' ? ('daily' as const) : ('hourly' as const)
);

// HOUR
const hourDefault = 12;
const hourQueryParam = queryParam('hour', ssp.number(hourDefault));
export const hour = derived(hourQueryParam, (value: number) =>
	validateQueryParam(value, z.coerce.number(), hourDefault)
);
export const isHourScale = derived(
	[scale, hour],
	([s, h]) => s === 'hourly' && typeof h === 'number'
);
export const hourKey = derived([isHourScale, hour], ([isH, h]) => (isH ? h : undefined));
export const udpateHour = (h: number) => {
	hourQueryParam.set(h);
};

// FORMATTED TIME CONFIGURATION
export const formattedTimeConfiguration = derived(
	[datavisType, rangeStartDate, rangeEndDate, dayEndDate, hour, locale, LL],
	([datavisTypeVal, rangeStartVal, rangeEndVal, dayEndVal, hourVal, localeVal, LLVal]) => {
		if (!dayEndVal || !rangeStartVal || !rangeEndVal) return '';
		const dateLocale = localeVal === 'de' ? de : enUS;
		const todayString = isToday(rangeEndVal)
			? `(${LLVal.pages.measurements.dateRangeSlider.today()})`
			: '';

		if (datavisTypeVal === 'hour') {
			const date = setMinutes(setHours(dayEndVal, hourVal), 0);
			return `${format(date, 'do MMMM yyyy HH:mm', { locale: dateLocale })} ${todayString}`.trim();
		}

		if (datavisTypeVal === 'day') {
			return `${format(dayEndVal, 'do MMMM yyyy', { locale: dateLocale })} ${todayString}`.trim();
		}

		if (datavisTypeVal === 'range') {
			const startMonth = format(rangeStartVal, 'MMMM', { locale: dateLocale });
			const endMonth = format(rangeEndVal, 'MMMM', { locale: dateLocale });
			const startYear = format(rangeStartVal, 'yyyy', { locale: dateLocale });
			const endYear = format(rangeEndVal, 'yyyy', { locale: dateLocale });
			const startDay = format(rangeStartVal, 'do', { locale: dateLocale });
			const endDay = format(rangeEndVal, 'do', { locale: dateLocale });

			if (isSameDay(rangeStartVal, rangeEndVal)) {
				return `${format(dayEndVal, 'do MMMM yyyy', { locale: dateLocale })} ${todayString}`.trim();
			}

			if (startYear === endYear) {
				if (startMonth === endMonth) {
					return `${startDay} - ${endDay} ${startMonth} ${startYear} ${todayString}`;
				}
				return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startYear} ${todayString}`;
			}
			return `${startDay} ${startMonth} ${startYear} - ${endDay} ${endMonth} ${endYear} ${todayString}`;
		}

		return '';
	}
);

// HEAT STRESS UNIT
const heatStressUnitDefault = 'utci';
const heatStressUnitQueryParam = queryParam('heatStress', ssp.string(heatStressUnitDefault));
export const heatStressUnit = derived(heatStressUnitQueryParam, (value: string) =>
	validateQueryParam(value, z.string(), heatStressUnitDefault)
);
export const updateHeatStressUnit = (value: string) => {
	heatStressUnitQueryParam.set(value);
};

// SEARCH QUERY
const searchQueryDefault = '';
const searchQueryQueryParam = queryParam('stationsSearch', ssp.string(searchQueryDefault), {
	debounceHistory: 500
});
export const searchQuery = derived(searchQueryQueryParam, (value: string) =>
	validateQueryParam(value, z.string(), searchQueryDefault)
);
export const updateSearchQuery = debounce((value: string) => {
	searchQueryQueryParam.set(value);
}, 500);

// MAP
const lonDefault = 7.467;
const latDefault = 51.511;
const zoomDefault = 10.5;

type MapViewport = [longitude: number, latitude: number, zoom: number];
const defaultViewport: MapViewport = [lonDefault, latDefault, zoomDefault];
const boundariesModeDefault = 'districts' as const;
const showSatelliteDefault = false;

const latitudeQueryParam = queryParam('lat', ssp.number(defaultViewport[1]), options);
export const mapLatitude = derived(latitudeQueryParam, (value: number) =>
	validateQueryParam(value, z.coerce.number(), latDefault)
);
const longitudeQueryParam = queryParam('lng', ssp.number(defaultViewport[0]), options);
export const mapLongitude = derived(longitudeQueryParam, (value: number) =>
	validateQueryParam(value, z.coerce.number(), lonDefault)
);
const zoomQueryParam = queryParam('zoom', ssp.number(defaultViewport[2]), options);
export const mapZoom = derived(zoomQueryParam, (value: number) =>
	validateQueryParam(value, z.coerce.number(), zoomDefault)
);

export const updateMapCoordinates = debounce((coords: [longitude: number, latitude: number]) => {
	longitudeQueryParam.set(coords[0]);
	latitudeQueryParam.set(coords[1]);
}, 500);

export const updateMapZoom = debounce((zoom: number) => {
	zoomQueryParam.set(zoom);
}, 500);

// MAP SETTINGS
const boundariesModeQueryParam = queryParam('boundariesMode', ssp.string(boundariesModeDefault));
const showSatelliteQueryParam = queryParam('showSatellite', ssp.boolean(showSatelliteDefault));

export const boundariesMode = derived(boundariesModeQueryParam, (value: string) =>
	validateQueryParam(value, z.string(), boundariesModeDefault)
);
export const updateBoundariesMode = (value: string) => {
	boundariesModeQueryParam.set(value);
};

export const showSatellite = derived(showSatelliteQueryParam, (value: boolean) =>
	validateQueryParam(value, z.boolean(), showSatelliteDefault)
);
export const updateShowSatellite = (value: boolean) => {
	showSatelliteQueryParam.set(value);
};

// UTILS
function validateQueryParam<T>(queryParam: unknown, schema: z.ZodSchema<T>, defaultValue: T): T {
	const parsed = schema.safeParse(queryParam);
	const result = parsed.success ? parsed.data : undefined;
	if (parsed.error) console.log(parsed.error)
	return result || defaultValue;
}
