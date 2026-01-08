// this is bball code, reference code
let p1 = 0;
let p2 = 0;
let homeTeam = "Glenforest";
let away = "Lozersss";
let p1Fouls = 0;
let p2Fouls = 0;
let currentPeriod = 1;
let percent = 0.25;
// allat is js experimental code

let p1Timeouts = 2;
let p2Timeouts = 2;
let timeoutActive = false;
let timeoutSecondsRemaining = 60;
let timeoutInterval = null;
let timeoutOverlay = null;
let timeoutWasRunning = false; // Track if timer was running before timeout

// Timeout card dimensions and positions
let timeoutCardWidth = 220;
let timeoutCardHeight = 180;
let timeout1X, timeout1Y, timeout2X, timeout2Y;

// Timeout button
let timeoutButtonX, timeoutButtonY;
let timeoutButtonWidth = 140;
let timeoutButtonHeight = 60;

// Timeout animation variables
let p1TimeoutGlow = 0;
let p2TimeoutGlow = 0;
let p1TimeoutGlowColor = "gold";
let p2TimeoutGlowColor = "gold";
let p1TimeoutScaleAnim = 0;
let p2TimeoutScaleAnim = 0;

// Timeout button positions for cards
let team1_timeout_plus_X, team1_timeout_plus_Y;
let team1_timeout_minus_X, team1_timeout_minus_Y;
let team2_timeout_plus_X, team2_timeout_plus_Y;
let team2_timeout_minus_X, team2_timeout_minus_Y;

// from allat to here this was all experimental, delete everythingin between if this doesnt work
// buttons for fouls and periosd
let smallButtonWidth = 60;
let smallButtonHeight = 40;

// Timer button dimensions
let timerButtonWidth = 120;
let timerButtonHeight = 60;

// Score button dimensions
let scoreButtonWidth = 90;
let scoreButtonHeight = 50;

let space = 20;
let buttonSpacing = 20;
let buttonOff = 15;

// Card dimensions
let cardWidth = 350;
let cardHeight = 400;
let foulCardWidth = 220;
let foulCardHeight = 180;
let card1X, card1Y, card2X, card2Y;
let foul1X, foul1Y, foul2X, foul2Y;
let foulgep = 25;
let p1Sets = 0;
let p2Sets = 0;
let set_btn_plus_X, set_btn_plus_Y;
let set_btn_minus_X, set_btn_minus_Y;

// Score buttons for team 1
let team1_btn_plus1_X, team1_btn_plus1_Y;
let team1_btn_plus2_X, team1_btn_plus2_Y;
let team1_btn_minus1_X, team1_btn_minus1_Y;

// Score buttons for team 2
let team2_btn_plus1_X, team2_btn_plus1_Y;
let team2_btn_plus2_X, team2_btn_plus2_Y;
let team2_btn_minus1_X, team2_btn_minus1_Y;

// Timer
let scoreDisX, scoreDisY, scoreDisW, scoreDisH;
let startX, startY, stopX, stopY;
let hornX, hornY, resetX, resetY;
let hornSound;

// fouls and period button positions
let team1_foul_plus_X, team1_foul_plus_Y;
let team1_foul_minus_X, team1_foul_minus_Y;
let team2_foul_plus_X, team2_foul_plus_Y;
let team2_foul_minus_X, team2_foul_minus_Y;
let period_plus_X, period_plus_Y;
let period_minus_X, period_minus_Y;


// Timer logic
let totalMillis = 0;
let timerRunning = false;
let lastUpdate = 0;

// Score change animation
let p1Glow = 0;
let p2Glow = 0;
let p1GlowColor = "gold";
let p2GlowColor = "gold";
let p1ScaleAnim = 0;
let p2ScaleAnim = 0;

// Foul animation lit same hehe, im js too lazy to change the variable names yay
let p1FoulGlow = 0;
let p2FoulGlow = 0;
let p1FoulGlowColor = "gold";
let p2FoulGlowColor = "gold";
let p1FoulScaleAnim = 0;
let p2FoulScaleAnim = 0;
let setGlow = 0;          
let setGlowColor = "gold";
let setScaleAnim = 0;


// Button press animation
let pressedButton = null;
let pressTimer = 0;

function preload() {
    hornSound = loadSound("gameBuzzer.mp3");
}

function setup() {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';

    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('display', 'block');

    textFont('Teko, sans-serif');

    scoreDisW = 600;
    scoreDisH = 200;

    setPositions();
    setSetCardPositions();
    lastUpdate = millis();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setPositions();
    setSetCardPositions();
    setTimeoutPositions();
}

