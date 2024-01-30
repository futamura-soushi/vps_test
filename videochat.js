var aX = 0, aY = 0, aZ = 0;                     // 加速度の値を入れる変数を3個用意
var prex = 0, prey = 0, prez = 0;
var velx = 0, vely = 0, velz = 0;
var timer = 0; 
var pretimer = 0;
var alpha = 0, beta = 0, gamma = 0;

// let timer, pretimer
let timer1;
let localStream;
let mediaConnection;

    //Peer作成
    const peer = new Peer({
      key: 'd60cc56b-3de6-4412-be61-003bd3c45d3b',
      debug: 3
  });

document.addEventListener('DOMContentLoaded', () => {
  const videoElement = document.getElementById('my-video');

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
          videoElement.srcObject = stream;
          videoElement.play();
          localStream = stream
      })
      .catch(error => {
          console.error('Error accessing rear camera:', error);
      });
});


  //PeerID取得
  peer.on('open', () => {
      document.getElementById('my-id').textContent = peer.id;
  });

  // 発信処理
document.getElementById('make-call').onclick = () => {
  const theirID = document.getElementById('their-id').value;
  const mediaConnection = peer.call(theirID, localStream, {videoCodec: 'H264',});
  setEventListener(mediaConnection);

  // 相手への接続を開始する
  // const conn = peer.connect(theirID);

  // // 接続が完了した場合のイベントの設定
  // conn.on("open", function() {
  //     document.getElementById('reset').addEventListener('click', onClickReset)
  //     document.getElementById('move').addEventListener('click', timerstop)
  //     timer1 = setInterval(sendInfo, 50);
  // });

  // // メッセージ受信イベントの設定
  // conn.on("data", data => {
  //     // 画面に受信したメッセージを表示
  //     $("#messages").append($("<p>").text(conn.id + ": " + data).css("font-weight", "bold"));

  // });

  // function timerstop(){
  //   if (timer1) {
  //     // タイマーが既に動作している場合は停止
  //     clearInterval(timer1);
  //     timer1 = null;
  //     document.getElementById('move').textContent = 'move'
  

  //   } else {
  //     // タイマーが停止中の場合は開始
  //     timer1 = setInterval(sendInfo, 50);
  //     document.getElementById('move').textContent = 'stop'
      

  //   }
  // }

  // function onClickReset(){
  //     const message = 'reset';
  //     conn.send(message);
  //     // 自分の画面に表示
  //     $("#messages").append($("<p>").html(peer.id + ": " + message));

  // }

  //   // 指定時間ごとに繰り返し実行される setInterval(実行する内容, 間隔[ms]) タイマーを設定
  //   function sendInfo(){
  //     // const info =aX + ',' + aY + ',' + aX + ',' + alpha + ',' + beta + ',' + gamma;
  //     const info =velx + ',' + vely + ',' + velz + ',' + alpha + ',' + beta + ',' + gamma;
  //     // console.log(info);
  //     conn.send(info);
  //   }

  
};


// イベントリスナを設置する関数
const setEventListener = mediaConnection => {
  mediaConnection.on('stream', stream => {
    // video要素にカメラ映像をセットして再生
    const videoElm = document.getElementById('their-video')
    videoElm.srcObject = stream;
    videoElm.play();
  });
}

//着信処理

peer.on('call', mediaConnection => {
  mediaConnection.answer(localStream, {
    videoBandwidth: 2000,
    videoCodec: 'H264'});
  setEventListener(mediaConnection);
});


// 相手からデータ通信の接続要求イベントが来た場合、このconnectionイベントが呼ばれる
// - 渡されるconnectionオブジェクトを操作することで、データ通信が可能
peer.on('connection', connection => {
  　
  // データ通信用に connectionオブジェクトを保存しておく
  

  // 接続が完了した場合のイベントの設定
  connection.on("open", function() {
    timer1 = setInterval(sendInfo, 2000);
    document.getElementById('send').addEventListener('click', onClickSend);
  });

  // メッセージ受信イベントの設定
      connection.on("data", data => {
          // 画面に受信したメッセージを表示
          $("#messages").append($("<p>").text(connection.id + ": " + data).css("font-weight", "bold"));
      });

  function onClickSend(){
      const message = document.getElementById('message').value;
      connection.send(message);
      // 自分の画面に表示
      $("#messages").append($("<p>").html(peer.id + ": " + message));

      // 送信テキストボックスをクリア
      var textform = document.getElementById("message");
      textform.value = '';
  }

  // 指定時間ごとに繰り返し実行される setInterval(実行する内容, 間隔[ms]) タイマーを設定
   function sendInfo(){
      const info = velx.toPrecision(5) + ',' + vely.toPrecision(5) + ',' + velz.toPrecision(5) + ',' + alpha + ',' + beta + ',' + gamma;
      console.log(info);
      connection.send(info);
    }

});




// メッセージ受信イベントの設定
function onRecvMessage(data) {
  // 画面に受信したメッセージを表示
  $("#messages").append($("<p>").text(conn.id + ": " + data).css("font-weight", "bold"));
}


//切断処理
document.getElementById('end-call').onclick = () => {
  console.log("切断")
  mediaConnection.close(true);
}


