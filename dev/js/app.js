var rps = rps || {};
rps.lyw = rps.lyw || {};

rps.lyw.app = (function (window, $, document) {
    'use strict';

    var $window = $(window),
        $main = $('.main'),
        $controls = $('.controls'),
        $tempNow = $('.temperature-today .temperature'),
        $tempThen = $('.temperature-last-year .temperature'),
        $tempThenHeader = $('.temperature-last-year h2'),
        $message = $('h1'),

        forecastApiKey = "****",
        url = "https://api.forecast.io/forecast/",
        
        tempNow,
        tempThen,
        lat,
        lng,
        geoLocationOptions = {
            timeout: 5000
        },
        
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

        settings = {
            'unit': 'us',
            'date': 'year'
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

    getLocation = function () {
        var deferred = $.Deferred();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject, geoLocationOptions);
        } else {
            deferred.reject(new Error('Your browser does not support GeoLocation.'));
        }
        return deferred.promise();
    },

    compareWeather = function (weatherNow, weatherThen) {
        var comparative,
            message,
            tempDiff,
            unit = '<span class="degree">˚</span><span class="unit">' + units[settings.unit] + '</span>';
        tempNow = Math.round(weatherNow[0].currently.temperature);
        tempThen = Math.round(weatherThen[0].currently.temperature);
        tempDiff = tempNow - tempThen;
        
        if (tempNow > tempThen) {
            comparative = 'warmer';
        } else if (tempNow < tempThen) {
            comparative = 'colder';
        }

        if (!comparative) {
            message = 'It’s the same temperature<br>as ' + makeDateString(settings.date).toLowerCase();
        } else {
            message = 'It’s ' + tempDiff  + unit + ' ' +  comparative + '<br>than ' + makeDateString(settings.date).toLowerCase();
        }

        // Update DOM with new data
        $tempNow.empty().append(tempNow + unit);
        $tempThen.empty().append(tempThen + unit);
        $tempThenHeader.empty().append(makeDateString(settings.date));
        $message.empty().append(message);

        $main.addClass('loaded');
    },

    getWeatherNow  = function () {
        return $.getJSON(url + forecastApiKey + '/' + lat + ',' + lng  + '?units=' + settings.unit + '&callback=?');
    },

    getWeatherThen = function (date) {
        return $.getJSON(url + forecastApiKey + '/' + lat + ',' + lng + ',' + date + '?units=' + settings.unit + '&callback=?');
    },

    getForecast = function () {
        $.when(getLocation()).then(function (pos) {
            var date = new Date(pos.timestamp - dates[settings.date]);
            date = Math.round(date.getTime() / 1000);
            lat = pos.coords.latitude; 
            lng = pos.coords.longitude;
            $.when(getWeatherNow(), getWeatherThen(date)).then(compareWeather);
        }).fail(function (err) {
            console.error(err);
        });
    },

    updateControls = function () {
        $controls.find('.selected').removeClass('selected');
        $controls.find('[data-value=' + settings.unit + '], [data-value=' + settings.date + ']').addClass('selected');
    },

    retrieveSettings = function () {
        if (window.localStorage && window.localStorage.getItem('lyw.settings.unit') && window.localStorage.getItem('lyw.settings.date')) {
            settings.unit = window.localStorage.getItem('lyw.settings.unit');
            settings.date = window.localStorage.getItem('lyw.settings.date');
        }
    },

    storeSettings = function () {
        if (window.localStorage) {
            window.localStorage.setItem('lyw.settings.unit', settings.unit);
            window.localStorage.setItem('lyw.settings.date', settings.date);
        }
    };

    var init = (function () {

        // Prevent scrolling
        $(document).bind('touchmove', function (e) {
            e.preventDefault();
        });

        // Set up
        retrieveSettings();
        updateControls();
        getForecast();
        
        // Add listener
        $controls.on('click', '.btn', function () {
            settings[$(this).data('name')] = $(this).data('value');
            $main.removeClass('loaded');
            storeSettings();
            updateControls();
            getForecast();
        });

    })();
    
})(window, window.jQuery, window.document);

