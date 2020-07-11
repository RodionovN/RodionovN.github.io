document.addEventListener('DOMContentLoaded', function () {

})

function parseSites() {
    firstQuery().then(nextPagesLoaded()).then(
        function () {
            document.getElementById("buttonGetExcel").removeAttribute("disabled")
        }
    )
}


function getCSV() {
    const arr = []
    const rows = document.querySelectorAll("[id='table'] tr")

    rows.forEach(function (rowItem, i, array) {
        var row = []
        rowItem.querySelectorAll('th').forEach(function (item, ind, ar) {
            var temp = '';
            temp = item.innerHTML;
            temp = '"' + temp.replace(/&nbsp;|\n|<br>|&lt|&gt/ig, '') + '"'
            console.log(temp)
            row.push(temp)
        })
        rowItem.querySelectorAll('td').forEach(function (item, ind, ar) {
            var temp = '';
            if (item.querySelector('a') != null) {
                temp = item.querySelector('a').href
            } else {
                temp = item.innerHTML;
            }
            temp = '"' + temp.replace(/&nbsp;|\n|<br>|&lt|&gt/ig, '') + '"'
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

async function firstQuery() {
    var result = document.getElementById("results");
    var date1 = document.getElementById("date1").value;
    var date2 = document.getElementById("date2").value;
    document.getElementById("loader").style.visibility = 'visible';
    document.getElementById('results').innerHTML = '';
    document.getElementById('table').innerHTML = '';
    await getPage(1, result, date1, date2)
}

async function nextPagesLoaded() {
    await setTimeout(() => {
        var result = document.getElementById("results");
        var date1 = document.getElementById("date1").value;
        var date2 = document.getElementById("date2").value;
        var textPos = result.innerText.indexOf('Всего по запросу найдено — ') + "Всего по запросу найдено — ".length
        maxPage = Math.ceil(parseInt(result.innerText.substr(textPos,
            result.innerText.indexOf('.', textPos) - textPos)) / 25);
        for (var i = 2; i <= maxPage; i++) {
            getPage(i, result, date1, date2, maxPage)
            if (i > 300) {
                break;
            }
        }
        document.getElementById("loader").style.visibility = "hidden"
    }, 1);
}

async function getPage(num, result, date1, date2, maxPage = 1) {
    var str = document.getElementById('input').value;
    var pageStr = '&name_op=r&page=' + num + '&delo_id=1540005&case_type=0&new=0&G1_PARTS__NAMESS=&g1_case__CASE_NUMBERSS=&g1_case__JUDICIAL_UIDSS=&delo_table=g1_case&g1_case__ENTRY_DATE1D=' + date1 + '&g1_case__ENTRY_DATE2D=' + date2 + '&G1_CASE__JUDGE=&g1_case__RESULT_DATE1D=&g1_case__RESULT_DATE2D=&G1_CASE__RESULT=&G1_CASE__BUILDING_ID=&G1_CASE__COURT_STRUCT=&G1_EVENT__EVENT_NAME=&G1_EVENT__EVENT_DATEDD=&G1_PARTS__PARTS_TYPE=&G1_PARTS__INN_STRSS=&G1_PARTS__KPP_STRSS=&G1_PARTS__OGRN_STRSS=&G1_PARTS__OGRNIP_STRSS=&G1_RKN_ACCESS_RESTRICTION__RKN_REASON=&g1_rkn_access_restriction__RKN_RESTRICT_URLSS=&G1_DOCUMENT__PUBL_DATE1D=&G1_DOCUMENT__PUBL_DATE2D=&G1_CASE__VALIDITY_DATE1D=&G1_CASE__VALIDITY_DATE2D=&G1_ORDER_INFO__ORDER_DATE1D=&G1_ORDER_INFO__ORDER_DATE2D=&G1_ORDER_INFO__ORDER_NUMSS=&G1_ORDER_INFO__STATE_ID=&Submit=%CD%E0%E9%F2%E8'
    //'/modules.php?name=sud_delo&srv_num=1&name_op=r&page=' + num + '&delo_id=1540005&case_type=0&new=0&G1_PARTS__NAMESS=&g1_case__CASE_NUMBERSS=&g1_case__JUDICIAL_UIDSS=&delo_table=g1_case&g1_case__ENTRY_DATE1D=' + date1 + '&g1_case__ENTRY_DATE2D=' + date2 + '&G1_CASE__JUDGE=&g1_case__RESULT_DATE1D=&g1_case__RESULT_DATE2D=&G1_CASE__RESULT=&G1_CASE__BUILDING_ID=&G1_CASE__COURT_STRUCT=&G1_EVENT__EVENT_NAME=&G1_EVENT__EVENT_DATEDD=&G1_PARTS__PARTS_TYPE=&G1_PARTS__INN_STRSS=&G1_PARTS__KPP_STRSS=&G1_PARTS__OGRN_STRSS=&G1_PARTS__OGRNIP_STRSS=&G1_RKN_ACCESS_RESTRICTION__RKN_REASON=&g1_rkn_access_restriction__RKN_RESTRICT_URLSS=&G1_DOCUMENT__PUBL_DATE1D=&G1_DOCUMENT__PUBL_DATE2D=&G1_CASE__VALIDITY_DATE1D=&G1_CASE__VALIDITY_DATE2D=&G1_ORDER_INFO__ORDER_DATE1D=&G1_ORDER_INFO__ORDER_DATE2D=&G1_ORDER_INFO__ORDER_NUMSS=&G1_ORDER_INFO__STATE_ID=&Submit=%CD%E0%E9%F2%E8'
    var reqNew = new XMLHttpRequest()
    reqNew.open('GET', 'https://cors-anywhere.herokuapp.com/' + str + pageStr, false)
    await reqNew.send()
    if (reqNew.status == 200) {
        result.innerHTML = reqNew.response
        var strForSearch = num === 1 ? "table[id='tablcont'] tr" : "table[id='tablcont'] tr:not(:first-child)"
        var res = result.querySelectorAll(strForSearch);
        if (num)
            res.forEach((element) => {
                if (element.querySelector('a')) {
                    console.log()
                    element.querySelector('a').href = element.querySelector('a').href.replace(/file:\/\/\/c:/i, str)
                };
                var table2 = document.querySelector("[id='table']")
                table2.appendChild(element);
            });
        document.getElementById("downloadPage").innerHTML = `Загружено ${num} из ${maxPage}`
    }
    str = ''
}
