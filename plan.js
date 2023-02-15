
const ActivityType = {
    'EMPTY': 'empty',
    'GAME': 'game',
    'OTHER': 'other'
};

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
    constructor(when, activity) {
        this.when = when;
        this.activity = activity;
    }

    getWhen() {
        return this.when;
    }

    getActivity() {
        return this.activity;
    }

    setActivity(activity) {
        this.activity = activity;
    }

    getFormattedWhen(withHours = false) {
        return ''
            +(new Intl.DateTimeFormat('default', {weekday: 'short', day: 'numeric'}).format(this.when))
            +(withHours? (' @ '
            +(new Intl.DateTimeFormat('default', {hour: '2-digit'}).format(this.when))
            +' ST'):'');
    }
}

class Planning {
    constructor() {
        // get the current week's tuesday
        const curr = new Date();
        curr.setHours(12);
        const first = (curr.getDate() - curr.getDay()) + 2; // 0 is sunday, 2 is tuesday, the one we want
        const firstdate = new Date(curr.setDate(first));

        this.activities = [];
        for(let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(firstdate.getDate() + i);
            this.activities.push(
                new TimeSlot(
                    d,
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
        this.activities[dayslot].getWhen().setHours(hour);
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
