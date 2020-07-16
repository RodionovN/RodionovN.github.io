document.addEventListener('DOMContentLoaded', function () {

})
var timeout = 700
var timeStart = 0
function parseSites() {
    try {
        timeStart = new Date().getTime();
        document.getElementById("status").innerHTML = "GO"
        firstQuery()
        document.getElementById("loader").style.visibility = "hidden"
        document.getElementById("buttonGetExcel").removeAttribute("disabled")
    }
    catch (e) {
        console.log(e)
    }
}
function replaceSpecSymb(str) {
    str = str.replace(/<br>/ig, ' ');
    return str.replace(/&nbsp;|\n|&lt|&gt/ig, '')
}
function getCSV() {
    const arr = []
    const rows = document.querySelectorAll("[id='table'] tr")

    rows.forEach(function (rowItem, i, array) {
        var row = []
        rowItem.querySelectorAll('th').forEach(function (item, ind, ar) {
            let temp = '';
            temp = item.innerHTML;
            temp = '"' + replaceSpecSymb(temp) + '"'
            temp =
                row.push(temp)
        })
        rowItem.querySelectorAll('td').forEach(function (item, ind, ar) {
            let temp = '';
            if (item.querySelector('a') != null) {
                temp = item.querySelector('a').href
            } else {
                temp = item.innerHTML;
                temp = '"' + replaceSpecSymb(temp) + '"'
            }
            row.push(temp)
        })
        arr.push(row)
    })
    var universalBOM = "\ufeff";
    let csvString = arr.map(e => e.join(";")).join("\n");
    var link = document.createElement("a");
    link.setAttribute("href", 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM + csvString));
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
}

const concatRes = (res) => {
    console.log('concatRes', res);
    if (res.response && res.response.result && res.response.result.length > 0) {

        res.response.result.forEach((curItem) => {
            console.log(curItem)
            if (curItem.result.length > 0) {
                curItem.result.forEach(item => {
                    console.log(item)
                    var number = document.createElement('td')
                    var dateStart = document.createElement('td')
                    var name = document.createElement('td')
                    var ispDoc = document.createElement('td')
                    var dateEnd = document.createElement('td')
                    var osn = document.createElement('td')
                    var objIsp = document.createElement('td')
                    var summ = document.createElement('td')
                    var department = document.createElement('td')
                    var bailiff = document.createElement('td')
                    number.innerHTML = item.exe_production.split('от')[0]
                    dateStart.innerHTML = item.exe_production.split('от')[1]
                    name.innerHTML = item.name
                    ispDoc.innerHTML = item.details
                    dateEnd.innerHTML = item.ip_end.split(',')[0]
                    var osnStr = item.ip_end.substring(item.ip_end.indexOf(' ')).split(', ')
                    osn.innerHTML = item.ip_end ? `ст ${osnStr[0]}, ч ${osnStr[1]}, п ${osnStr[2]}` : ''
                    objIsp.innerHTML = item.subject.split(':')[0]
                    summ.innerHTML = item.subject.split(':')[1] ? item.subject.split(':')[1] : ''
                    department.innerHTML = item.department
                    bailiff.innerHTML = item.bailiff
                    var tableRow = document.createElement('tr');
                    tableRow.appendChild(number)
                    tableRow.appendChild(dateStart)
                    tableRow.appendChild(name)
                    tableRow.appendChild(ispDoc)
                    tableRow.appendChild(dateEnd)
                    tableRow.appendChild(osn)
                    tableRow.appendChild(objIsp)
                    tableRow.appendChild(summ)
                    tableRow.appendChild(department)
                    tableRow.appendChild(bailiff)
                    document.getElementById('tbody').appendChild(tableRow)

                })
            }
        })
    }
    StepByStep(sliseArray)
}

