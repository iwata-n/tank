// Expressの設定
const express = require('express');
const app = express();
app.use(express.static('./'));
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});


// Johnny-five & milkcocoa
const five = require("johnny-five");
const board = new five.Board({port:'COM8'});
const MilkCocoa = require('milkcocoa');
const milkcocoa = new MilkCocoa('oniolavi4s.mlkcca.com');
const ds = milkcocoa.dataStore('command');

// 配線との対応
const motorL_F = 12;
const motorL_B = 11;
const motorR_F = 10;
const motorR_B = 9;
// 指令を受けてから止まるまでの時間(ミリ秒)
const SEQ_TIME = 500;

// 定数
const ON = 1;
const OFF = 0;


// Johnny-five
// このイベントはボードと接続後に呼び出されます
board.on("ready", () => {

  // ポートのI/O設定
  board.pinMode(motorL_F, five.Pin.OUTPUT);
  board.pinMode(motorL_B, five.Pin.OUTPUT);
  board.pinMode(motorR_F, five.Pin.OUTPUT);
  board.pinMode(motorR_B, five.Pin.OUTPUT);

  // 停止
  const stop = () => {
    console.log('stop');
    board.digitalWrite(motorL_F, OFF);
    board.digitalWrite(motorL_B, OFF);
    board.digitalWrite(motorR_F, OFF);
    board.digitalWrite(motorR_B, OFF);
  }

  const forward = () => {
    console.log('forward');
    board.digitalWrite(motorL_F, ON);
    board.digitalWrite(motorL_B, OFF);
    board.digitalWrite(motorR_F, ON);
    board.digitalWrite(motorR_B, OFF);
    board.wait(SEQ_TIME, () => stop());
  }

  const back = () => {
    console.log('back');
    board.digitalWrite(motorL_F, OFF);
    board.digitalWrite(motorL_B, ON);
    board.digitalWrite(motorR_F, OFF);
    board.digitalWrite(motorR_B, ON);
    board.wait(SEQ_TIME, () => stop());
  }

  const turn_right = () => {
    console.log('right');
    board.digitalWrite(motorL_F, OFF);
    board.digitalWrite(motorL_B, ON);
    board.digitalWrite(motorR_F, ON);
    board.digitalWrite(motorR_B, OFF);
    board.wait(SEQ_TIME, () => stop());
  }

  const turn_left = () => {
    console.log('left');
    board.digitalWrite(motorL_F, ON);
    board.digitalWrite(motorL_B, OFF);
    board.digitalWrite(motorR_F, OFF);
    board.digitalWrite(motorR_B, ON);
    board.wait(SEQ_TIME, () => stop());
  }

  // Milkcocoaからデータが送られてきた時のコールバック
  ds.on('send', (data) => {
    const command = data.value['command'];
    console.log('[' + command + ']');
    if (command == 'f') {
      forward();
    }
    else if (command == 'b') {
      back();
    }
    else if (command == 'r') {
      turn_right();
    }
    else if (command == 'l') {
      turn_left();
    }
    else if (command == 's') {
      stop();
    }
  });
});