function setPositions() {
    //bball positions
    // Card X positions stay the same
    let sideMargin = width * percent - cardWidth;
    card1X = sideMargin;
    card2X = width - cardWidth - sideMargin;

    // Timer and card block dimensions
    let totalBlockHeight = scoreDisH + cardHeight + 40; // 40 is your vertical gap between timer and cards
    // Center the block vertically
    let topY = (height - totalBlockHeight) / 2  -10;

    // Timer position
    scoreDisX = width / 2 - scoreDisW / 2;
    scoreDisY = topY;
    timerTextX = scoreDisX + scoreDisW / 2;
    timerTextY = scoreDisY + scoreDisH / 2;

    // Timer buttons
    startX = scoreDisX + scoreDisW + buttonSpacing;
    startY = scoreDisY + scoreDisH / 2 - timerButtonHeight / 2 - buttonOff;
    stopX = startX;
    stopY = startY + timerButtonHeight + buttonSpacing;

    resetX = scoreDisX - timerButtonWidth - buttonSpacing;
    resetY = scoreDisY + scoreDisH / 2 - timerButtonHeight / 2 - buttonOff;
    hornX = resetX;
    hornY = resetY + timerButtonHeight + buttonSpacing;

    // Cards Y positions

    // Y position so bottom gap === side gap
    let verticalGap = constrain(height * 0.08, 40, 120); // scales but stays reasonable
    card1Y = scoreDisY + scoreDisH + verticalGap;
    card2Y = card1Y;

    // Button positioning within cards
    let buttonRowY = cardHeight - 75;
    let buttonCenterX = cardWidth / 2;
    let buttonTotalWidth = scoreButtonWidth * 3 + space * 2;
    let startButtonX = buttonCenterX - buttonTotalWidth / 2;

    // Team 1 buttons (left card)
    team1_btn_plus2_X = card1X + startButtonX;
    team1_btn_plus2_Y = card1Y + buttonRowY;

    team1_btn_plus1_X = team1_btn_plus2_X + scoreButtonWidth + space;
    team1_btn_plus1_Y = card1Y + buttonRowY;

    team1_btn_minus1_X = team1_btn_plus1_X + scoreButtonWidth + space;
    team1_btn_minus1_Y = card1Y + buttonRowY;

    // Team 2 buttons (right card)
    team2_btn_plus2_X = card2X + startButtonX;
    team2_btn_plus2_Y = card2Y + buttonRowY;

    team2_btn_plus1_X = team2_btn_plus2_X + scoreButtonWidth + space;
    team2_btn_plus1_Y = card2Y + buttonRowY;

    team2_btn_minus1_X = team2_btn_plus1_X + scoreButtonWidth + space;
    team2_btn_minus1_Y = card2Y + buttonRowY;

    // --- Foul card positions ---
    foul1X = card1X + cardWidth + 50; // to the right of team 1 card
    foul1Y = card1Y;                  // aligned vertically with team 1 card

    foul2X = card2X - foulCardWidth - 50; // to the left of team 2 card
    foul2Y = card2Y;                       // aligned vertically with team 2 card

    // Team 1 foul button positions
    team1_foul_plus_X  = foul1X + foulCardWidth/2 - smallButtonWidth - 10; // left of center
    team1_foul_minus_X = foul1X + foulCardWidth/2 + 10;                    // right of center
    team1_foul_plus_Y  = foul1Y + foulCardHeight - smallButtonHeight - 20; // near bottom
    team1_foul_minus_Y = team1_foul_plus_Y;

    // Team 2 foul button positions
    team2_foul_plus_X  = foul2X + foulCardWidth/2 - smallButtonWidth - 10;
    team2_foul_minus_X = foul2X + foulCardWidth/2 + 10;
    team2_foul_plus_Y  = foul2Y + foulCardHeight - smallButtonHeight - 20;
    team2_foul_minus_Y = team2_foul_plus_Y;

    setTimeoutPositions();
}
function setTimeoutPositions() {
    // Timeout cards positioned below foul cards
    timeout1X = foul1X;
    timeout1Y = foul1Y + foulCardHeight + 25;
    
    timeout2X = foul2X;
    timeout2Y = foul2Y + foulCardHeight + 25;
    
    // Timeout button centered between the two foul cards
    timeoutButtonX = width / 2 - timeoutButtonWidth / 2;
    timeoutButtonY = foul1Y + foulCardHeight / 2 - timeoutButtonHeight / 2;
    
    // Team 1 timeout buttons
    team1_timeout_plus_X = timeout1X + timeoutCardWidth/2 - smallButtonWidth - 10;
    team1_timeout_minus_X = timeout1X + timeoutCardWidth/2 + 10;
    team1_timeout_plus_Y = timeout1Y + timeoutCardHeight - smallButtonHeight - 20;
    team1_timeout_minus_Y = team1_timeout_plus_Y;
    
    // Team 2 timeout buttons
    team2_timeout_plus_X = timeout2X + timeoutCardWidth/2 - smallButtonWidth - 10;
    team2_timeout_minus_X = timeout2X + timeoutCardWidth/2 + 10;
    team2_timeout_plus_Y = timeout2Y + timeoutCardHeight - smallButtonHeight - 20;
    team2_timeout_minus_Y = team2_timeout_plus_Y;
    
    // ADDED: Update set card positions after timeout positions are set
    setSetCardPositions();
}

function draw() {
    // Background gradient
    let gradBg = drawingContext.createLinearGradient(0, 0, width, height);
    gradBg.addColorStop(0, '#4facfe');
    gradBg.addColorStop(1, '#00f2fe');
    drawingContext.fillStyle = gradBg;
    drawingContext.fillRect(0, 0, width, height);

    drawTimerBox();
    drawTimerButtons();
    drawScoreCards();

    drawFoulCard(foul1X, foul1Y, homeTeam, p1Fouls, true);
    drawFoulCard(foul2X, foul2Y, away, p2Fouls, false);

    drawFoulButtons();
    drawSetCardMiddle();
    drawSmallButton(set_btn_plus_X, set_btn_plus_Y, "+1");
    drawSmallButton(set_btn_minus_X, set_btn_minus_Y, "-1");

    drawTimeoutButton();
    drawTimeoutCard(timeout1X, timeout1Y, homeTeam, p1Timeouts, true);
    drawTimeoutCard(timeout2X, timeout2Y, away, p2Timeouts, false);
    
    // Decrease timeout animation counters
    if (p1TimeoutGlow > 0) p1TimeoutGlow -= 2;
    if (p2TimeoutGlow > 0) p2TimeoutGlow -= 2;
    if (p1TimeoutScaleAnim > 0) p1TimeoutScaleAnim -= 0.05;
    if (p2TimeoutScaleAnim > 0) p2TimeoutScaleAnim -= 0.05;

    if (p1Glow > 0) p1Glow -= 2;
    if (p2Glow > 0) p2Glow -= 2;
    if (p1ScaleAnim > 0) p1ScaleAnim -= 0.05;
    if (p2ScaleAnim > 0) p2ScaleAnim -= 0.05;

    if (pressTimer > 0) {
        pressTimer--;
        if (pressTimer === 0) pressedButton = null;
    }
    if (timeoutActive) {
        fill(0, 0, 0, 150); // Semi-transparent black overlay
        noStroke();
        rect(0, 0, width, height);
        
        // Optional: Add "TIMEOUT IN PROGRESS" text on canvas
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(40);
        textStyle(BOLD);
        text("TIMEOUT IN PROGRESS", width / 2, height / 2);
        textSize(15);
        text("If you can read this, then its prolly a good idea to switch back to the scoreVu system", width / 2, height / 2 +50);
        text("This text is not supposed to be visible unless theres some positioning issue", width / 2, height / 2 +75);
        text("Would recommend you to call the Gamecrew head n ask them to switch to the old scoreboard (ScoreVu)", width / 2, height / 2 +100);
        text("N please email me asap at muhammadibrahim.lari01@gmail.com or ask someone to get larry", width / 2, height / 2 +125);
        textStyle(NORMAL);
    }
}

