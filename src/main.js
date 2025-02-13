async function httpFetch(place) {
    const req = await fetch(
        new Request(
            'https://meteoapi.vercel.app/v1/places' + (place ? `/${place}/forecasts/long-term` : ''),
            {
                method: 'GET'
            }
        )
    );

    if (!req.ok) return;

    return await req.json();
};

async function getPlaces() {
    const get = await httpFetch();
    const json = {};

    for (let obj in get) {
        const div = administrativeDivision;

        if (!json[div]) json[div] = [];

        json[div].push(
            {
                code: obj.code,
                name: obj.name
            }
        );
    };

    return json;
};

const conditions = {
    clear: ['Giedra', 'sun'],
    'partly-cloudy': ['Mažai debesuota', 'cloud-sun'],
    'variable-cloudiness': ['Nepastoviai debesuota', 'cloud-sun'],
    'cloudy-with-sunny-intervals': ['Debesuota su pragiedruliais', 'cloud-sun'],
    cloudy: ['Debesuota', 'cloudy'],
    'rain-showers': ['Trumpas lietus', 'cloud-drizzle'],
    'light-rain-at-times': ['Protarpiais nedidelis lietus', 'cloud-drizzle'],
    'rain-at-times': ['Protarpiais lietus', 'cloud-drizzle'],
    'light-rain': ['Nedidelis lietus', 'cloud-drizzle'],
    rain: ['Lietus', 'cloud-rain'],
    'heavy-rain': ['Smarkus lietus', 'cloud-rain-heavy'],
    thunder: ['Perkūnija', 'cloud-lightning'],
    'isolated-thunderstorms': ['Trumpas lietus su perkūnija', 'cloud-lightning-rain'],
    thunderstorms: ['Lietus su perkūnija', 'cloud-lightning-rain'],
    'sleet-showers': ['Trumpa šlapdriba', 'cloud-sleet'],
    'sleet-at-times': ['Protarpiais šlapdriba', 'cloud-sleet'],
    'light-sleet': ['Nedidelė šlapdriba', 'cloud-sleet'],
    sleet: ['Šlapdriba', 'cloud-sleet'],
    'freezing-rain': ['Lijundra', 'cloud-sleet'],
    hail: ['Kruša', 'cloud-hail'],
    'snow-showers': ['Trumpas sniegas', 'cloud-snow'],
    'light-snow-at-times': ['Protaripiais nedidelis sniegas', 'cloud-snow'],
    'snow-at-times': ['Protarpiais sniegas', 'cloud-snow'],
    'light-snow': ['Nedidelis sniegas', 'cloud-snow'],
    snow: ['Sniegas', 'cloud-snow'],
    'heavy-snow': ['Smarkus sniegas', 'cloud-snow'],
    snowstorm: ['Pūga', 'cloud-snow'],
    fog: ['Rūkas', 'cloud-fog'],
    squall: ['Škvalas', 'tropical-storm']
};

for (let place of ['vilnius', 'kaunas', 'klaipeda']) {
    const get = await httpFetch(place); // ???????????????????
   
    if (!get) continue;

    const time = get.forecastTimestamps[0];
    const con = conditions[time.conditionCode];

    document.getElementById('dirtyHack').innerHTML += `
    <div class="col-3">
        <div class="card text-body" style=" border-radius: 35px;">
            <div class="card-body p-4">
                <h6 class="flex-grow-1">${get.place.name}</h6>
                <div class="d-flex flex-column mt-5 mb-4">
                    <h6 class="display-4 mb-0 font-weight-bold">13°C</h6>
                    <span class="small" style="color: #868B94"><i class="bi bi-${con[1]}"></i> ${con[0]}</span>
                </div>
                <div class="d-flex align-items-center">
                    <div class="flex-grow-1" style="font-size: 1rem;">
                        <div><i class="fas fa-tint fa-fw" style="color: #868B94;"></i> <span class="ms-1">Jaučiasi kaip: ${time.feelsLikeTemperature}°C</span></div>
                        <div><i class="fas fa-wind fa-fw" style="color: #868B94;"></i> <span class="ms-1">Vėjas: ${time.windSpeed} km/h - ${time.windDirection}°</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
};

// geriau jau pamokos butu buvusios