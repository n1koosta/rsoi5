'use strict';
class Phone {
    constructor(id, fio, address, phone, credit) {
            this.id = id;
            this.fio = fio;
            this.address = address;
            this.phone = phone;
            this.credit = credit;
    }
}        

class newField {
    constructor(field, value) {
        this.field = field;
        this.value = value;
    }    

}

const db = openDatabase('myDB', '1.0', 'phonebook', 2 * 1024 * 1024);
if (!db) {
	console.log('Failed to connect to database!');
	alert('Нет соединения с БД!!!');
}
//let query = 'CREATE TABLE IF NOT EXISTS PHONEBOOK (id INT, fio TEXT, address TEXT, credit BOOL)';
let query = 'CREATE TABLE IF NOT EXISTS PHONEBOOK (id INT, fio, address, phone, credit)';
//query = 'DROP TABLE PHONEBOOK';
db.transaction(function(tx) {
                    tx.executeSql(query);
                });
showId();

let newPhone = new Phone();

let id = document.getElementById('id');
let fio = document.getElementById('name');
let address = document.getElementById('location');
let phone = document.getElementById('phone');
let creditT = document.getElementById('creditTrue');
let creditF = document.getElementById('creditFalse');
let credit = false;
if (creditT.checked) {
	credit = true;
} 	

let regINT = /^\d+$/;
let regFIO = /^([a-zа-яё]+[\s]{0,1}[a-zа-яё]+[\s]{0,1}[a-zа-яё]+)$/ig;

let btnAdd = document.getElementById('addBtn');
btnAdd.addEventListener('click', addNewPhone);

let btnReset = document.getElementById('resetBtn');
btnReset.addEventListener('click', clearForm);

let btn_new = document.getElementById('addSpecButton');	
btn_new.addEventListener('click', new_input);

let btn_del_new = document.getElementById('delSpecButton'); 
//btn_del_new.addEventListener('click', del_new_input);

let btn_del = document.getElementById('delBtn'); 
btn_del.addEventListener('click', delPhone);

let btn_show = document.getElementById('showBtn'); 
btn_show.addEventListener('click', showTablePhones);

let btn_cred = document.getElementById('creditBtn'); 
btn_cred.addEventListener('click', showCredit);

let phonesMap = new Map();
initMap();

function initMap() {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM PHONEBOOK ORDER BY ID", [], function(tx, result) {
            for(var i = 0; i < result.rows.length; i++) 
            {
                let id = result.rows.item(i)['id'];
                let fio = result.rows.item(i)['fio'];
                let address = result.rows.item(i)['address'];
                let phone = result.rows.item(i)['phone'];
                let credit = result.rows.item(i)['credit'];
                let marital = result.rows.item(i)['marital'];
                let disability = result.rows.item(i)['disability'];
                let military = result.rows.item(i)['military'];
                let tmpPhone = new Phone(id,fio,address,phone,credit);
                /*newPhone.id = result.rows.item(i)['id'];
                newPhone.fio - fio;
                newPhone.address = address;
                newPhone.phone = phone;
                newPhone.credit = credit;
                if (marital != undefined) {
                    newProto("marital");
                    newPhone.marital = marital;
                }
                if (disability != undefined) {
                    newProto("disability");
                    newPhone.disability = disability;
                }
                if (military != undefined) {
                    newProto("military");
                    newPhone.military = military;
                }*/
                //console.log(tmpPhone);
                phonesMap.set(id,tmpPhone);
            }
        },null)});   
    //console.log(phonesMap);
}

function clearForm() {
	id.value = '';
	fio.value = '';
	address.value = '';
	phone.value = '';
	credit = false;
	creditFalse.checked = true;
    if (newPhone.marital != undefined || newPhone.disability != undefined  || newPhone.military != undefined) {
        newInput.value = '';
    }    
}