function drawTimerBox() {
    // Add shadow to timer
    drawingContext.shadowOffsetX = 6;
    drawingContext.shadowOffsetY = 6;
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = "rgba(0,0,0,0.4)";

    // Gradient background (same as before)
    let seconds = totalMillis / 1000;
    let maxTime = 90;
    let timeRatio = constrain(seconds / maxTime, 0, 1);

    colorMode(HSB, 360, 100, 100);
    let c1 = color(timeRatio * 200, 80, 85);
    let c2 = color(timeRatio * 240, 70, 90);
    colorMode(RGB, 255);

    let gradBox = drawingContext.createLinearGradient(
        scoreDisX,
        scoreDisY,
        scoreDisX + scoreDisW,
        scoreDisY + scoreDisH
    );
    gradBox.addColorStop(0, `rgb(${red(c1)}, ${green(c1)}, ${blue(c1)})`);
    gradBox.addColorStop(1, `rgb(${red(c2)}, ${green(c2)}, ${blue(c2)})`);
    drawingContext.fillStyle = gradBox;
    rect(scoreDisX, scoreDisY, scoreDisW, scoreDisH, 20);

    // Pulsing border (same as before)
    if (timerRunning) {
        let pulseAmount = sin(frameCount * 0.1) * 0.5 + 0.5;
        let pulseAlpha = pulseAmount * 0.6 + 0.4;
        noFill();
        strokeWeight(4);
        stroke(255, 255, 255, pulseAlpha * 255);
        rect(scoreDisX, scoreDisY, scoreDisW, scoreDisH, 20);
        noStroke();
    }

    // Clear shadow
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;

    // Timer logic
    if (timerRunning) {
        let delta = millis() - lastUpdate;
        totalMillis -= delta;
        if (totalMillis <= 0) {
            totalMillis = 0;
            timerRunning = false;
            if (hornSound && hornSound.isLoaded()) hornSound.play();
        }
        lastUpdate = millis();
    }

    // Format timer
    let minutes = floor(totalMillis / 60000);
    let secs = floor((totalMillis % 60000) / 1000);
    let millisecs = floor((totalMillis % 1000) / 10);

    let timeText = nf(minutes, 2) + ":" + nf(secs, 2) + ":" + nf(millisecs, 2);

    fill(255);
    textFont('Arial'); // easier-to-read font
    textAlign(LEFT, CENTER);

    // Start with a big font size
    let fontSize = scoreDisH / 1.3;
    textSize(fontSize);

    // Reduce font size until text fits in rectangle
    while (textWidth(timeText) > scoreDisW - 40) { // 40px padding
        fontSize -= 1;
        textSize(fontSize);
    }

    // Center the text horizontally
    let fixedX = scoreDisX + (scoreDisW - textWidth(timeText)) / 2;
    let fixedY = scoreDisY + scoreDisH / 2;

    text(timeText, fixedX, fixedY);
}



function drawTimerButtons() {
    drawTimerButton(resetX, resetY, "Reset");
    drawTimerButton(hornX, hornY, "Horn");
    drawTimerButton(startX, startY, "Start");
    drawTimerButton(stopX, stopY, "Stop");
}

function drawScoreCards() {
    // Draw left card (team 1)
    drawCard(card1X, card1Y, homeTeam, p1, p1Glow, p1GlowColor, p1ScaleAnim,
             team1_btn_plus2_X, team1_btn_plus2_Y,
             team1_btn_plus1_X, team1_btn_plus1_Y,
             team1_btn_minus1_X, team1_btn_minus1_Y);
    
    // Draw right card (team 2)
    drawCard(card2X, card2Y, away, p2, p2Glow, p2GlowColor, p2ScaleAnim,
             team2_btn_plus2_X, team2_btn_plus2_Y,
             team2_btn_plus1_X, team2_btn_plus1_Y,
             team2_btn_minus1_X, team2_btn_minus1_Y);
}

function drawCard(x, y, teamName, score, glowAmount, glowColor, scaleAnim, btn1X, btn1Y, btn2X, btn2Y, btn3X, btn3Y) {
    // Card shadow
    drawingContext.shadowOffsetX = 6;
    drawingContext.shadowOffsetY = 6;
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = "rgba(0,0,0,0.25)";
    
    // Glow effect when score changes
    if (glowAmount > 0) {
        drawingContext.shadowBlur = 30;
        if (glowColor === "red") {
            drawingContext.shadowColor = `rgba(255, 0, 0, ${glowAmount / 60})`;
        } else {
            drawingContext.shadowColor = `rgba(255, 215, 0, ${glowAmount / 100})`;
        }
    }
    
    // Card background
    fill(240, 248, 255, 220);
    rect(x, y, cardWidth, cardHeight, 25);
    
    // Colored border gradient
    noFill();
    strokeWeight(3);
    let borderGrad = drawingContext.createLinearGradient(x, y, x + cardWidth, y + cardHeight);
    borderGrad.addColorStop(0, "rgba(54, 209, 220, 0.6)");
    borderGrad.addColorStop(1, "rgba(91, 134, 229, 0.6)");
    drawingContext.strokeStyle = borderGrad;
    rect(x, y, cardWidth, cardHeight, 25);
    
    // Clear shadow and stroke
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
    noStroke();
    
    // Team name
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(50);
    textStyle(BOLD);
    text(teamName, x + cardWidth / 2, y + 60);
    textStyle(NORMAL);
    
    // Score with bounce animation
    let scoreScale = 1.0 + (scaleAnim * 0.3);
    let scaledSize = 200 * scoreScale;
    
    textSize(scaledSize);
    fill(0);
    text(score, x + cardWidth / 2, y + 220);
    
    // Reset text size
    textSize(12);
    
    // Buttons
    drawScoreButton(btn1X, btn1Y, "+2");
    drawScoreButton(btn2X, btn2Y, "+1");
    drawScoreButton(btn3X, btn3Y, "-1");
}

