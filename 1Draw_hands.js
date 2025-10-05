// ----=  HANDS  =----
/* load images here */
function prepareInteraction() {
  //bgImage = loadImage('/images/background.png');
}

function drawInteraction(faces, hands) {
  // hands part
  // for loop to capture if there is more than one hand on the screen. This applies the same process to all hands.
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    //console.log(hand);
    if (showKeypoints) {
      drawConnections(hand)
    }
    let tips = [hand.thumb_tip.x,hand.thumb_tip.y,
      hand.index_finger_tip.x,hand.index_finger_tip.y,
        hand.middle_finger_tip.x,hand.middle_finger_tip.y,
        hand.ring_finger_tip.x,hand.ring_finger_tip.y,
        hand.pinky_finger_tip.x,hand.pinky_finger_tip.y
      ];
      let mids = [hand.thumb_ip.x,hand.thumb_ip.y,
      hand.index_finger_dip.x,hand.index_finger_dip.y,
        hand.middle_finger_dip.x,hand.middle_finger_dip.y,
        hand.ring_finger_dip.x,hand.ring_finger_dip.y,
        hand.pinky_finger_dip.x,hand.pinky_finger_dip.y
      ];
    // This is how to load in the x and y of a point on the hand.
    //let indexFingerTipX = hand.index_finger_tip.x;
    //let indexFingerTipY = hand.index_finger_tip.y;
let wristX = hand.wrist.x;
let wristY = hand.wrist.y;
   
    //  let pinkyFingerTipX = hand.pinky_finger_tip.x;
    //  let pinkyFingerTipY = hand.pinky_finger_tip.y;

    /*
    Start drawing on the hands here
    */

   let handedness = hand.handedness;
    
    firstDraw(tips, wristX, wristY)
    firstDraw(mids,wristX, wristY)
    drawPoints(hand)
    drawFly(wristX, wristY, handedness)

   

    //fingerPuppet(indexFingerTipX, indexFingerTipY);

    //chameleonHandPuppet(hand)

    /*
    Stop drawing on the hands here
    */
  }
  // You can make addtional elements here, but keep the hand drawing inside the for loop. 
  //------------------------------------------------------
}




function firstDraw(tips, wristX, wristY) {
  noFill()
  let curX = tips[0];
  let curY = tips[1];
  for (let i = 2; i < tips.length; i += 2) {
    bezier(curX, curY, (wristX + curX*2)/3, (wristY +curY*2)/3, (wristX + curX*2)/3, (wristY +curY*2)/3, tips[i], tips[i + 1])
    curX = tips[i];
    curY = tips[i+1];
  }
  rect(1250,700,20)

}
let flyX =  30;
let flyY = 30;
let acc = .5;
let velX = 0;
let velY = 0;
function drawFly(x,y,handedness){
  if (handedness == "Left"){
  if (flyX > x){velX -= acc}
  if (flyX < x){velX += acc}
  if (flyY > y){velY -= acc}
  if (flyY < y){velY += acc}
  fill(0,0,0)
  circle(flyX,flyY,20,20)
  flyX += velX
  flyY += velY
  if(flyX < 0){velX = -velX}
  if(flyY < 0){velY = -velY}
  if(flyX > 1250){velX = -velX*0.8}
  if(flyY > 700) {velY = -velY*0.8}
}
}

function drawHelpr(x,y,n){
  fill(255-n*10,0+n*10,0)
  noStroke()
  rect(x,y,20,20)
  if (n<20){
  setTimeout(() => drawHelpr(x, y,n+1), 10);
}
}

function fingerPuppet(x, y) {
  fill(255, 38, 219) // pink
  ellipse(x, y, 100, 20)
  ellipse(x, y, 20, 100)

  fill(255, 252, 48) // yellow
  ellipse(x, y, 20) // draw center 

}


function pinchCircle(hand) { // adapted from https://editor.p5js.org/ml5/sketches/DNbSiIYKB
  // Find the index finger tip and thumb tip
  let finger = hand.index_finger_tip;
  //let finger = hand.pinky_finger_tip;
  let thumb = hand.thumb_tip;

  // Draw circles at finger positions
  let centerX = (finger.x + thumb.x) / 2;
  let centerY = (finger.y + thumb.y) / 2;
  // Calculate the pinch "distance" between finger and thumb
  let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);

  // This circle's size is controlled by a "pinch" gesture
  fill(0, 255, 0, 200);
  stroke(0);
  strokeWeight(2);
  circle(centerX, centerY, pinch);

}

function chameleonHandPuppet(hand) {
  // Find the index finger tip and thumb tip
  // let finger = hand.index_finger_tip;

  let finger = hand.middle_finger_tip; // this finger now contains the x and y infomation! you can access it by using finger.x 
  let thumb = hand.thumb_tip;

  // Draw circles at finger positions
  let centerX = (finger.x + thumb.x) / 2;
  let centerY = (finger.y + thumb.y) / 2;
  // Calculate the pinch "distance" between finger and thumb
  let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);

  // This circle's size is controlled by a "pinch" gesture
  fill(0, 255, 0, 200);
  stroke(0);
  strokeWeight(2);
  circle(centerX, centerY, pinch);

  let indexFingerTipX = hand.index_finger_tip.x;
  let indexFingerTipY = hand.index_finger_tip.y;
  fill(0)
  circle(indexFingerTipX, indexFingerTipY, 20);

}

function drawConnections(hand) {
  // Draw the skeletal connections
  push()
  for (let j = 0; j < connections.length; j++) {
    let pointAIndex = connections[j][0];
    let pointBIndex = connections[j][1];
    let pointA = hand.keypoints[pointAIndex];
    let pointB = hand.keypoints[pointBIndex];
    stroke(255, 0, 0);
    strokeWeight(2);
    line(pointA.x, pointA.y, pointB.x, pointB.y);
  }
  pop()
}


// This function draw's a dot on all the keypoints. It can be passed a whole face, or part of one. 
function drawPoints(feature) {
  push()
  for (let i = 0; i < feature.keypoints.length; i++) {
    let element = feature.keypoints[i];
    noStroke();
    fill(0, 255, 0);
    circle(element.x, element.y, 10);
  }
  pop()

}