function addNewPhone() {
	let credit = false;
	if (creditT.checked) {
		credit = true;
	} 	

    if (!id.value || !fio.value || !address.value || !phone.value) {
        alert('Не заполнены все поля!!!');
        return;
    } else {
    	if (regINT.test(id.value) == false){
    		alert('Неверное ID!!!');
    		return;
    	}
    	if (regFIO.test(fio.value) == false){
    		alert('Ошибка в поле ФИО!!!');
    		return;
    	}
    	if (regINT.test(phone.value) == false){
    		alert('Ошибка в номере телефона (допускаются только цифры)!!!');
    		return;
    	}
        if (phonesMap.has(id.value)) {
            alert('Уже есть такой ID!!!');
            return;
        }
    }

    //console.log(newPhone);
    
    newPhone.id = id.value; 
    newPhone.fio = fio.value;
    newPhone.address = address.value;
    newPhone.phone = phone.value;
    newPhone.credit = credit;

    if (newPhone.marital != undefined) {
        newPhone.marital = newInput.value;
    }
    if (newPhone.disability != undefined) {
        newPhone.disability = newInput.value;
    }
    if (newPhone.military != undefined) {
        newPhone.military = newInput.value;
    }
    //console.log(newPhone);

    //console.log(addFields);
    addToMap(newPhone,addToDb);
    //addToDb(newPhone);
    //showId();
}

function cloneDb(Obj) {
    //console.log(Obj);
    let insQuery = 'INSERT INTO PHONEBOOK (id,fio,address,phone,credit) VALUES (?,?,?,?,?)';
    let arrayForQuery = [Obj.id,Obj.fio,Obj.address,Obj.phone,Obj.credit];
    db.transaction(function(tx) {
                         tx.executeSql(insQuery, arrayForQuery, null, null);
                    });
    showId();

}

function addToDb(Obj) {
	//console.log('Insert to base');
    //console.log(Obj);
    let insQuery = 'INSERT INTO PHONEBOOK (id,fio,address,phone,credit) VALUES (?,?,?,?,?)';
    let arrayForQuery = [Obj.id,Obj.fio,Obj.address,Obj.phone,Obj.credit];

    if (newPhone.marital != undefined) {
        insQuery = 'INSERT INTO PHONEBOOK (id,fio,address,phone,credit, marital) VALUES (?,?,?,?,?,?)';
        arrayForQuery = [Obj.id,Obj.fio,Obj.address,Obj.phone,Obj.credit,Obj.marital];
    }
    if (newPhone.disability != undefined) {
        insQuery = 'INSERT INTO PHONEBOOK (id,fio,address,phone,credit, disability) VALUES (?,?,?,?,?,?)';
        arrayForQuery = [Obj.id,Obj.fio,Obj.address,Obj.phone,Obj.credit,Obj.disability];
    }
    if (newPhone.military != undefined) {
        insQuery = 'INSERT INTO PHONEBOOK (id,fio,address,phone,credit, military) VALUES (?,?,?,?,?,?)';
        arrayForQuery = [Obj.id,Obj.fio,Obj.address,Obj.phone,Obj.credit,Obj.military];
    }

    db.transaction(function(tx) {
                         tx.executeSql(insQuery, arrayForQuery, null, null);
                    });
    showId();
}

function addToMap(Obj,callback) {
    //console.log('Insert to map');
    //console.log(Obj);
    phonesMap.set(Obj.id,Obj);
    callback(Obj);
}

function del_new_input() {
    document.getElementById('new_Field').innerHTML = "";
    let input = document.getElementById('newInput');
    input.parentNode.removeChild(input);

    btn_new.addEventListener('click', new_input);
    btn_del_new.removeEventListener('click', del_new_input);

    delProto();
    delNewStructDb();
}

function delNewStructDb() {
    let queryDrop = "DROP TABLE PHONEBOOK";
    db.transaction(function(tx) {
        tx.executeSql(queryDrop, [], null, null);
    });
    let queryCreate = 'CREATE TABLE IF NOT EXISTS PHONEBOOK (id INT, fio, address, phone, credit)';
    db.transaction(function(tx) {
                    tx.executeSql(queryCreate);
                });
    for(let tmpPhone of phonesMap.values()) {
        //console.log(tmpPhone); 
        cloneDb(tmpPhone);
    }
}

function delProto() {
    newPhone.__proto__={};
}

function new_input() {
    let inp_val = document.getElementById('new_input_select');    
    document.getElementById('new_Field').innerHTML = inp_val.options[inp_val.selectedIndex].text;
	let insLabel = document.getElementById('forInsert');
	let tmp = document.createElement('input');
	var parentDiv = insLabel.parentNode;	//возвращает родительский узел
		
	parentDiv.insertBefore(tmp, insLabel);
	tmp.setAttribute('type', 'text');
	tmp.setAttribute('size', '20');
	tmp.setAttribute('class', 'textField');
	tmp.setAttribute('id', 'newInput');
	tmp.setAttribute('style', 'display');
	tmp.setAttribute('maxlength','20');
	tmp.setAttribute('placeholder','');

    btn_del_new.addEventListener('click', del_new_input);
    btn_new.removeEventListener('click', new_input);

    newProto(inp_val.value);
    newStructDb();
}