function drawScoreButton(x, y, label) {
    // Create unique button ID for press detection
    let buttonId = `${x}-${y}`;
    let isPressed = (pressedButton === buttonId);
    
    // Check if hovering
    let isHovered = mouseX > x && mouseX < x + scoreButtonWidth && mouseY > y && mouseY < y + scoreButtonHeight;
    
    // Scale factor
    let scale = isPressed ? 0.95 : (isHovered ? 1.1 : 1.0);
    let scaledWidth = scoreButtonWidth * scale;
    let scaledHeight = scoreButtonHeight * scale;
    
    // Adjust position to keep button centered when scaling
    let adjustedX = x - (scaledWidth - scoreButtonWidth) / 2;
    let adjustedY = y - (scaledHeight - scoreButtonHeight) / 2;
    
    // Add shadow
    if (isPressed) {
        drawingContext.shadowOffsetX = 1;
        drawingContext.shadowOffsetY = 1;
        drawingContext.shadowBlur = 3;
    } else {
        drawingContext.shadowOffsetX = 3;
        drawingContext.shadowOffsetY = 3;
        drawingContext.shadowBlur = 8;
    }
    drawingContext.shadowColor = "rgba(0,0,0,0.15)";
    
    // Button color
    if (isPressed) {
        fill("#ff9fb0");
    } else if (isHovered) {
        fill("#ffc4d0");
    } else {
        fill("#ffe4e9");
    }
    
    stroke(0, 0, 0, 30);
    strokeWeight(2);
    rect(adjustedX, adjustedY, scaledWidth, scaledHeight, 10);
    noStroke();
    
    // Clear shadow
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
    
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(28);
    textStyle(BOLD);
    text(label, adjustedX + scaledWidth / 2, adjustedY + scaledHeight / 2);
    textStyle(NORMAL);
}

function drawTimerButton(x, y, label) {
    // Create unique button ID
    let buttonId = `timer-${x}-${y}`;
    let isPressed = (pressedButton === buttonId);
    
    // Check if hovering
    let isHovered = mouseX > x && mouseX < x + timerButtonWidth && mouseY > y && mouseY < y + timerButtonHeight;
    
    // Scale factor
    let scale = isPressed ? 0.95 : (isHovered ? 1.1 : 1.0);
    let scaledWidth = timerButtonWidth * scale;
    let scaledHeight = timerButtonHeight * scale;
    
    // Adjust position
    let adjustedX = x - (scaledWidth - timerButtonWidth) / 2;
    let adjustedY = y - (scaledHeight - timerButtonHeight) / 2;
    
    // Add shadow
    if (isPressed) {
        drawingContext.shadowOffsetX = 2;
        drawingContext.shadowOffsetY = 2;
        drawingContext.shadowBlur = 5;
    } else {
        drawingContext.shadowOffsetX = 4;
        drawingContext.shadowOffsetY = 4;
        drawingContext.shadowBlur = 10;
    }
    drawingContext.shadowColor = "rgba(0,0,0,0.2)";
    
    // Button color
    if (isPressed) {
        fill("#2e7bb5");
    } else if (isHovered) {
        fill("#5dade2");
    } else {
        fill("#2e86c1");
    }
    
    stroke(255, 255, 255, 50);
    strokeWeight(2);
    rect(adjustedX, adjustedY, scaledWidth, scaledHeight, 10);
    noStroke();
    
    // Clear shadow
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
    
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(35);
    text(label, adjustedX + scaledWidth / 2, adjustedY + scaledHeight / 2);
}

function drawFoulCard(x, y, teamName, fouls, isTeam1 = true) {
    // Shadow for glow on the CARD itself
    let glow = isTeam1 ? p1FoulGlow : p2FoulGlow;
    let glowColor = isTeam1 ? p1FoulGlowColor : p2FoulGlowColor;

    if (glow > 0) {
        drawingContext.shadowBlur = 30;
        if (glowColor === "red") drawingContext.shadowColor = `rgba(255,0,0,${glow/100})`;
        else drawingContext.shadowColor = `rgba(255,215,0,${glow/100})`;
    } else {
        drawingContext.shadowBlur = 12;
        drawingContext.shadowColor = "rgba(0,0,0,0.25)";
    }

    // Card background
    fill(240, 248, 255, 220);
    rect(x, y, foulCardWidth, foulCardHeight, 20);

    // Border gradient
    noFill();
    strokeWeight(2);
    let grad = drawingContext.createLinearGradient(x, y, x + foulCardWidth, y + foulCardHeight);
    grad.addColorStop(0, "rgba(255, 99, 71, 0.7)");
    grad.addColorStop(1, "rgba(255, 165, 0, 0.7)");
    drawingContext.strokeStyle = grad;
    rect(x, y, foulCardWidth, foulCardHeight, 20);
    noStroke();

    // Clear shadow for text
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;

    // Title
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(28);
    textStyle(BOLD);
    text("FOULS", x + foulCardWidth / 2, y + 30);

    // Foul count (number)
    let scaleAnim = isTeam1 ? p1FoulScaleAnim : p2FoulScaleAnim;
    let scoreScale = 1.0 + scaleAnim * 0.3;
    textSize(64 * scoreScale);
    fill(0);
    textStyle(NORMAL);
    text(fouls, x + foulCardWidth / 2, y + 85);

    // Decrease animation counters
    if (isTeam1) {
        if (p1FoulGlow > 0) p1FoulGlow -= 2;
        if (p1FoulScaleAnim > 0) p1FoulScaleAnim -= 0.05;
    } else {
        if (p2FoulGlow > 0) p2FoulGlow -= 2;
        if (p2FoulScaleAnim > 0) p2FoulScaleAnim -= 0.05;
    }
}

function drawFoulButtons() {
    // Team 1 foul buttons
    drawSmallButton(team1_foul_plus_X, team1_foul_plus_Y, "+1");
    drawSmallButton(team1_foul_minus_X, team1_foul_minus_Y, "-1");

    // Team 2 foul buttons
    drawSmallButton(team2_foul_plus_X, team2_foul_plus_Y, "+1");
    drawSmallButton(team2_foul_minus_X, team2_foul_minus_Y, "-1");
}

