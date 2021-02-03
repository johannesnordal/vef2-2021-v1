import fs from 'fs';
import util from 'util';

async function readData(readFileAsync) {
    try {
        return await readFileAsync('videos.json').then(JSON.parse)
            .catch((err) => console.error('error', err));
    } catch (err) {
        console.error('error', err);
    }
}

const dataPromise = readData(util.promisify(fs.readFile));

function renderHomePage(req, res) {
    dataPromise.then((data) => {
        res.render('index', {
            title: 'Fræðslumyndbandaleigan',
            data: data,
        });
    }).catch((err) => console.error('error', err));
}

function renderVideoPage(req, res) {
    const id = Number(req.params.id);
    dataPromise.then((data) => {
        const video = data.videos.find((v) => Number(v.id) === id);
        if (video) {
            const params = { title: `${video.title}`, video, data: data };
            res.render('videos', params);
        } else {
            res.status(404).send('Síða fannst ekki :(');
        }
    }).catch((err) => console.error('error', err));
}

function secondsToMinutesSeconds(n) {
    const x = Number(n);
    const m = Math.floor(x / 60);
    const s = x % 60;

    if (s < 10) {
        return `${m}:0${s}`;
    }
    return `${m}:${s}`;
}

function timeElapsed(x) {
    const secondsInHour = 60 * 60;
    const secondsInDay = 24 * secondsInHour;
    const secondsInWeek = 7 * secondsInDay;
    const secondsInMonth = 30 * secondsInDay;
    const secondsInYear = 365 * secondsInDay;

    const end = new Date();
    const beg = new Date(x);
    const elapsedSeconds = (end.getTime() - beg.getTime()) / 1000;

    let tmp;
    if ((tmp = Math.floor(elapsedSeconds / secondsInYear)) >= 1) {
        return `${tmp} ári/árum`;
    } if ((tmp = Math.floor(elapsedSeconds / secondsInMonth)) >= 1) {
        return `${tmp} mánuði/mánuðum`;
    } if ((tmp = Math.floor(elapsedSeconds / secondsInWeek)) >= 1) {
        return `${tmp} viku/vikum`;
    } if ((tmp = Math.floor(elapsedSeconds / secondsInDay)) >= 1) {
        return `${tmp} degi/dögum`;
    } if ((tmp = Math.floor(elapsedSeconds / secondsInHour))) {
        return `${tmp} klukkustund/klukkustundum`;
    }

    return '';
}

export {
    renderHomePage,
    renderVideoPage,
    secondsToMinutesSeconds,
    timeElapsed,
};