//加速度
//接続が切れたときに発火
peer.on('close', function(){
  mediaConnection.close(true);
});


  //. DeviceOrientationEvent オブジェクトが有効な環境か？　をチェック
  if( window.DeviceOrientationEvent ){
    //. iOS13 以上であれば DeviceOrientationEvent.requestPermission 関数が定義されているので、ここで条件分岐
    if( DeviceOrientationEvent.requestPermission && typeof DeviceOrientationEvent.requestPermission === 'function' ){
    //. iOS 13 以上の場合、
    //. 画面上部に「センサーの有効化」ボタンを追加
    var banner = '<div  style="z-index: 1; position: absolute; width: 100%; background-color: rgb(0, 0, 0);" onclick="ClickRequestDeviceSensor();" id="sensorrequest"><p style="color: rgb(0, 0, 255);">センサーの有効化</p></div>';
    $('body').prepend( banner );
    }else{
    //. Android または iOS 13 未満の場合、
    //. DeviceOrientationEvent オブジェクトが有効な場合のみ、deviceorientation イベント発生時に deviceOrientaion 関数がハンドリングするよう登録
    window.addEventListener( "devicemotion", (dat) =>{
        // aX = -dat.acceleration.x.toPrecision(5);    // x軸の重力加速度（Android と iOSでは正負が逆）
        // aY = -dat.acceleration.y.toPrecision(5);    // y軸の重力加速度（Android と iOSでは正負が逆）
        // aZ = -dat.acceleration.z.toPrecision(5);    // z軸の重力加速度（Android と iOSでは正負が逆）
        timer = performance.now()
        prex = aX;
        prey = aY;
        prez = aZ;
        aX = -dat.acceleration.x.toPrecision(5);    // x軸の重力加速度（Android と iOSでは正負が逆）
        aY = -dat.acceleration.y.toPrecision(5);    // y軸の重力加速度（Android と iOSでは正負が逆）
        aZ = -dat.acceleration.z.toPrecision(5);    // z軸の重力加速度（Android と iOSでは正負が逆）
        velx = (timer - pretimer)*(prex + aX)/2 + velx;
        vely = (timer - pretimer)*(prey + aY)/2 + vely;
        velz = (timer - pretimer)*(prez + aZ)/2 + velz;
        pretimer = performance.now()
        });

    window.addEventListener("deviceorientation", (dat) => {
      alpha = dat.alpha.toPrecision(5);  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
      beta  = dat.beta.toPrecision(5);   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
      gamma = dat.gamma.toPrecision(5);  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
  });

        // 指定時間ごとに繰り返し実行される setInterval(実行する内容, 間隔[ms]) タイマーを設定
        var timer = window.setInterval(() => {
            displayData();      // displayData 関数を実行
        }, 100); // 200msごとに（1秒間に約5回）
    }
}


function ClickRequestDeviceSensor(){
  //. ユーザーに「許可」を求めるダイアログを表示
  DeviceOrientationEvent.requestPermission().then( function( response ){
    if( response === 'granted' ){
      //. 画面上部のボタンを消す
      $('#sensorrequest').css( 'display', 'none' );
      //. 許可された場合のみイベントハンドラを追加できる
      window.addEventListener( "devicemotion", (dat) =>{
        // aX = dat.acceleration.x.toPrecision(5);    // x軸の重力加速度（Android と iOSでは正負が逆）
        // aY = dat.acceleration.y.toPrecision(5);    // y軸の重力加速度（Android と iOSでは正負が逆）
        // aZ = dat.acceleration.z.toPrecision(5);    // z軸の重力加速度（Android と iOSでは正負が逆）
        aX = dat.acceleration.x;    // x軸の重力加速度（Android と iOSでは正負が逆）
        aY = dat.acceleration.y;    // y軸の重力加速度（Android と iOSでは正負が逆）
        aZ = dat.acceleration.z;    // z軸の重力加速度（Android と iOSでは正負が逆）
        timer = performance.now() / 1000
        velx = (timer - pretimer) * (prex + aX) / 2 + velx;
        vely = (timer - pretimer) * (prey + aY) / 2 + vely;
        velz = (timer - pretimer) * (prez + aZ) / 2 + velz;
        pretimer = performance.now() / 1000
        prex = aX;
        prey = aY;
        prez = aZ;

      });

      window.addEventListener("deviceorientation", (dat) => {
        alpha = dat.alpha.toPrecision(5);  // z軸（表裏）まわりの回転の角度（反時計回りがプラス）
        beta  = dat.beta.toPrecision(5);   // x軸（左右）まわりの回転の角度（引き起こすとプラス）
        gamma = dat.gamma.toPrecision(5);  // y軸（上下）まわりの回転の角度（右に傾けるとプラス）
    });

      // 指定時間ごとに繰り返し実行される setInterval(実行する内容, 間隔[ms]) タイマーを設定
        var timer = window.setInterval(() => {
            displayData();      // displayData 関数を実行
        }, 200); // 200msごとに（1秒間に約5回）

      
    }
  }).catch( function( e ){
    console.log( e );
  });
}

function deviceOrientation( e ){
  //. 通常の処理を無効にする
  e.preventDefault();

  //. スマホの向きを取得
  var dir = e.alpha;   //. 北極方向に対する向きの角度
  var fb = e.beta;      //. 前後の傾き角度
  var lr = e.gamma;  //. 左右の傾き角度

    
}

// データを表示する displayData 関数
// function displayData() {
//   var txt = document.getElementById("txt");   // データを表示するdiv要素の取得
//   txt.innerHTML = "x: " + aX + "<br>"         // x軸の値
//                 + "y: " + prey + "<br>"         // y軸の値
//                 + "z: " + velz + "<br>"         // z軸の値
//                 + "α: " + alpha + "<br>"         // x軸の値
//                 + "β: " + beta + "<br>"         // y軸の値
//                 + "γ: " + gamma + "<br>"         // z軸の値
//                 + timer + "<br>" + pretimer +"<br>"
// }