function drawSmallButton(x, y, label) {
    // Hover and pressed effect
    let isPressed = (pressedButton === `foul-${x}-${y}`);
    let isHovered = mouseX > x && mouseX < x + smallButtonWidth && mouseY > y && mouseY < y + smallButtonHeight;
    let scale = isPressed ? 0.95 : (isHovered ? 1.1 : 1.0);
    let scaledWidth = smallButtonWidth * scale;
    let scaledHeight = smallButtonHeight * scale;
    let adjustedX = x - (scaledWidth - smallButtonWidth)/2;
    let adjustedY = y - (scaledHeight - smallButtonHeight)/2;

    // Shadow
    drawingContext.shadowOffsetX = isPressed ? 2 : 4;
    drawingContext.shadowOffsetY = isPressed ? 2 : 4;
    drawingContext.shadowBlur = isPressed ? 5 : 10;
    drawingContext.shadowColor = "rgba(0,0,0,0.2)";

    // Button color
    if (isPressed) fill("#ff9fb0");
    else if (isHovered) fill("#ffc4d0");
    else fill("#ffe4e9");

    stroke(0, 0, 0, 30);
    strokeWeight(2);
    rect(adjustedX, adjustedY, scaledWidth, scaledHeight, 8);
    noStroke();

    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(24);
    textStyle(BOLD);
    text(label, adjustedX + scaledWidth/2, adjustedY + scaledHeight/2);
    textStyle(NORMAL);
}
function setSetCardPositions() {
    // Center the set card horizontally between the two score cards
    let x = width / 2 - foulCardWidth / 2;
    let y = timeout1Y; // align bottom with score cards

    // Set button positions
    set_btn_plus_X  = x + foulCardWidth / 2 - smallButtonWidth - 10;
    set_btn_minus_X = x + foulCardWidth / 2 + 10;
    set_btn_plus_Y  = y + foulCardHeight - smallButtonHeight - 20;
    set_btn_minus_Y = set_btn_plus_Y;
}

function drawSetCardMiddle() {
    let x = width / 2 - foulCardWidth / 2;
    let y = timeout1Y;

    // Glow for the card itself (optional)
    if (p1FoulGlow > 0) {
        drawingContext.shadowBlur = 30;
        drawingContext.shadowColor = `rgba(255,215,0,${p1FoulGlow/100})`;
    } else {
        drawingContext.shadowBlur = 12;
        drawingContext.shadowColor = "rgba(0,0,0,0.25)";
    }
    // Glow for the card itself
    if (setGlow > 0) {
        drawingContext.shadowBlur = 30;
        if (setGlowColor === "red") drawingContext.shadowColor = `rgba(255,0,0,${setGlow/100})`;
        else drawingContext.shadowColor = `rgba(255,215,0,${setGlow/100})`;
    } else {
        drawingContext.shadowBlur = 12;
        drawingContext.shadowColor = "rgba(0,0,0,0.25)";
    }

    // Card background
    fill(240, 248, 255, 220);
    rect(x, y, foulCardWidth, foulCardHeight, 20);

    // Border gradient
    noFill();
    strokeWeight(2);
    let grad = drawingContext.createLinearGradient(x, y, x + foulCardWidth, y + foulCardHeight);
    grad.addColorStop(0, "rgba(54, 209, 220, 0.7)");
    grad.addColorStop(1, "rgba(91, 134, 229, 0.7)");
    drawingContext.strokeStyle = grad;
    rect(x, y, foulCardWidth, foulCardHeight, 20);
    noStroke();

    // Clear shadow for text
    drawingContext.shadowBlur = 0;

    // Title
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(28);
    textStyle(BOLD);
    text("SET", x + foulCardWidth / 2, y + 30);

    // Current set number
    let scale = 1.0 + setScaleAnim * 0.3;
    textSize(64 * scale);
    textStyle(NORMAL);
    text(p1Sets, x + foulCardWidth / 2, y + 85);
    // Draw the buttons
    drawSmallButton(set_btn_plus_X, set_btn_plus_Y, "+1");
    drawSmallButton(set_btn_minus_X, set_btn_minus_Y, "-1");

    if (setGlow > 0) setGlow -= 2;
    if (setScaleAnim > 0) setScaleAnim -= 0.05;

}

function drawTimeoutCard(x, y, teamName, timeouts, isTeam1 = true) {
    // Shadow for glow on the CARD itself
    let glow = isTeam1 ? p1TimeoutGlow : p2TimeoutGlow;
    let glowColor = isTeam1 ? p1TimeoutGlowColor : p2TimeoutGlowColor;

    if (glow > 0) {
        drawingContext.shadowBlur = 30;
        if (glowColor === "red") drawingContext.shadowColor = `rgba(255,0,0,${glow/100})`;
        else drawingContext.shadowColor = `rgba(255,215,0,${glow/100})`;
    } else {
        drawingContext.shadowBlur = 12;
        drawingContext.shadowColor = "rgba(0,0,0,0.25)";
    }

    // Card background (same as your cards)
    fill(240, 248, 255, 220);
    rect(x, y, timeoutCardWidth, timeoutCardHeight, 20);

    // Border gradient (purple/orange theme for timeouts)
    noFill();
    strokeWeight(2);
    let grad = drawingContext.createLinearGradient(x, y, x + timeoutCardWidth, y + timeoutCardHeight);
    grad.addColorStop(0, "rgba(147, 51, 234, 0.7)"); // purple
    grad.addColorStop(1, "rgba(249, 115, 22, 0.7)"); // orange
    drawingContext.strokeStyle = grad;
    rect(x, y, timeoutCardWidth, timeoutCardHeight, 20);
    noStroke();

    // Clear shadow for text
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;

    // Title
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(24);
    textStyle(BOLD);
    text("TIMEOUTS", x + timeoutCardWidth / 2, y + 30);

    // Timeout count (number)
    let scaleAnim = isTeam1 ? p1TimeoutScaleAnim : p2TimeoutScaleAnim;
    let scoreScale = 1.0 + scaleAnim * 0.3;
    textSize(64 * scoreScale);
    fill(0);
    textStyle(NORMAL);
    text(timeouts, x + timeoutCardWidth / 2, y + 85);
    
    // Draw buttons
    let plusX = isTeam1 ? team1_timeout_plus_X : team2_timeout_plus_X;
    let plusY = isTeam1 ? team1_timeout_plus_Y : team2_timeout_plus_Y;
    let minusX = isTeam1 ? team1_timeout_minus_X : team2_timeout_minus_X;
    let minusY = isTeam1 ? team1_timeout_minus_Y : team2_timeout_minus_Y;
    
    drawSmallButton(plusX, plusY, "+1");
    drawSmallButton(minusX, minusY, "-1");
}

