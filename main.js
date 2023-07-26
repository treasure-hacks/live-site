// Configure countdown
function handleTickInit(tick) {

    const constants = {
        YEAR_PLURAL: 'Years',
        YEAR_SINGULAR: 'Year',
        MONTH_PLURAL: 'Months',
        MONTH_SINGULAR: 'Month',
        WEEK_PLURAL: 'Weeks',
        WEEK_SINGULAR: 'Week',
        DAY_PLURAL: 'Days',
        DAY_SINGULAR: 'Day',
        HOUR_PLURAL: 'Hours',
        HOUR_SINGULAR: 'Hour',
        MINUTE_PLURAL: 'Min',
        MINUTE_SINGULAR: 'Min',
        SECOND_PLURAL: 'Sec',
        SECOND_SINGULAR: 'Sec',
        MILLISECOND_PLURAL: 'MS',
        MILLISECOND_SINGULAR: 'MS'
    };

    for (const key in constants) {
        tick.setConstant(key, constants[key]);
    }

    const counter = Tick.count.down('2024-01-01T00:00:00-0700');

    counter.onupdate = function(value) {
      tick.value = value;
    };

    counter.onended = function() {
        tick.root.style.display = 'none';
        document.querySelector('.tick-onended-message').style.display = '';
    };

    setTimeout(() => tick.root.classList.add('loaded'), 1000)
}

// Discord online ct.
const onlineCtEl = document.getElementById('discord-online-ct')
async function loadOnlineCount () {
    const response = await fetch('https://discord.com/api/guilds/867913454563000360/widget.json')
        .then(x => x.json()).catch(() => {});
    if (!response) return onlineCtEl.parentNode.remove()
    onlineCtEl.innerText = response.presence_count
}
setInterval(loadOnlineCount, 30000);
loadOnlineCount()

// Populate from API
