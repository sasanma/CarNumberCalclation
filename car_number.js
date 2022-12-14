
/*--------------------------------------------------------------------------*/
/*4桁の数字に四則演算を使って作成することができる式と答えの一覧を表示するプログラム*/
/*--------------------------------------------------------------------------*/


/*-----------------------------変数宣言---------------------------------*/

//結果記録用配列    {式, 表示用答え, 比較用答え}
var resultArray = [
                    {"formula" : "記録例", "answer" : 10, "value" : 10}];

//表示する項目名
const viewItem = ["formula", "answer"];

//入力された値を入れる配列
var inputNum = [];

//計算途中の値を入れる配列
var calcValue = [];

//演算の記号を入れる配列
const calcSign = ["+", "-", "*", "/"];


/*-----------------------------クラスの定義-----------------------------*/

//分数クラス
class fraction {
    //コンストラクタ
    constructor(mol, den, formula) {
        //分子
        this.mol = mol;
        //分母
        this.den = den;
        //式
        this.formula = formula;
    }

    //メソッド
    //約分
    reduction = () => {
        var divisor = euclideanAlgorithm(this.mol, this.den);
        this.mol /= divisor;
        this.den /= divisor;
    }
}




/*-----------------------------関数定義---------------------------------*/

//tableに表示する関数(引数：結果を記録した配列)
var viewResult = (result) => {
    //テーブルを取得する
    var table = document.getElementById("result_table");
    
    //表示を初期化する
    while(table.rows.length > 1) {
        table.deleteRow(-1);
    }
    

    //result内の要素を全てtableに表示する
    for(var i of result) {
        //行の追加
        tr = document.createElement("tr");
        
        for(var j of viewItem) {
            //列の追加(式、答え)
            var td = document.createElement("td");
            td.innerHTML = i[j];
            tr.appendChild(td);
        }

        //テーブルに追加
        table.appendChild(tr);
    }
}

//入力された数値が1～3桁だった場合に4桁に調整する関数(引数：入力された数字の配列)
var adjustNum = (numberArray) => {
    while(numberArray.length < 4) {
        numberArray.unshift(0);
    }
}

//最大公約数を求める関数(引数：最大公約数を求めたい2つの数) 戻り値：最小公約数
var euclideanAlgorithm = (num1, num2) => {
    //num1に大きい方の値を入れる
    if(num1 < num2) [num1,num2] = [num2,num1];

    //被除数
    var diven = num1;
    //除数
    var div = num2;
    //余り
    var rem;


    //ユークリッド互除法によって最小公約数を求める
    do {
        rem = diven % div;
        diven = div;
        div = rem;
    } while(rem != 0);

    return diven;
}

//分数の四則演算を行い分数で返す関数(引数：fraction, fraction, 符号) 戻り値：fraction
var calcFraction = (fra1, fra2, sign) => {

    //計算結果の分子、分母、式
    var mol;
    var den;
    var formula;

    //計算をする2つの数の分子、分母
    var mol1 = fra1.mol;
    var den1 = fra1.den;
    var mol2 = fra2.mol;
    var den2 = fra2.den;

    

    //四則演算を適用する
    if(sign == "+") {
        mol = mol1 * den2 + mol2 * den1;
        den = den1 * den2;
    } else if(sign == "-") {
        mol = mol1 * den2 - mol2 * den1;
        den = den1 * den2;
    } else if(sign == "*") {
        mol = mol1 * mol2;
        den = den1 * den2;
    } else if(sign == "/") {
        mol = mol1 * den2;
        den = mol2 * den1;
    }

    //計算式を作成
    formula = "(" + fra1.formula + sign + fra2.formula + ")";

    
    return new fraction(mol, den, formula);
}

//配列から2つの数値を選んで計算処理を行う関数(引数：配列)
var mergeArrayValue = (inputArray) => {
    //inputArray内の2つの数値を選ぶ
    for(var i = 0; i < inputArray.length; i++) {
        for(var j = i; j < inputArray.length; j++){
            if(i == j) continue; 
            //それぞれの四則演算を適用する
            for(var k of calcSign) {
                var outputArray = inputArray.concat();
                //0では割らない
                if((k == "/") && (outputArray[j].mol === 0)) continue;
                //引き算、割り算は、値が前後逆の場合も考える
                if((k == "-") || (k == "/")) {
                    mergeValue(outputArray, j, i, k);
                    outputArray = inputArray.concat();
                }
                //2つの値を1つにまとめる
                mergeValue(outputArray, i, j, k);
            }
        }
    }
}