function newProto(val) {
    if (val == "marital") {
        newPhone.__proto__= {marital: ''};
    }
    if (val == "disability") {
        newPhone.__proto__= {disability: ''};
    }
    if (val == "military") {
        newPhone.__proto__= {military: ''};
    }
}

function newStructDb() {
    let query = '';
    if (newPhone.marital != undefined) {
        query = "ALTER TABLE PHONEBOOK ADD marital";
    }
    if (newPhone.disability != undefined) {
        query = "ALTER TABLE PHONEBOOK ADD disability";
    }
    if (newPhone.military != undefined) {
        query = "ALTER TABLE PHONEBOOK ADD military";
    }
    db.transaction(function(tx) {
        tx.executeSql(query, [], null, null);
    });
}

function showId() {
    let select = document.querySelector('#dataSelect');
    select.innerHTML = "";
    //var select = document.getElementById("dataSelect");
    db.transaction(function(tx) {
        let tmp;
        let newOption;
        tx.executeSql("SELECT * FROM PHONEBOOK ORDER BY ID", [], function(tx, result) {
            for(var i = 0; i < result.rows.length; i++) 
            {
                tmp = result.rows.item(i)['id'];
                newOption = new Option(tmp, tmp);
                select.appendChild(newOption);
            }
        },null)});   
}

function delPhone() {
    let select = document.getElementById("dataSelect");
    if (select.options.length){
        let value = select.options[select.selectedIndex].value;
        delFromMap(value,delFromDb);
        //delFromDb(value);
        //showId();
    }
}

function delFromMap(id,callback) {
    phonesMap.delete(id);
    callback(id);
}

function delFromDb(id) {
    db.transaction(function (x) {
            x.executeSql("DELETE FROM PHONEBOOK WHERE id=?", [id]);
           }); 
    showId();
}

function showTablePhones() {
    let tablePhones = document.getElementById("phonesTable");
    if (tablePhones.style.display != "none") {
        tablePhones.style.display = "none";
        return;
    }
    var html = '<tr><th>ID</th><th>ФИО</th><th>Адрес</th><th>Телефон</th><th>Долг</th></tr>';
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM PHONEBOOK ORDER BY ID", [], function(tx, result) {
            for(var i = 0; i < result.rows.length; i++) 
            {
                let id = result.rows.item(i)['id'];
                let fio = result.rows.item(i)['fio'];
                let address = result.rows.item(i)['address'];
                let phone = result.rows.item(i)['phone'];
                let credit = result.rows.item(i)['credit'];
                let tmpPhone = new Phone(id,fio,address,phone,credit);
                html+='<tr><td>'+id+'</td>';
                html+='<td>'+fio+'</td>';
                html+='<td>'+address+'</td>';
                html+='<td>'+phone+'</td>';
                if (credit == "true") {
                    html+='<td>'+'задолженность'+'</td></tr>';    
                } else {
                    html+='<td>'+'</td></tr>';    
                }
                tablePhones.innerHTML = html;
            }
        },null)});   
    tablePhones.style.display = "table";
}

function showCredit() {
    let tablePhones = document.getElementById("creditTable");
    if (tablePhones.style.display != "none") {
        tablePhones.style.display = "none";
        return;
    }
    var html = '<tr><th>ID</th><th>ФИО</th><th>Адрес</th><th>Телефон</th></tr>';
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM PHONEBOOK WHERE credit=? ORDER BY ID", [true], function(tx, result) {
            for(var i = 0; i < result.rows.length; i++) 
            {
                let id = result.rows.item(i)['id'];
                let fio = result.rows.item(i)['fio'];
                let address = result.rows.item(i)['address'];
                let phone = result.rows.item(i)['phone'];
                let tmpPhone = new Phone(id,fio,address,phone,credit);
                html+='<tr><td>'+id+'</td>';
                html+='<td>'+fio+'</td>';
                html+='<td>'+address+'</td>';
                html+='<td>'+phone+'</td>';
                tablePhones.innerHTML = html;
            }
        },null)});   
    tablePhones.style.display = "table";
}