function drawTimeoutButton() {
    if (timeoutActive) return; // Hide button during active timeout
    
    let x = timeoutButtonX;
    let y = timeoutButtonY;
    
    // Create unique button ID
    let buttonId = `timeout-main`;
    let isPressed = (pressedButton === buttonId);
    
    // Check if hovering
    let isHovered = mouseX > x && mouseX < x + timeoutButtonWidth && 
                    mouseY > y && mouseY < y + timeoutButtonHeight;
    
    // Scale factor
    let scale = isPressed ? 0.95 : (isHovered ? 1.1 : 1.0);
    let scaledWidth = timeoutButtonWidth * scale;
    let scaledHeight = timeoutButtonHeight * scale;
    
    // Adjust position
    let adjustedX = x - (scaledWidth - timeoutButtonWidth) / 2;
    let adjustedY = y - (scaledHeight - timeoutButtonHeight) / 2;
    
    // Add shadow
    if (isPressed) {
        drawingContext.shadowOffsetX = 2;
        drawingContext.shadowOffsetY = 2;
        drawingContext.shadowBlur = 5;
    } else {
        drawingContext.shadowOffsetX = 4;
        drawingContext.shadowOffsetY = 4;
        drawingContext.shadowBlur = 10;
    }
    drawingContext.shadowColor = "rgba(0,0,0,0.2)";
    
    // CHANGED: Button color to match timer buttons (blue instead of purple/orange)
    if (isPressed) {
        fill("#2e7bb5");
    } else if (isHovered) {
        fill("#5dade2");
    } else {
        fill("#2e86c1");
    }
    
    stroke(255, 255, 255, 50);
    strokeWeight(2);
    rect(adjustedX, adjustedY, scaledWidth, scaledHeight, 10);
    noStroke();
    
    // Clear shadow
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 0;
    
    // Button text with icon
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(28);
    textStyle(BOLD);
    text("TIMEOUT", adjustedX + scaledWidth / 2, adjustedY + scaledHeight / 2);
    textStyle(NORMAL);
}

function startTimeout() {
    if (timeoutActive) return;
    
    // Pause the game timer if running
    timeoutWasRunning = timerRunning;
    if (timerRunning) {
        timerRunning = false;
    }
    
    timeoutActive = true;
    timeoutSecondsRemaining = 60;
    
    createTimeoutOverlay();
    updateTimeoutDisplay();
    
    // Start countdown
    timeoutInterval = setInterval(() => {
        timeoutSecondsRemaining--;
        updateTimeoutDisplay();
        
        if (timeoutSecondsRemaining <= 0) {
            endTimeout();
        }
    }, 1000);
}

function createTimeoutOverlay() {
    // Create overlay div
    timeoutOverlay = document.createElement('div');
    timeoutOverlay.id = 'timeoutOverlay';
    timeoutOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create timeout box
    let timeoutBox = document.createElement('div');
    timeoutBox.id = 'timeoutBox';
    timeoutBox.style.cssText = `
        background: rgb(240, 248, 255);
        border-radius: 25px;
        padding: 60px 80px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        min-width: 500px;
        text-align: center;
        border: 4px solid #9333ea;
        animation: slideDown 0.4s ease;
    `;
    
    // Header
    let header = document.createElement('h2');
    header.textContent = 'TIMEOUT';
    header.style.cssText = `
        margin: 0 0 40px 0;
        font-size: 48px;
        font-weight: bold;
        color: #000;
        font-family: 'Teko', sans-serif;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    `;
    
    // Timer display
    let timerDisplay = document.createElement('div');
    timerDisplay.id = 'timeoutTimerDisplay';
    timerDisplay.style.cssText = `
        font-size: 120px;
        font-weight: bold;
        color: #000;
        margin: 40px 0;
        font-family: 'Courier New', monospace;
        letter-spacing: 8px;
    `;
    
    // Cancel button
    let cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = cancelTimeout;
    cancelBtn.style.cssText = `
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
        border: none;
        padding: 15px 40px;
        font-size: 24px;
        font-weight: bold;
        border-radius: 10px;
        cursor: pointer;
        margin-top: 30px;
        transition: all 0.3s;
        font-family: 'Teko', sans-serif;
    `;
    cancelBtn.onmouseover = () => {
        cancelBtn.style.transform = 'translateY(-2px)';
        cancelBtn.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
    };
    cancelBtn.onmouseout = () => {
        cancelBtn.style.transform = 'translateY(0)';
        cancelBtn.style.boxShadow = 'none';
    };
    
    // Assemble
    timeoutBox.appendChild(header);
    timeoutBox.appendChild(timerDisplay);
    timeoutBox.appendChild(cancelBtn);
    timeoutOverlay.appendChild(timeoutBox);
    document.body.appendChild(timeoutOverlay);
    
    // Add CSS animations
    let style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideDown {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);
}

function updateTimeoutDisplay() {
    let display = document.getElementById('timeoutTimerDisplay');
    let box = document.getElementById('timeoutBox');
    if (!display || !box) return;
    
    let minutes = Math.floor(timeoutSecondsRemaining / 60);
    let seconds = timeoutSecondsRemaining % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Color transition and pulse in last 15 seconds
    if (timeoutSecondsRemaining <= 15) {
        let ratio = timeoutSecondsRemaining / 15;
        let r = Math.floor(255 * (1 - ratio) + 0 * ratio);
        let g = Math.floor(0 * (1 - ratio) + 0 * ratio);
        let b = Math.floor(0 * (1 - ratio) + 0 * ratio);
        display.style.color = `rgb(${r}, ${g}, ${b})`;
        
        if (timeoutSecondsRemaining <= 10) {
            display.style.animation = 'pulse 0.5s ease-in-out infinite';
            box.style.borderColor = '#ef4444';
            box.style.borderWidth = '6px';
        }
    }
}

function endTimeout() {
    clearInterval(timeoutInterval);
    timeoutInterval = null;
    
    // Play horn sound
    if (hornSound && hornSound.isLoaded()) {
        hornSound.play();
    }
    
    // Wait 3 seconds then close
    setTimeout(() => {
        closeTimeout();
    }, 3000);
}

