import type { Translation } from '../i18n-types';

const siteNameShort = `Data2Resilience`;
const siteSubtitle = `Dashboard for thermal comfort in Dortmund`;
const en = {
	siteNameShort,
	author: `Data2Resilience Team`,
	siteSubtitle,
	siteNameLong: `${siteNameShort} | ${siteSubtitle}`,
	siteDescription: `Data2Resilience is a project aimed at improving urban resilience against extreme heat in Dortmund through innovative biometeorological measurement networks and community engagement. Learn more about our initiatives and results.`,
	keywords: `Data2Resilience, urban resilience, extreme heat, Dortmund, climate change, biometeorological measurement, community engagement, heat resilience, urban climate, climate adaptation`,
	twitterHandle: `RUBclim`,
	log: `This log was called from '{fileName}'`,
	themeColor: `#007bff`,
	headImages: {
		og: {
			large: 'Screenshot of the Data2Resilience map dashboard',
			square: 'Logo of the Data2Resilience project'
		},
		twitter: 'Screenshot of the Data2Resilience map dashboard'
	},
	errors: {
		genericErrorLabel: 'Error',
		unexpectedError: {
			label: 'Unexpected error',
			description: `Oops, it looks like something unexpected has went wrong: "{errorMessage}". We're sorry. Please try again or navigate to the homepage.`
		},
		fourOhFour: {
			label: 'Page not found',
			description: `Oops, it looks like the page you were looking for doesn't exist. Don't worry, we can help you get back on track.`,
			homepageLinkText: 'To the homepage'
		}
	},
	generic: {
		expand: 'Know more',
		collapse: 'Collapse'
	},
	welcome: {
		title: 'Welcome',
		text: [
			'The Data2Resilience project uses a new biometeorological measurement network to observe and predict heat and involves citizens early to address challenges and needs in Dortmund. This dashboard allows you to explore real-time data on thermal comfort in the city.'
		],
		buttons: {
			confirm: "Understood, let's go",
			launchTour: 'Start the tour'
		},
		expandButtonLabel: 'Show the introduction message again'
	},
	navigation: {
		header: {
			about: 'About this dashboard'
		},
		tabs: {
			thermicalComfort: 'Thermal comfort',
			actualMeasurements: 'Current measurements',
			stations: 'Weather stations'
		}
	},
	rightSidebar: {
		title: 'Selected stations'
	},
	pages: {
		thermicalComfort: {
			title: 'How warm does your city feel?',
			intro: [
				'Thermal comfort is the state of well-being in which a person is satisfied with the thermal environment. This means that temperature, humidity, air movement and radiant heat are within a range perceived as comfortable. It can be measured using various indicators:'
			],
			timeRangeAlert: `Data only available from {startDate} to {endDate}.`,
			indicatorsNavAriaLabel: 'Select an indicator to change the data displayed on the map.'
		},
		measurements: {
			title: 'What is currently being measured?',
			intro: [
				'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.',
				'Current measured values can be displayed both for the measuring stations and for the individual city districts.'
			],
			stationsSelect: {
				placeholder: 'Select one or more stations',
				label: 'Selected stations'
			},
			unitSelect: {
				noUnitFound: 'No unit found',
				placeholder: 'Select a unit',
				searchPlaceholder: 'Search unit...',
				xOutOfY: '{part} of {total} stations',
				units: {
					utci: 'Universal Thermic Comfort Index (UTCI) (°C)',
					pet: 'Physiological equivalent temperature (PET) (°C)',
					temp: 'Air temperature (°C)',
					pressure: 'Air pressure (hPa)',
					precipitation: 'Precipitation (mm)',
					relativeHumidity: 'Relative humidity (%)',
					windSpeed: 'Wind speed (m/s)',
					maxWindSpeed: 'Maximum wind speed (m/s)',
					windDirection: 'Wind direction (°)',
					midRadiationTemp: 'Mid-range radiation temperature (°C)',
					lighningStrikesCount: 'Lightning strikes count',
					avgLighningStrikesDist: 'Average lightning strike distance (m)',
					solarradiation: 'Solar radiation (W/m²)',
					vaporPressure: 'Vapor pressure (hPa)'
				}
			}
		},
		stations: {
			title: 'How are we measuring thermal comfort?',
			intro: [
				'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.'
			],
			stationsDescriptions: {
				weather: {
					title: 'Weather station with Blackglobe sensor',
					description:
						'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.'
				},
				airTemperatureAndHumidity: {
					title: 'Air temperature and humidity sensor',
					description:
						'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.'
				}
			}
		}
	},
	indicators: {
		utci: {
			title: 'Universal Thermic Comfort Index (UTCI)',
			description:
				'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.',
			types: {
				byClass: {
					title: 'By class',
					description:
						'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.'
				},
				byValue: {
					title: 'By value',
					description:
						'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.'
				}
			}
		},
		pet: {
			title: 'Physiological equivalent temperature (PET)',
			description:
				'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.'
		},
		mrt: {
			title: 'Mean regional temperature (MRT)',
			description:
				'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes.'
		}
	},
	map: {
		zoom: {
			navAlt: 'Zoom navigation',
			zoomIn: 'Zoom in',
			zoomOut: 'Zoom out'
		}
	}
} satisfies Translation;

export default en;
