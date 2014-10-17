var akqa = akqa || {};
akqa.base = akqa.base || {};

akqa.base.temperature = (function () {
    'use strict';

    var init,
        forecastApiKey = "80bafaf6564f9d766fc973884955088b",
        url = "https://api.forecast.io/forecast/",
        lastYearsTemperature = null,
        todaysTemperature = null,
        displayUnits = 'us',
        displayDate = 'year',
        units = {
            'us': 'F',
            'si': 'C'
        },
        dates = {
            'year': 31536000000,
            'month': 2592000000,
            'week': 604800000,
            'day': 86400000
        },

    getForecastData = function (lat, lng, getLastYear) {
        if (getLastYear) {
            $.getJSON(url + forecastApiKey + '/' + lat + ',' + lng + ',' + getLastYear + '?units=' + displayUnits + '&callback=?', lastYearForecastSuccess);
        } else {
            $.getJSON(url + forecastApiKey + '/' + lat + ',' + lng + '?units=' + displayUnits + '&callback=?', currentForecastSuccess);
        }
    },

    lastYearForecastSuccess = function (data) {
        updateTemperature(data, true);
    },

    currentForecastSuccess = function (data) {
        updateTemperature(data);
    },

    forecastFailure = function (err) {
        console.log(err);
    },

    updateTemperature = function (data, getLastYear) {
        var targetDiv,
            temperature = Math.round(data.currently.temperature),
            temperatureText;
        if (getLastYear) {
            targetDiv = $('.temperature-last-year');
            lastYearsTemperature = temperature;
        } else {
            targetDiv = $('.temperature-today');
            todaysTemperature = temperature;
        }
        targetDiv.find('.temperature').empty().append(temperature + '<span class="degree">˚</span><span class="unit">' + units[displayUnits] + '</span>');
        compareTemperatures();
    },

    makeDateString = function (date) {
        switch (date) {
            case 'day':
            return 'Yesterday';
            case 'week':
            return 'Last week';
            case 'month':
            return 'Last month';
            default:
            return 'Last year';
        }
    },

    compareTemperatures = function () {
        var temperatureDifference,
            temperatureMessage;
        if (lastYearsTemperature !== null && todaysTemperature !== null) {
            console.log('todaysTemperature = ' + todaysTemperature);
            console.log('lastYearsTemperature = ' + lastYearsTemperature);
            temperatureDifference = todaysTemperature - lastYearsTemperature;
            if (todaysTemperature > lastYearsTemperature) {
                temperatureMessage = 'It’s ' + temperatureDifference  + '<span class="degree">˚</span><span class="unit">' + units[displayUnits] + '</span>' + ' warmer than ' + makeDateString(displayDate).toLowerCase();
            } else if (todaysTemperature < lastYearsTemperature) {
                temperatureMessage = 'It’s ' + Math.abs(temperatureDifference) + '<span class="degree">˚</span><span class="unit">' + units[displayUnits] + '</span>' + ' colder than ' + makeDateString(displayDate).toLowerCase();
            } else {
                temperatureMessage = 'It’s the same temperature as ' + makeDateString(displayDate).toLowerCase();
            }
            $('h1').empty().append(temperatureMessage);
            $('.temperature-last-year h2').empty().append(makeDateString(displayDate));
            lastYearsTemperature = null;
            todaysTemperature = null;
            $('.content').addClass('loaded');
        }
    },

    addEventHandlers = function () {
        $('.units').on('change', 'input', function () {
            updateUnits(this);
        });
        $('.dates').on('change', 'input', function () {
            updateDate(this);
        });
    },

    updateDate = function (item) {
        displayDate = $(item).val();
        resetPage();
        $('.dates label').removeClass('selected');
        $(item).parent().addClass('selected');
        getLocation();
    },

    updateUnits = function (item) {
        displayUnits = $(item).val();
        resetPage();
        $('.units label').removeClass('selected');
        $(item).parent().addClass('selected');
        getLocation();
    },

    resetPage = function () {
        $('.content').removeClass('loaded');
    },

    getLocation = function () {
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
        }
    },

    locationSuccess = function (pos) {
        var lat = pos.coords.latitude,
            lng = pos.coords.longitude,
            date = new Date(pos.timestamp - dates[displayDate]);
        date = Math.round(date.getTime() / 1000);
        getForecastData(lat, lng);
        getForecastData(lat, lng, date);
    },

//365 x 24 x 60 x 60 x1000
//30 x 24 x 60 x 60 x1000
//7 x 24 x 60 x 60 x1000
//1 x 24 x 60 x 60 x1000

    locationError = function (err) {
        console.log(err);
    };

    init = (function () {
        getLocation();
        addEventHandlers();

        $(document).bind('touchmove', function(e) {
            e.preventDefault();
        });
    }());

})();

