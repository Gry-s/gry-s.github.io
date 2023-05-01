
const ActivityType = {
    'EMPTY': 'empty',
    'GAME': 'game',
    'OTHER': 'other'
};

const ENDAYS = [
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
    'Mon',
];

function strpad(str, nb, c = '0', reverse = false) {
    let r = ''+str;
    if(c.length > 0) {
        c = ''+c;
        while(r.length < nb) {
            if(reverse) { r = c + r; }
            else { r = r + c; }
        }
    }
    return r;
}

class Activity {
    constructor(type, name, image) {
        this.type = type;
        this.name = name;
        this.image = image;
    }

    getType() {
        return this.type;
    }

    getName() {
        return this.name;
    }

    getImage() {
        return this.image;
    }
}

class TimeSlot {
    constructor(day, hour, activity) {
        this.day = day;
        this.hour = hour;
        this.activity = activity;
    }

    getDay() {
        return this.day;
    }

    getHour() {
        return this.hour;
    }

    setHour(hour) {
        this.hour = hour;
        return this;
    }

    getActivity() {
        return this.activity;
    }

    setActivity(activity) {
        this.activity = activity;
    }

    getFormattedWhen(withHours = false) {
        let n = 0;
        let r = 0;
        if(withHours) {
            n = parseInt(this.hour);
            r = (60 * (this.hour - n));
        }
        
        return ''
            +ENDAYS[this.day]
            +(withHours? (' @ '
            +(strpad(n, 2, '0', true))
            +'h'
            +((r > 0)? strpad(r, 2, '0', true):'')
            +' ST'):'');
    }
}

class Planning {
    constructor() {
        this.activities = [];
        for(let i = 0; i < 7; i++) {
            this.activities.push(
                new TimeSlot(
                    i,
                    0,
                    new Activity(
                        ActivityType.EMPTY,
                        '',
                        ''
                    )
                )
            );
        }
    }

    setActivity(dayslot, hour, activity) {
        this.activities[dayslot].setHour(hour);
        this.activities[dayslot].setActivity(activity);
    }

    getActivities() {
        return this.activities;
    }
};

const plan = new Planning();

window.addEventListener('load', () => {
    for(const slot of plan.getActivities()) {
        const h = document.getElementById('slot_template').content.cloneNode(true).querySelector('article');
        if(slot.getActivity().getType() == ActivityType.EMPTY) { // empty has special BG
            h.querySelector('h2').innerText = slot.getFormattedWhen(false);
            h.querySelector('p').innerText = 'Off';
            h.classList.add('activitytype-empty');
        } else {
            h.querySelector('h2').innerText = slot.getFormattedWhen(true);
            h.querySelector('p').innerText = slot.getActivity().getName();
            h.style.background = 'linear-gradient(rgba(50,50,50,.5), rgba(50,50,50,.5)), url("'+slot.getActivity().getImage()+'")';
        }
        document.getElementById('plan_content').append(h);
    }
});