function replaceSpecSymb(str) {
    str = str.replace(/<br>/ig, ' ');
    return str.replace(/&nbsp;|\n|&lt|&gt/ig, '')
}
let sliseArray = []
async function firstQuery() {
    document.getElementById("loader").style.visibility = 'visible';
    var token = 'vftMZ4Xip5WA'
    var start = document.getElementById("numberStart").value;
    var end = document.getElementById("numberEnd").value;
    document.getElementById('results').innerHTML = '';
    document.getElementById('tbody').innerHTML = '';
    var year = document.getElementById("year").value;
    var ip = document.getElementById("ip").value;
    let varRequest = []


    for (var i = start; i <= end; i++) {
        varRequest.push({
            "type": 3,
            "params": {
                "number": `${i}/${year}/${ip}-ИП`
            }
        })
    }
    while (varRequest.length > 0) {
        sliseArray.push(varRequest.splice(0, 50))
    }
    var i = 0;
    console.log(sliseArray)
    StepByStep(sliseArray)
}

async function StepByStep(sliseArray) {
    if (sliseArray.length > 0) {
        let item = sliseArray.splice(0, 1)[0]
        getUID(item)
    }
    else {
        const end = new Date().getTime();
        document.getElementById('time').innerHTML = (end - timeStart) / 1000
        document.getElementById("status").innerHTML = "DONE"
    }

}
/*for (const item of sliseArray) {
        await (async function (item) {
            await getUID(item).then(
                async () =>
                    setTimeout(() => {
 
                    }, timeout + 1000)
            )
        })(item)
    }*/
//'48485/19/66049-ИП'
//'26121/17/66023-ИП'
//'18842/18/66007-ИП'
function getUID(varRequest, token = 'vftMZ4Xip5WA') {

    let xhr = new XMLHttpRequest();

    xhr.open('POST', `https://cors-anywhere.herokuapp.com/https://api-ip.fssprus.ru/api/v1.0/search/group`, false);
    xhr.setRequestHeader('Content-Type', 'application/json')
    try {
        xhr.send(JSON.stringify({
            "token": token,
            "request": varRequest
        }));
        if (xhr.status != 200) {
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
            console.log('getUID', xhr.response)
            return setTimeout(() => {
                getStatus(JSON.parse(xhr.response).response.task)
            }, timeout);
        }
    } catch (err) { // для отлова ошибок используем конструкцию try...catch вместо onerror
        console.log(err)
        alert("getUID Запрос не удался");
    }
}



function getStatus(uid, token = 'vftMZ4Xip5WA') {

    let xhr = new XMLHttpRequest();

    xhr.open('GET', `https://cors-anywhere.herokuapp.com/https://api-ip.fssprus.ru/api/v1.0/status?token=${token}&task=${uid}`, false);

    try {
        xhr.send();
        if (xhr.status != 200) {
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
            let res = JSON.parse(xhr.response)
            console.log('getStatus', res)
            if (res.response.status != 0) {
                return setTimeout(() => {
                    return getStatus(uid, token)
                }, timeout);
            }
            else {
                getResult(uid)
            }
        }
    } catch (err) { // для отлова ошибок используем конструкцию try...catch вместо onerror
        alert("getStatus Запрос не удался");
    }
}
function getResult(uid, token = 'vftMZ4Xip5WA') {
    let xhr = new XMLHttpRequest();
    console.log('token-' + token, 'uid-' + uid);

    xhr.open('GET', `https://cors-anywhere.herokuapp.com/https://api-ip.fssprus.ru/api/v1.0/result?token=${token}&task=${uid}`, false);

    try {
        xhr.send();
        if (xhr.status != 200) {
            alert(`Ошибка ${xhr.status}: ${xhr.statusText}`);
        } else {
            let res = JSON.parse(xhr.response)
            console.log('getResult', res)
            setTimeout(() => {
                concatRes(res)
            }, timeout);
            return true
        }
    } catch (err) { // для отлова ошибок используем конструкцию try...catch вместо onerror
        console.log(err)
        alert("getResult Запрос не удался");
    }
}
