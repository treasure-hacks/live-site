// Register service worker + subscribe to push notifications
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(x => {
        navigator.serviceWorker.getRegistration().then(sw => {
            sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'BGW0bJcdVikZmJ1n6zdt7bxrrNQrzP1jyy5zPJIXx3iUKfK-JcD17-eF41uZ0GmnxR6Zzr4jecXGzjD6elv-MlQ'
            }).then(sub => {
                console.log(sub);
            });
        });
    });
}

if(Notification in window) {
    Notification.requestPermission();
}
    

// Configure countdown
function handleTickInit(...args) { handler(...args); }
let handler = () => { console.log("afgsf"); };
const tickPromise = new Promise(resolve => {
    handler = resolve
});
function startClock(tick, time) {

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

    const counter = Tick.count.down(time);

    counter.onupdate = function(value) {
      tick.value = value;
    };

    counter.onended = function() {
        tick.root.style.display = 'none';
        document.querySelector('.tick-onended-message').style.display = '';
        document.querySelector('header h1').innerText = "Hacking Period Over!";
    };

    setTimeout(() => tick.root.classList.add('loaded'), 1000);
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
populate();
setInterval(populate, 30000);
let lastApiResponse;
async function populate() {
    const apiResponse = await fetch("https://api.treasurehacks.org/events/cause-sd-23/live").then(x => x.json());
    if(JSON.stringify(apiResponse) == JSON.stringify(lastApiResponse)) return;
    lastApiResponse = apiResponse;
    document.querySelector(".latest-announcement p").innerText = apiResponse.announcements[0].text;
    const prev = apiResponse.announcements.slice(1);
    document.querySelector(".previous-announcements details ul").innerHTML = "";
    prev.forEach(x => {
        const date = new Date(x.timestamp).toLocaleString();
        const text = x.text;
        const el = document.createElement("li");
        el.innerText = date + " - " + text;
        document.querySelector(".previous-announcements details ul").appendChild(el);
    });
    document.getElementById("resources").innerText = "";
    apiResponse.resources.forEach(x => {
        const name = x.name;
        const url = x.url;
        const el = document.createElement("a")
        el.innerText = name;
        el.href = url;
        document.getElementById("resources").appendChild(el).appendChild(document.createElement("br"));
    });
    document.getElementById("map").innerText = "";
    const map = document.createElement("img");
    map.src = apiResponse.map_url;
    map.alt = "Event map";
    document.getElementById("map").appendChild(map);
    document.getElementById("faqs").innerText = "";
    apiResponse.faqs.forEach(x => {
        const question = x.question;
        const answer = x.answer;
        const el = document.createElement("details");
        const summary = document.createElement("summary");
        summary.innerText = question;
        const p = document.createElement("p");
        p.innerText = answer;
        el.appendChild(summary)
        el.appendChild(p);
        document.getElementById("faqs").appendChild(el);
    });
    document.getElementById("leaderboard").innerHTML = "";
    document.getElementById("leaderboard").appendChild(document.createElement("table"));
    apiResponse.leaderboard.forEach(x => {
        const name = x.name;
        const points = x.points;
        const el = document.createElement("tr");
        el.classList.value = "leaderboard-item";
        const td1 = document.createElement("td");
        td1.innerText = name;
        td1.classList.value = "leaderboard-name";
        el.appendChild(td1);
        const td2 = document.createElement("td");
        td2.appendChild(document.createElement("div"));
        td2.querySelector("div").classList.value = "leaderboard-bar";
        td2.querySelector("div").style.width = x.points / apiResponse.leaderboard[0].points * 100 + "%";
        td2.querySelector("div").innerText = points;
        el.appendChild(td2);
        document.getElementById("leaderboard").querySelector("table").appendChild(el);
    });
    document.getElementById("schedule").innerHTML = "";
    document.getElementById("schedule").appendChild(document.createElement("table"));
    apiResponse.schedule.forEach(x => {
        const date = new Date(x.timestamp).toLocaleString();
        const {title, url} = x;
        const el = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerText = date;
        el.appendChild(td1);
        const td2 = document.createElement("td");
        if(url) {
            const a = document.createElement("a");
            a.href = url;
            a.target = "_blank";
            a.innerText = title;
            td2.appendChild(a);
        } else {
            td2.innerText = title;
        }
        el.appendChild(td2);
        document.getElementById("schedule").querySelector("table").appendChild(el);
    });
    const tick = await tickPromise;
    startClock(tick, apiResponse.hacking_end_date);
}