//指定配列の2つの指定位置の値を1つにまとめる関数(引数：配列, 配列番号 配列番号, 記号)
var mergeValue = (array, index1, index2,sign) => {
    //2つの値をまとめたものを追加して使った値を消す
    array.push(calcFraction(array[index1], array[index2], sign));
    array.splice(index1, 1);
    array.splice((index1 < index2) ? index2 - 1 : index2, 1);
   
    //終了判定
    if(array.length >= 2) {
        mergeArrayValue(array);
    } else {
        resultFra = array[0];
        //結果配列に記録する
        if(resultFra.den === 1) {
            resultArray.push({"formula" : resultFra.formula, "answer" : resultFra.mol, "value" : resultFra.mol});
        } else if(resultFra.mol === 0) {
            resultArray.push({"formula" : resultFra.formula, "answer" : 0, "value" : 0});
        } else if(resultFra.den !== 0) {
            //分数の形でしか表せない数のみ約分する
            resultFra.reduction();
            if(resultFra.den === 1) {
                resultArray.push({"formula" : resultFra.formula, "answer" : resultFra.mol, "value" : resultFra.mol});
            }else {
                resultArray.push({"formula" : resultFra.formula, "answer" : resultFra.mol + "/" + resultFra.den, "value" : resultFra.mol / resultFra.den});
            }
        }
    }
}

//ドロップダウンリストに答えの値を追加する
var addDropDownMenu = (inputArray) => {
    var select = document.getElementById("select_value");
    while(select.childNodes.length > 0) {
        select.removeChild(select.firstChild);
    }
    var addNumType = [];
    for(var i of inputArray) {
        if(!(addNumType.includes(i.answer))) {
            var option = document.createElement("option");
            option.text = i.answer;
            addNumType.push(i.answer);
            select.appendChild(option);
        }
    } 
}

//計算式が同じものは1つのものにまとめる関数
var searchSameFormula = (inputArray) => {
    var outputArray = [];
    outputArray.push(inputArray[0]);
    for(var i of inputArray) {
        for(var j of outputArray) {
            if(j.formula == i.formula) {
                break;
            }
        }
        if(j.formula == i.formula) {
            continue;
        }
        outputArray.push(i);
    } 
    return outputArray;
}

/*-----------------------------ユーザ操作に応じた処理---------------------------------*/

//入力欄制御
$(".input_num").focusout(function() {
    if(typeof $(this).attr('min') !== "undefined" && parseInt($(this).val()) < parseInt($(this).attr('min')))
        $(this).val($(this).attr('min'));
    else if(typeof $(this).attr('max') !== "undefined" && parseInt($(this).val()) > parseInt($(this).attr('max')))
        $(this).val($(this).attr('max'));
    else if(typeof $(this).attr('min') !== "undefined" && $(this).val() === '')
        $(this).val($(this).attr('min'));
});

//表示数値変更
$("#select_value").change(function() {
    var value = $("option:selected").val();
    var viewValueArray = [];
    for(var i of resultArray) {
        if(i.answer == value) {
            viewValueArray.push(i);
        }
    }
    viewResult(viewValueArray);
});


//確定ボタンクリック時の処理
$("#decide").on("click", function() {
    //結果配列を初期化
    resultArray.splice(0);

    //入力された数値を分割し、4桁に満たない場合は4桁に調整する
    inputNum = $(".input_num").val().split("");
    adjustNum(inputNum);

    //入力された値を全て分数にする
    for(var i in inputNum) {
        calcValue[i] = new fraction(inputNum[i], 1, inputNum[i]);
    }

    //全ての組み合わせの計算を行う
    mergeArrayValue(calcValue);

    //重複があるものを削除する
    resultArray = searchSameFormula(resultArray);
    
    //結果配列を昇順でソートする
    resultArray.sort((a, b) => a.value - b.value);

    //結果を表示する
    for(var i of resultArray) {
        //if(i.answer == 10) {
            console.log(i.formula + " : " + i.answer);
        //}
    }
    addDropDownMenu(resultArray);
});