function cancelTimeout() {
    clearInterval(timeoutInterval);
    timeoutInterval = null;
    closeTimeout();
}

function closeTimeout() {
    if (timeoutOverlay && timeoutOverlay.parentNode) {
        timeoutOverlay.parentNode.removeChild(timeoutOverlay);
    }
    timeoutOverlay = null;
    timeoutActive = false;
    timeoutSecondsRemaining = 60;
    
    // Timer stays paused after timeout (as requested)
}


function mousePressed() {
    if (timeoutActive) return;
    // ----------- SCORE BUTTONS ------------

    // Team 1 score buttons
    if (isPointInRect(mouseX, mouseY, team1_btn_plus1_X, team1_btn_plus1_Y, scoreButtonWidth, scoreButtonHeight)) {
        pressedButton = `${team1_btn_plus1_X}-${team1_btn_plus1_Y}`;
        pressTimer = 10;
        p1++;
        p1Glow = 100;
        p1GlowColor = "gold";
        p1ScaleAnim = 1.0;
    }
    if (isPointInRect(mouseX, mouseY, team1_btn_plus2_X, team1_btn_plus2_Y, scoreButtonWidth, scoreButtonHeight)) {
        pressedButton = `${team1_btn_plus2_X}-${team1_btn_plus2_Y}`;
        pressTimer = 10;
        p1 += 2;
        p1Glow = 100;
        p1GlowColor = "gold";
        p1ScaleAnim = 1.0;
    }
    if (isPointInRect(mouseX, mouseY, team1_btn_minus1_X, team1_btn_minus1_Y, scoreButtonWidth, scoreButtonHeight)) {
        pressedButton = `${team1_btn_minus1_X}-${team1_btn_minus1_Y}`;
        pressTimer = 10;
        if (p1 > 0) {
            p1--;
            p1Glow = 100;
            p1GlowColor = "red";
            p1ScaleAnim = 1.0;
        }
    }

    // Team 2 score buttons
    if (isPointInRect(mouseX, mouseY, team2_btn_plus1_X, team2_btn_plus1_Y, scoreButtonWidth, scoreButtonHeight)) {
        pressedButton = `${team2_btn_plus1_X}-${team2_btn_plus1_Y}`;
        pressTimer = 10;
        p2++;
        p2Glow = 100;
        p2GlowColor = "gold";
        p2ScaleAnim = 1.0;
    }
    if (isPointInRect(mouseX, mouseY, team2_btn_plus2_X, team2_btn_plus2_Y, scoreButtonWidth, scoreButtonHeight)) {
        pressedButton = `${team2_btn_plus2_X}-${team2_btn_plus2_Y}`;
        pressTimer = 10;
        p2 += 2;
        p2Glow = 100;
        p2GlowColor = "gold";
        p2ScaleAnim = 1.0;
    }
    if (isPointInRect(mouseX, mouseY, team2_btn_minus1_X, team2_btn_minus1_Y, scoreButtonWidth, scoreButtonHeight)) {
        pressedButton = `${team2_btn_minus1_X}-${team2_btn_minus1_Y}`;
        pressTimer = 10;
        if (p2 > 0) {
            p2--;
            p2Glow = 100;
            p2GlowColor = "red";
            p2ScaleAnim = 1.0;
        }
    }
    // Middle set buttons
    if (isPointInRect(mouseX, mouseY, set_btn_plus_X, set_btn_plus_Y, smallButtonWidth, smallButtonHeight)) {
        p1Sets++;
        pressedButton = "set-plus";
        pressTimer = 10;
        setGlow = 100; // trigger glow
        setGlowColor = "gold";
        setScaleAnim = 1.0;
    }

    if (isPointInRect(mouseX, mouseY, set_btn_minus_X, set_btn_minus_Y, smallButtonWidth, smallButtonHeight)) {
        if (p1Sets > 0){
        p1Sets--;
        pressedButton = "set-minus";
        pressTimer = 10;
        setGlow = 100; // trigger glow
        setGlowColor = "red";
        setScaleAnim = 1.0;
        }
    }


    // ----------- FOUL BUTTONS WITH ANIMATION ------------

    // Team 1 foul buttons
    if (isPointInRect(mouseX, mouseY, team1_foul_plus_X, team1_foul_plus_Y, smallButtonWidth, smallButtonHeight)) {
    pressedButton = `foul1-plus`;
    pressTimer = 10;
    p1Fouls++;
    // Use foul glow + scale, NOT score glow
    p1FoulGlow = 100;
    p1FoulGlowColor = "gold";
    p1FoulScaleAnim = 1.0;
}

if (isPointInRect(mouseX, mouseY, team1_foul_minus_X, team1_foul_minus_Y, smallButtonWidth, smallButtonHeight)) {
    pressedButton = `foul1-minus`;
    pressTimer = 10;
    if (p1Fouls > 0) {
        p1Fouls--;
        p1FoulGlow = 100;
        p1FoulGlowColor = "red";
        p1FoulScaleAnim = 1.0;
    }
}

// Team 2 foul buttons
if (isPointInRect(mouseX, mouseY, team2_foul_plus_X, team2_foul_plus_Y, smallButtonWidth, smallButtonHeight)) {
    pressedButton = `foul2-plus`;
    pressTimer = 10;
    p2Fouls++;
    p2FoulGlow = 100;
    p2FoulGlowColor = "gold";
    p2FoulScaleAnim = 1.0;
}

if (isPointInRect(mouseX, mouseY, team2_foul_minus_X, team2_foul_minus_Y, smallButtonWidth, smallButtonHeight)) {
    pressedButton = `foul2-minus`;
    pressTimer = 10;
    if (p2Fouls > 0) {
        p2Fouls--;
        p2FoulGlow = 100;
        p2FoulGlowColor = "red";
        p2FoulScaleAnim = 1.0;
    }
}

    // ----------- TIMER BUTTONS ------------

    if (isPointInRect(mouseX, mouseY, resetX, resetY, timerButtonWidth, timerButtonHeight)) {
        pressedButton = `timer-${resetX}-${resetY}`;
        pressTimer = 10;
        p1 = 0;
        p2 = 0;
        p1Fouls = 0;
        p2Fouls = 0;
        totalMillis = 0;
        p1Glow = 0;
        p2Glow = 0;
        p1Sets = 0;
        p1ScaleAnim = 0;
        p2ScaleAnim = 0;
        p1FoulGlow = 0;
        p2FoulGlow = 0;
        p1FoulScaleAnim = 0;
        p2FoulScaleAnim = 0;
        setGlow = 0;
        setScaleAnim = 0;
        p1Timeouts = 2;
        p2Timeouts = 2;
        p1TimeoutGlow = 0;
        p2TimeoutGlow = 0;
        p1TimeoutScaleAnim = 0;
        p2TimeoutScaleAnim = 0;
    }

    if (isPointInRect(mouseX, mouseY, hornX, hornY, timerButtonWidth, timerButtonHeight)) {
        pressedButton = `timer-${hornX}-${hornY}`;
        pressTimer = 10;
        if (hornSound.isPlaying()) hornSound.stop();
        hornSound.play();
    }

    if (isPointInRect(mouseX, mouseY, startX, startY, timerButtonWidth, timerButtonHeight)) {
        pressedButton = `timer-${startX}-${startY}`;
        pressTimer = 10;
        timerRunning = true;
        lastUpdate = millis();
    }

    if (isPointInRect(mouseX, mouseY, stopX, stopY, timerButtonWidth, timerButtonHeight)) {
        pressedButton = `timer-${stopX}-${stopY}`;
        pressTimer = 10;
        timerRunning = false;
    }

    if (isPointInRect(mouseX, mouseY, timeoutButtonX, timeoutButtonY, timeoutButtonWidth, timeoutButtonHeight)) {
        if (!timeoutActive) {
            pressedButton = `timeout-main`;
            pressTimer = 10;
            startTimeout();
        }
    }

     if (isPointInRect(mouseX, mouseY, team1_timeout_plus_X, team1_timeout_plus_Y, smallButtonWidth, smallButtonHeight)) {
        if (p1Timeouts < 10) {
            pressedButton = `timeout1-plus`;
            pressTimer = 10;
            p1Timeouts++;
            p1TimeoutGlow = 100;
            p1TimeoutGlowColor = "gold";
            p1TimeoutScaleAnim = 1.0;
        }
    }
    
    if (isPointInRect(mouseX, mouseY, team1_timeout_minus_X, team1_timeout_minus_Y, smallButtonWidth, smallButtonHeight)) {
        if (p1Timeouts > 0) {
            pressedButton = `timeout1-minus`;
            pressTimer = 10;
            p1Timeouts--;
            p1TimeoutGlow = 100;
            p1TimeoutGlowColor = "red";
            p1TimeoutScaleAnim = 1.0;
        }
    }
    
    // Team 2 timeout buttons
    if (isPointInRect(mouseX, mouseY, team2_timeout_plus_X, team2_timeout_plus_Y, smallButtonWidth, smallButtonHeight)) {
        if (p2Timeouts < 10) {
            pressedButton = `timeout2-plus`;
            pressTimer = 10;
            p2Timeouts++;
            p2TimeoutGlow = 100;
            p2TimeoutGlowColor = "gold";
            p2TimeoutScaleAnim = 1.0;
        }
    }
    
    if (isPointInRect(mouseX, mouseY, team2_timeout_minus_X, team2_timeout_minus_Y, smallButtonWidth, smallButtonHeight)) {
        if (p2Timeouts > 0) {
            pressedButton = `timeout2-minus`;
            pressTimer = 10;
            p2Timeouts--;
            p2TimeoutGlow = 100;
            p2TimeoutGlowColor = "red";
            p2TimeoutScaleAnim = 1.0;
        }
    }

    // ----------- EDIT TEAM NAMES ------------

    if (mouseX > card1X && mouseX < card1X + cardWidth &&
        mouseY > card1Y && mouseY < card1Y + 100) {
        let input = prompt("Enter home team name:", homeTeam);
        if (input) homeTeam = input.trim();
    }

    if (mouseX > card2X && mouseX < card2X + cardWidth &&
        mouseY > card2Y && mouseY < card2Y + 100) {
        let input = prompt("Enter away team name:", away);
        if (input) away = input.trim();
    }

    // ----------- EDIT TIMER ------------

    if (mouseX > scoreDisX && mouseX < scoreDisX + scoreDisW &&
        mouseY > scoreDisY && mouseY < scoreDisY + scoreDisH) {
        let input = prompt("Enter time as MM:SS");
        if (!input) return;
        input = input.trim();
        let m = 0, s = 0;
        if (input.includes(":")) {
            let parts = input.split(":");
            m = int(parts[0]);
            s = int(parts[1]);
        } else {
            let num = int(input);
            m = floor(num / 100);
            s = num % 100;
        }
        if (s >= 60) s = 59;
        if (isNaN(m) || isNaN(s) || m < 0 || s < 0) {
            alert("Invalid time");
            return;
        }
        totalMillis = (m * 60 + s) * 1000;
        lastUpdate = millis();
    }
}

function isPointInRect(px, py, rx, ry, rw, rh) {
    return px > rx && px < rx + rw && py > ry && py < ry + rh;
}

function keyPressed() {
    // Spacebar - Toggle timer
    if (key === ' ') {
        if (timerRunning) {
            timerRunning = false;
        } else {
            timerRunning = true;
            lastUpdate = millis();
        }
        return false;
    }
    
    // H - Horn
    if (key === 'h' || key === 'H') {
        if (hornSound.isPlaying()) hornSound.stop();
        hornSound.play();
    }
    
    // R - Reset
    if (key === 'r' || key === 'R') {
        pressTimer = 10;
        p1 = 0;
        p2 = 0;
        p1Fouls = 0;
        p2Fouls = 0;
        totalMillis = 0;
        p1Glow = 0;
        p2Glow = 0;
        p1Sets = 0;
        p1ScaleAnim = 0;
        p2ScaleAnim = 0;
        p1FoulGlow = 0;
        p2FoulGlow = 0;
        p1FoulScaleAnim = 0;
        p2FoulScaleAnim = 0;
        setGlow = 0;
        setScaleAnim = 0;
        p1Timeouts = 2;
        p2Timeouts = 2;
        p1TimeoutGlow = 0;
        p2TimeoutGlow = 0;
        p1TimeoutScaleAnim = 0;
        p2TimeoutScaleAnim = 0;
    }
}
